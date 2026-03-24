// src/db/buildLogicalReasoningDB.mjs
// ═══════════════════════════════════════════════════════════════════
// BUILD LOGICAL REASONING DATABASE
//
// Takes logical_reasoning_raw.json (questions with image filenames)
// and resolves image filenames → public URLs using image-url-map.json.
// Outputs logical_reasoning_final.json ready for merge.
//
// Usage: node src/db/buildLogicalReasoningDB.mjs
//        node src/db/buildLogicalReasoningDB.mjs --dry-run
// ═══════════════════════════════════════════════════════════════════
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIGURATION ---
const RAW_FILE = path.join(__dirname, 'logical_reasoning_raw.json');
const URL_MAP_FILE = path.join(__dirname, 'image-url-map.json');
const OUTPUT_FILE = path.join(__dirname, 'logical_reasoning_final.json');
const DRY_RUN = process.argv.includes('--dry-run');

// --- VALID SCHEMA ---
const REQUIRED_FIELDS = ['question_id', 'question_text', 'options', 'correct_answers'];
const VALID_SUBJECTS = ['Logical Reasoning'];
const VALID_EXAMS = ['nimcet', 'cuet', 'mah_mca_cet', 'practice'];
const VALID_DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const VALID_TOPICS = [
    // Verbal Reasoning
    'Coding-Decoding', 'Blood Relations', 'Direction Sense', 'Order and Ranking',
    'Syllogisms', 'Statement and Assumptions', 'Statement and Conclusions',
    'Cause and Effect', 'Course of Action', 'Critical Reasoning',
    // Analytical Reasoning
    'Seating Arrangement', 'Puzzles', 'Input-Output', 'Data Sufficiency',
    // Non-Verbal Reasoning
    'Series Completion', 'Analogy', 'Classification', 'Mirror and Water Image',
    'Paper Folding and Cutting', 'Cubes and Dice', 'Figure Formation',
    'Embedded Figures', 'Pattern Recognition',
    // Quantitative Reasoning
    'Number Series', 'Letter Series', 'Alphanumeric Series',
    'Mathematical Operations', 'Inequalities',
    // Logical Deduction
    'Venn Diagrams', 'Logical Connectives', 'Binary Logic',
    'Arrangements', 'Calendars', 'Clocks',
    // Catch-all
    'Miscellaneous'
];

function validate(question, index) {
    const errors = [];
    const qid = question.question_id || `[index ${index}]`;

    // Required fields
    for (const field of REQUIRED_FIELDS) {
        if (question[field] === undefined || question[field] === null) {
            errors.push(`Missing required field: ${field}`);
        }
    }

    // question_id format: LR001, LR002, etc.
    if (question.question_id && !/^LR\d{3,}$/.test(question.question_id)) {
        errors.push(`Invalid question_id format: ${question.question_id}. Expected LR001, LR002, etc.`);
    }

    // Options must be an array of 4 strings
    if (Array.isArray(question.options)) {
        if (question.options.length < 2) {
            errors.push(`Too few options: ${question.options.length}`);
        }
        question.options.forEach((opt, i) => {
            if (typeof opt !== 'string' || opt.trim() === '') {
                errors.push(`Option ${i} is empty or not a string`);
            }
        });
    }

    // correct_answers must be valid indices
    if (Array.isArray(question.correct_answers) && Array.isArray(question.options)) {
        for (const idx of question.correct_answers) {
            if (typeof idx !== 'number' || idx < 0 || idx >= question.options.length) {
                errors.push(`Invalid correct_answer index: ${idx}`);
            }
        }
    }

    // Validate enums
    if (question.subject && !VALID_SUBJECTS.includes(question.subject)) {
        errors.push(`Invalid subject: ${question.subject}`);
    }
    if (question.exam_id && !VALID_EXAMS.includes(question.exam_id)) {
        errors.push(`Invalid exam_id: ${question.exam_id}`);
    }
    if (question.difficulty && !VALID_DIFFICULTIES.includes(question.difficulty)) {
        errors.push(`Invalid difficulty: ${question.difficulty}`);
    }
    if (question.topic && !VALID_TOPICS.includes(question.topic)) {
        errors.push(`Unknown topic: ${question.topic} (still allowed, just a warning)`);
    }

    return { qid, errors };
}

