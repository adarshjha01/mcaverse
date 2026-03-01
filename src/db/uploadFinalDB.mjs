// src/db/uploadFinalDB.mjs
// ═══════════════════════════════════════════════════════════════════
// UPLOAD allQuestions_final.json to Firebase Firestore
// Reads the pre-fixed database (from buildFinalDB.mjs) and uploads
// all 5384 questions to the 'questions' collection.
//
// Usage: node src/db/uploadFinalDB.mjs
//        node src/db/uploadFinalDB.mjs --dry-run   (preview only)
// ═══════════════════════════════════════════════════════════════════
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIGURATION ---
const SERVICE_ACCOUNT_PATH = path.join(__dirname, '..', '..', 'serviceAccountKey.json');
const QUESTIONS_FILE = path.join(__dirname, 'allQuestions_final.json');
const COLLECTION_NAME = 'questions';
const BATCH_SIZE = 400; // Firestore limit is 500, use 400 for safety
const DRY_RUN = process.argv.includes('--dry-run');

// --- HELPER: Delete Collection ---
async function deleteCollection(db, collectionPath, batchSize) {
    const collectionRef = db.collection(collectionPath);
    const query = collectionRef.orderBy('__name__').limit(batchSize);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(db, query, resolve).catch(reject);
    });
}

async function deleteQueryBatch(db, query, resolve) {
    const snapshot = await query.get();
    const batchSize = snapshot.size;
    if (batchSize === 0) { resolve(); return; }

    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    console.log(`  🗑️  Deleted ${batchSize} documents...`);
    process.nextTick(() => deleteQueryBatch(db, query, resolve));
}

// --- MAIN ---
async function main() {
    console.log('═'.repeat(60));
    console.log('  MCAVERSE DATABASE UPLOADER');
    console.log(`  Source: allQuestions_final.json`);
    console.log(`  Target: Firestore '${COLLECTION_NAME}' collection`);
    if (DRY_RUN) console.log('  MODE: DRY RUN (no changes will be made)');
    console.log('═'.repeat(60));

    // ─── 1. Validate files ───
    if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
        console.error(`❌ serviceAccountKey.json not found at: ${SERVICE_ACCOUNT_PATH}`);
        process.exit(1);
    }
    if (!fs.existsSync(QUESTIONS_FILE)) {
        console.error(`❌ allQuestions_final.json not found! Run buildFinalDB.mjs first.`);
        process.exit(1);
    }

    // ─── 2. Load data ───
    const questions = JSON.parse(fs.readFileSync(QUESTIONS_FILE, 'utf8'));
    console.log(`\n📖 Loaded ${questions.length} questions from allQuestions_final.json`);

    // Quick stats
    const subjects = {};
    const exams = {};
    questions.forEach(q => {
        subjects[q.subject || 'Unknown'] = (subjects[q.subject || 'Unknown'] || 0) + 1;
        exams[q.exam_id || 'Unknown'] = (exams[q.exam_id || 'Unknown'] || 0) + 1;
    });
    console.log(`   Subjects: ${Object.entries(subjects).map(([k,v]) => `${k}(${v})`).join(', ')}`);
    console.log(`   Exams: ${Object.entries(exams).map(([k,v]) => `${k}(${v})`).join(', ')}`);

    // Validate all questions have IDs
    const missingIds = questions.filter(q => !q.question_id);
    if (missingIds.length > 0) {
        console.warn(`⚠️  ${missingIds.length} questions missing question_id — will get auto-generated IDs`);
    }

    if (DRY_RUN) {
        console.log('\n🔍 DRY RUN — would upload the above data. No changes made.');
        console.log('   Remove --dry-run flag to actually upload.');
        return;
    }

    // ─── 3. Initialize Firebase ───
    const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));
    initializeApp({ credential: cert(serviceAccount) });
    const db = getFirestore();
    console.log(`\n🔥 Connected to Firebase project: ${serviceAccount.project_id}`);

    // ─── 4. Delete old collection ───
    console.log(`\n🗑️  Wiping '${COLLECTION_NAME}' collection...`);
    await deleteCollection(db, COLLECTION_NAME, 500);
    console.log(`   ✅ Collection cleared.`);

    // ─── 5. Upload in batches ───
    console.log(`\n📤 Uploading ${questions.length} questions in batches of ${BATCH_SIZE}...`);
    let batch = db.batch();
    let count = 0;
    let total = 0;
    const startTime = Date.now();

    for (const q of questions) {
        const docRef = q.question_id
            ? db.collection(COLLECTION_NAME).doc(String(q.question_id))
            : db.collection(COLLECTION_NAME).doc();

        // Sanitize for Firestore (removes undefined values, etc.)
        const cleanQ = JSON.parse(JSON.stringify(q));
        batch.set(docRef, cleanQ);
        count++;
        total++;

        if (count >= BATCH_SIZE) {
            await batch.commit();
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            console.log(`   🚀 ${total} / ${questions.length} uploaded (${elapsed}s)`);
            batch = db.batch();
            count = 0;
        }
    }

    // Commit remaining
    if (count > 0) {
        await batch.commit();
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`   🚀 ${total} / ${questions.length} uploaded (${elapsed}s)`);
    }

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log('\n' + '═'.repeat(60));
    console.log(`  ✅ UPLOAD COMPLETE`);
    console.log(`  ${total} questions uploaded to '${COLLECTION_NAME}'`);
    console.log(`  Time: ${totalTime}s`);
    console.log('═'.repeat(60));
}

main().catch(err => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
});
