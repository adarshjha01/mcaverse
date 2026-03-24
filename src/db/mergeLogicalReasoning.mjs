// src/db/mergeLogicalReasoning.mjs
// ═══════════════════════════════════════════════════════════════════
// MERGE Logical Reasoning questions into allQuestions_final.json
//
// Reads logical_reasoning_final.json and merges into allQuestions_final.json.
// - New questions (by question_id) are added.
// - Existing questions (by question_id) are updated.
// - Original non-LR questions are preserved untouched.
//
// Usage: node src/db/mergeLogicalReasoning.mjs
//        node src/db/mergeLogicalReasoning.mjs --dry-run
// ═══════════════════════════════════════════════════════════════════
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIGURATION ---
const LR_FILE = path.join(__dirname, 'logical_reasoning_final.json');
const ALL_QUESTIONS_FILE = path.join(__dirname, 'allQuestions_final.json');
const BACKUP_FILE = path.join(__dirname, 'allQuestions_final.backup.json');
const DRY_RUN = process.argv.includes('--dry-run');

async function main() {
    console.log('═'.repeat(60));
    console.log('  MERGE LOGICAL REASONING → allQuestions_final.json');
    if (DRY_RUN) console.log('  MODE: DRY RUN');
    console.log('═'.repeat(60));

    // ─── 1. Validate files exist ───
    if (!fs.existsSync(LR_FILE)) {
        console.error('❌ logical_reasoning_final.json not found!');
        console.log('   Run buildLogicalReasoningDB.mjs first.');
        process.exit(1);
    }
    if (!fs.existsSync(ALL_QUESTIONS_FILE)) {
        console.error('❌ allQuestions_final.json not found!');
        process.exit(1);
    }

    // ─── 2. Load both files ───
    const lrQuestions = JSON.parse(fs.readFileSync(LR_FILE, 'utf8'));
    const allQuestions = JSON.parse(fs.readFileSync(ALL_QUESTIONS_FILE, 'utf8'));

    console.log(`\n📋 Logical Reasoning questions: ${lrQuestions.length}`);
    console.log(`📋 Existing total questions:     ${allQuestions.length}`);

    // ─── 3. Build a map of existing question IDs for fast lookup ───
    const existingMap = new Map();
    allQuestions.forEach((q, idx) => {
        if (q.question_id) {
            existingMap.set(q.question_id, idx);
        }
    });

    // ─── 4. Merge ───
    let added = 0;
    let updated = 0;
    let skipped = 0;

    for (const lrQ of lrQuestions) {
        if (!lrQ.question_id) {
            console.warn(`   ⚠️  Skipping LR question with no question_id`);
            skipped++;
            continue;
        }

        if (existingMap.has(lrQ.question_id)) {
            // Update existing
            const idx = existingMap.get(lrQ.question_id);
            allQuestions[idx] = lrQ;
            updated++;
        } else {
            // Add new
            allQuestions.push(lrQ);
            existingMap.set(lrQ.question_id, allQuestions.length - 1);
            added++;
        }
    }

    // ─── 5. Summary ───
    console.log('\n' + '─'.repeat(60));
    console.log('  📊 MERGE SUMMARY');
    console.log(`  Added:   ${added} new questions`);
    console.log(`  Updated: ${updated} existing questions`);
    console.log(`  Skipped: ${skipped} (missing ID)`);
    console.log(`  New total: ${allQuestions.length} questions`);
    console.log('─'.repeat(60));

    // Subject breakdown
    const subjects = {};
    allQuestions.forEach(q => {
        const s = q.subject || 'Unknown';
        subjects[s] = (subjects[s] || 0) + 1;
    });
    console.log('\n  Subject breakdown:');
    Object.entries(subjects).sort((a, b) => b[1] - a[1]).forEach(([subj, count]) => {
        console.log(`    ${subj}: ${count}`);
    });

    if (DRY_RUN) {
        console.log('\n🔍 DRY RUN — No files written.');
        return;
    }

    // ─── 6. Backup & write ───
    console.log(`\n💾 Creating backup: allQuestions_final.backup.json`);
    fs.copyFileSync(ALL_QUESTIONS_FILE, BACKUP_FILE);

    fs.writeFileSync(ALL_QUESTIONS_FILE, JSON.stringify(allQuestions, null, 2));
    console.log(`✅ Wrote ${allQuestions.length} questions to allQuestions_final.json`);
    console.log('\n   Next: Run uploadFinalDB.mjs to push to Firestore');
}

main().catch(err => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
});
