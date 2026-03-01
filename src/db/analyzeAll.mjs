import fs from 'fs';

// ── LaTeX Error Counter (same patterns as auditDB.mjs) ──
function countLatexErrors(text) {
    if (!text) return { count: 0, details: [] };
    let errors = 0;
    const details = [];

    // 1. {{num}}{{den}} instead of \frac{num}{den}
    const p1 = (text.match(/(?<!\\frac)\{\{[^}]+\}\}\{\{[^}]+\}\}/g) || []);
    errors += p1.length;
    p1.forEach(m => details.push(`Missing \\frac: ${m.substring(0, 50)}`));

    // 2. sin/cos/tan etc without backslash
    const p2 = (text.match(/(?<![\\a-zA-Z])(sin|cos|tan|cot|sec|csc|log|ln)(?![a-zA-Z])/g) || []);
    errors += p2.length;
    p2.forEach(m => details.push(`Missing backslash: ${m}`));

    // 3. \frac{\mkern malformed
    const p3 = (text.match(/\\frac\{\\mkern/g) || []);
    errors += p3.length;
    p3.forEach(() => details.push("Malformed \\frac with \\mkern"));

    // 4. trig^2 incorrectly in frac numerator
    const p4 = (text.match(/\\frac\{\\(cos|sin|tan)\s*\^/g) || []);
    errors += p4.length;
    p4.forEach(() => details.push("Malformed trig^2 \\frac"));

    // 5. \left/\right mismatch
    const leftC = (text.match(/\\left[\(\[\{]/g) || []).length;
    const rightC = (text.match(/\\right[\)\]\}]/g) || []).length;
    if (leftC !== rightC) {
        errors += Math.abs(leftC - rightC);
        details.push(`Mismatched \\left/\\right: ${leftC}L / ${rightC}R`);
    }

    // 6. Empty \frac{}{}
    const p6 = (text.match(/\\frac\{\s*\}\{\s*\}/g) || []);
    errors += p6.length;
    p6.forEach(() => details.push("Empty \\frac{}{}"));

    // 7. Unclosed $ (odd count)
    const dollarC = (text.match(/\$/g) || []).length;
    if (dollarC % 2 !== 0) {
        errors += 1;
        details.push(`Unclosed $ (${dollarC})`);
    }

    // 8. Unmatched braces
    let braceDepth = 0;
    let unmatchedBraces = 0;
    for (const ch of text) {
        if (ch === '{') braceDepth++;
        else if (ch === '}') {
            if (braceDepth <= 0) unmatchedBraces++;
            else braceDepth--;
        }
    }
    unmatchedBraces += braceDepth; // unclosed open braces
    if (unmatchedBraces > 0) {
        errors += unmatchedBraces;
        details.push(`Unmatched braces: ${unmatchedBraces}`);
    }

    return { count: errors, details };
}

function analyzeFile(filePath) {
    const rawData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(rawData);

    const stats = {
        file: filePath.split('/').pop(),
        totalQuestions: data.length,
        fileSize: fs.statSync(filePath).size,
        subjects: {},
        topics: new Set(),
        errorsByType: {},
        totalErrors: 0,
        questionsWithErrors: 0,
        fieldErrors: { question_text: 0, options: 0, explanation: 0 },
        missingFields: { question_text: 0, options: 0, explanation: 0, correct_answers: 0 },
        duplicateIds: 0,
        sampleIds: [],
    };

    const idSet = new Set();
    const errorQuestions = new Set();

    data.forEach((q, idx) => {
        // Track IDs
        const qid = q.question_id || `index_${idx}`;
        if (idSet.has(qid)) stats.duplicateIds++;
        idSet.add(qid);
        if (idx < 3) stats.sampleIds.push(qid);

        // Subjects & topics
        const sub = q.subject || 'Unknown';
        stats.subjects[sub] = (stats.subjects[sub] || 0) + 1;
        if (q.topic) stats.topics.add(q.topic);

        // Missing fields
        if (!q.question_text) stats.missingFields.question_text++;
        if (!q.options || !Array.isArray(q.options) || q.options.length === 0) stats.missingFields.options++;
        if (!q.explanation) stats.missingFields.explanation++;
        if (!q.correct_answers || (Array.isArray(q.correct_answers) && q.correct_answers.length === 0)) stats.missingFields.correct_answers++;

        // LaTeX errors
        let qErrors = 0;
        if (q.question_text) {
            const r = countLatexErrors(q.question_text);
            stats.fieldErrors.question_text += r.count;
            qErrors += r.count;
            r.details.forEach(d => { stats.errorsByType[d.split(':')[0]] = (stats.errorsByType[d.split(':')[0]] || 0) + 1; });
        }
        if (q.options && Array.isArray(q.options)) {
            q.options.forEach(opt => {
                if (opt) {
                    const r = countLatexErrors(opt);
                    stats.fieldErrors.options += r.count;
                    qErrors += r.count;
                    r.details.forEach(d => { stats.errorsByType[d.split(':')[0]] = (stats.errorsByType[d.split(':')[0]] || 0) + 1; });
                }
            });
        }
        if (q.explanation) {
            const r = countLatexErrors(q.explanation);
            stats.fieldErrors.explanation += r.count;
            qErrors += r.count;
            r.details.forEach(d => { stats.errorsByType[d.split(':')[0]] = (stats.errorsByType[d.split(':')[0]] || 0) + 1; });
        }

        stats.totalErrors += qErrors;
        if (qErrors > 0) errorQuestions.add(qid);
    });

    stats.questionsWithErrors = errorQuestions.size;
    stats.uniqueTopics = stats.topics.size;
    delete stats.topics;

    // Get schema from first question
    if (data.length > 0) {
        stats.schema = Object.keys(data[0]);
    }

    return stats;
}

// ── MAIN ──
const files = [
    './src/db/allQuestions.json',
    './src/db/allQuestions_clean.json',
    './src/db/allQuestions_fixed.json',
    './src/db/quarantined_questions.json',
];

console.log('═'.repeat(80));
console.log('    COMPREHENSIVE DATABASE ANALYSIS');
console.log('═'.repeat(80));

const results = [];
for (const f of files) {
    if (!fs.existsSync(f)) { console.log(`⚠️ ${f} not found`); continue; }
    const s = analyzeFile(f);
    results.push(s);

    console.log(`\n${'─'.repeat(70)}`);
    console.log(`📁 ${s.file}`);
    console.log(`${'─'.repeat(70)}`);
    console.log(`  File size:          ${(s.fileSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Total questions:    ${s.totalQuestions}`);
    console.log(`  Schema fields:      ${s.schema.join(', ')}`);
    console.log(`  Duplicate IDs:      ${s.duplicateIds}`);
    console.log(`  Unique topics:      ${s.uniqueTopics}`);
    console.log(`  Subject breakdown:`);
    Object.entries(s.subjects).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log(`    ${k}: ${v}`));
    console.log(`  Missing fields:`);
    Object.entries(s.missingFields).forEach(([k,v]) => { if(v > 0) console.log(`    ${k}: ${v}`); });
    if (Object.values(s.missingFields).every(v => v === 0)) console.log('    (none)');
    console.log(`\n  📊 LaTeX Errors:`);
    console.log(`    Total errors:              ${s.totalErrors}`);
    console.log(`    Questions with errors:     ${s.questionsWithErrors} / ${s.totalQuestions} (${(s.questionsWithErrors/s.totalQuestions*100).toFixed(1)}%)`);
    console.log(`    Errors in question_text:   ${s.fieldErrors.question_text}`);
    console.log(`    Errors in options:         ${s.fieldErrors.options}`);
    console.log(`    Errors in explanation:     ${s.fieldErrors.explanation}`);
    console.log(`\n  Error categories:`);
    Object.entries(s.errorsByType).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log(`    ${k.trim()}: ${v}`));
}

