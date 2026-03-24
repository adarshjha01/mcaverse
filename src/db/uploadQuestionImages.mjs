// src/db/uploadQuestionImages.mjs
// ═══════════════════════════════════════════════════════════════════
// UPLOAD question images to Firebase Storage
// 
// Reads all images from src/db/question-images/ and uploads them
// to Firebase Storage at: question-images/{filename}
// Generates image-url-map.json mapping filename → public URL.
//
// Usage: node src/db/uploadQuestionImages.mjs
//        node src/db/uploadQuestionImages.mjs --dry-run
// ═══════════════════════════════════════════════════════════════════
import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIGURATION ---
const SERVICE_ACCOUNT_PATH = path.join(__dirname, '..', '..', 'serviceAccountKey.json');
const IMAGES_DIR = path.join(__dirname, 'question-images');
const OUTPUT_MAP_FILE = path.join(__dirname, 'image-url-map.json');
const STORAGE_FOLDER = 'question-images'; // folder inside Firebase Storage bucket
const DRY_RUN = process.argv.includes('--dry-run');

// Supported image extensions
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']);

async function main() {
    console.log('═'.repeat(60));
    console.log('  QUESTION IMAGE UPLOADER');
    console.log(`  Source: ${IMAGES_DIR}`);
    console.log(`  Target: Firebase Storage → ${STORAGE_FOLDER}/`);
    if (DRY_RUN) console.log('  MODE: DRY RUN');
    console.log('═'.repeat(60));

    // ─── 1. Validate ───
    if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
        console.error('❌ serviceAccountKey.json not found!');
        process.exit(1);
    }
    if (!fs.existsSync(IMAGES_DIR)) {
        console.error(`❌ Images directory not found: ${IMAGES_DIR}`);
        console.log('   Create it and add your question images first.');
        process.exit(1);
    }

    // ─── 2. Scan images ───
    const allFiles = fs.readdirSync(IMAGES_DIR);
    const imageFiles = allFiles.filter(f => {
        const ext = path.extname(f).toLowerCase();
        return IMAGE_EXTENSIONS.has(ext);
    });

    if (imageFiles.length === 0) {
        console.log('\n⚠️  No image files found in question-images/');
        console.log('   Supported formats: .png, .jpg, .jpeg, .gif, .webp, .svg');
        process.exit(0);
    }

    console.log(`\n📸 Found ${imageFiles.length} images to upload:`);
    imageFiles.forEach(f => console.log(`   • ${f}`));

    // ─── 3. Load existing map (for incremental uploads) ───
    let existingMap = {};
    if (fs.existsSync(OUTPUT_MAP_FILE)) {
        existingMap = JSON.parse(fs.readFileSync(OUTPUT_MAP_FILE, 'utf8'));
        console.log(`\n📋 Existing map has ${Object.keys(existingMap).length} entries.`);
    }

    if (DRY_RUN) {
        const newFiles = imageFiles.filter(f => !existingMap[f]);
        console.log(`\n🔍 DRY RUN — ${newFiles.length} new images would be uploaded.`);
        newFiles.forEach(f => console.log(`   📤 ${f}`));
        return;
    }

    // ─── 4. Initialize Firebase ───
    const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));
    const app = initializeApp({ 
        credential: cert(serviceAccount),
        storageBucket: `${serviceAccount.project_id}.firebasestorage.app`
    });
    const bucket = getStorage(app).bucket();
    console.log(`\n🔥 Connected to Storage bucket: ${bucket.name}`);

    // ─── 5. Upload images ───
    const urlMap = { ...existingMap };
    let uploaded = 0;
    let skipped = 0;

    for (const filename of imageFiles) {
        // Skip if already uploaded (incremental)
        if (existingMap[filename]) {
            console.log(`   ⏭️  ${filename} (already uploaded)`);
            skipped++;
            continue;
        }

        const localPath = path.join(IMAGES_DIR, filename);
        const storagePath = `${STORAGE_FOLDER}/${filename}`;

        try {
            // Determine content type
            const ext = path.extname(filename).toLowerCase();
            const contentTypes = {
                '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
                '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml',
            };

            await bucket.upload(localPath, {
                destination: storagePath,
                metadata: {
                    contentType: contentTypes[ext] || 'application/octet-stream',
                    cacheControl: 'public, max-age=31536000', // 1 year cache
                },
            });

            // Make publicly accessible and get URL
            const file = bucket.file(storagePath);
            await file.makePublic();
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;

            urlMap[filename] = publicUrl;
            uploaded++;
            console.log(`   ✅ ${filename} → uploaded`);
        } catch (err) {
            console.error(`   ❌ ${filename} → FAILED: ${err.message}`);
        }
    }

    // ─── 6. Write URL map ───
    fs.writeFileSync(OUTPUT_MAP_FILE, JSON.stringify(urlMap, null, 2));
    console.log(`\n📝 Wrote ${Object.keys(urlMap).length} entries to image-url-map.json`);

    console.log('\n' + '═'.repeat(60));
    console.log(`  ✅ UPLOAD COMPLETE`);
    console.log(`  ${uploaded} uploaded, ${skipped} skipped (already existed)`);
    console.log('═'.repeat(60));
}

main().catch(err => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
});