async function main() {
    console.log('═'.repeat(60));
    console.log('  LOGICAL REASONING DATABASE BUILDER');
    if (DRY_RUN) console.log('  MODE: DRY RUN');
    console.log('═'.repeat(60));

    // ─── 1. Read raw questions ───
    if (!fs.existsSync(RAW_FILE)) {
        console.error('❌ logical_reasoning_raw.json not found!');
        console.log('   Create it first. See logical_reasoning_template.json for the format.');
        process.exit(1);
    }

    const rawQuestions = JSON.parse(fs.readFileSync(RAW_FILE, 'utf8'));
    console.log(`\n📋 Loaded ${rawQuestions.length} raw questions`);

    // ─── 2. Read image URL map (optional) ───
    let urlMap = {};
    if (fs.existsSync(URL_MAP_FILE)) {
        urlMap = JSON.parse(fs.readFileSync(URL_MAP_FILE, 'utf8'));
        console.log(`📸 Loaded image URL map: ${Object.keys(urlMap).length} entries`);
    } else {
        console.log('⚠️  No image-url-map.json found. Image filenames won\'t be resolved to URLs.');
        console.log('   Run uploadQuestionImages.mjs first if your questions have images.');
    }

    // ─── 3. Process each question ───
    const finalQuestions = [];
    let totalErrors = 0;
    let imagesResolved = 0;
    let imagesMissing = 0;

    for (let i = 0; i < rawQuestions.length; i++) {
        const raw = { ...rawQuestions[i] };

        // --- Resolve image filenames to URLs ---
        // question_images: array of filenames → array of URLs
        if (Array.isArray(raw.question_images)) {
            raw.question_images = raw.question_images.map(filename => {
                if (filename.startsWith('http://') || filename.startsWith('https://')) {
                    imagesResolved++;
                    return filename; // Already a URL
                }
                if (urlMap[filename]) {
                    imagesResolved++;
                    return urlMap[filename];
                }
                imagesMissing++;
                console.warn(`   ⚠️  ${raw.question_id}: Image not found in URL map: ${filename}`);
                return filename; // Keep filename as fallback
            });
        }

        // option_images: object mapping option index → filename → URL
        if (raw.option_images && typeof raw.option_images === 'object') {
            const resolvedOptionImages = {};
            for (const [key, filename] of Object.entries(raw.option_images)) {
                if (filename.startsWith('http://') || filename.startsWith('https://')) {
                    resolvedOptionImages[key] = filename;
                    imagesResolved++;
                } else if (urlMap[filename]) {
                    resolvedOptionImages[key] = urlMap[filename];
                    imagesResolved++;
                } else {
                    resolvedOptionImages[key] = filename;
                    imagesMissing++;
                    console.warn(`   ⚠️  ${raw.question_id}: Option image not found: ${filename}`);
                }
            }
            raw.option_images = resolvedOptionImages;
        }

        // explanation_images: array of filenames → array of URLs
        if (Array.isArray(raw.explanation_images)) {
            raw.explanation_images = raw.explanation_images.map(filename => {
                if (filename.startsWith('http://') || filename.startsWith('https://')) {
                    imagesResolved++;
                    return filename;
                }
                if (urlMap[filename]) {
                    imagesResolved++;
                    return urlMap[filename];
                }
                imagesMissing++;
                console.warn(`   ⚠️  ${raw.question_id}: Explanation image not found: ${filename}`);
                return filename;
            });
        }

        // --- Set defaults ---
        if (!raw.subject) raw.subject = 'Logical Reasoning';
        if (!raw.exam_id) raw.exam_id = 'practice';
        if (!raw.difficulty) raw.difficulty = 'Medium';
        if (!raw.tags) raw.tags = [];
        
        // Auto-generate tags
        const autoTags = new Set(raw.tags.map(t => t.toLowerCase()));
        if (raw.topic) autoTags.add(raw.topic.toLowerCase().replace(/\s+/g, '_'));
        if (raw.difficulty) autoTags.add(raw.difficulty.toLowerCase());
        autoTags.add('logical_reasoning');
        if (raw.exam_id && raw.exam_id !== 'practice') autoTags.add(raw.exam_id);
        raw.tags = [...autoTags];

        // --- Validate ---
        const { qid, errors } = validate(raw, i);
        if (errors.length > 0) {
            totalErrors += errors.length;
            console.error(`\n❌ ${qid} has ${errors.length} error(s):`);
            errors.forEach(e => console.error(`   • ${e}`));
        }

        finalQuestions.push(raw);
    }

    // ─── 4. Summary ───
    console.log('\n' + '─'.repeat(60));
    console.log(`  📊 SUMMARY`);
    console.log(`  Total questions: ${finalQuestions.length}`);
    console.log(`  Images resolved: ${imagesResolved}`);
    console.log(`  Images missing:  ${imagesMissing}`);
    console.log(`  Validation errors: ${totalErrors}`);
    console.log('─'.repeat(60));

    if (totalErrors > 0) {
        console.warn('\n⚠️  There are validation errors. Fix them before uploading to production.');
    }

    if (DRY_RUN) {
        console.log('\n🔍 DRY RUN — No files written.');
        return;
    }

    // ─── 5. Write output ───
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalQuestions, null, 2));
    console.log(`\n✅ Wrote ${finalQuestions.length} questions to logical_reasoning_final.json`);
    console.log('   Next: Run mergeLogicalReasoning.mjs to merge into allQuestions_final.json');
}

main().catch(err => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
});