// ── COMPARISON ──
console.log(`\n${'═'.repeat(80)}`);
console.log('    COMPARISON TABLE');
console.log('═'.repeat(80));
console.log(`${'Metric'.padEnd(30)} ${results.map(r => r.file.padStart(22)).join('')}`);
console.log('─'.repeat(30 + results.length * 22));
console.log(`${'Questions'.padEnd(30)} ${results.map(r => String(r.totalQuestions).padStart(22)).join('')}`);
console.log(`${'File Size (MB)'.padEnd(30)} ${results.map(r => (r.fileSize/1024/1024).toFixed(2).padStart(22)).join('')}`);
console.log(`${'Total LaTeX Errors'.padEnd(30)} ${results.map(r => String(r.totalErrors).padStart(22)).join('')}`);
console.log(`${'Questions w/ Errors'.padEnd(30)} ${results.map(r => String(r.questionsWithErrors).padStart(22)).join('')}`);
console.log(`${'Error Rate %'.padEnd(30)} ${results.map(r => (r.questionsWithErrors/r.totalQuestions*100).toFixed(1).padStart(22)).join('')}`);
console.log(`${'Duplicate IDs'.padEnd(30)} ${results.map(r => String(r.duplicateIds).padStart(22)).join('')}`);
console.log(`${'Missing explanations'.padEnd(30)} ${results.map(r => String(r.missingFields.explanation).padStart(22)).join('')}`);
console.log(`${'Unique Topics'.padEnd(30)} ${results.map(r => String(r.uniqueTopics).padStart(22)).join('')}`);

// ── RECOMMENDATION ──
const mainFiles = results.filter(r => !r.file.includes('quarantined'));
const best = mainFiles.reduce((a, b) => a.totalErrors < b.totalErrors ? a : b);
console.log(`\n${'═'.repeat(80)}`);
console.log('    RECOMMENDATION');
console.log('═'.repeat(80));
console.log(`\n🏆 Best file (fewest LaTeX errors): ${best.file}`);
console.log(`   Total errors: ${best.totalErrors} across ${best.questionsWithErrors} questions`);
console.log(`   Error rate: ${(best.questionsWithErrors/best.totalQuestions*100).toFixed(1)}%`);
