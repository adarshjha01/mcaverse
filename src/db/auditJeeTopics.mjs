import { readFileSync } from 'fs';

// Load your downloaded JSON file
// Make sure the file name matches exactly what you uploaded
const rawData = JSON.parse(readFileSync('./src/db/questions.json', 'utf8'));

console.log(`\n📦 Total Questions: ${rawData.length}`);

const topicCounts = {};
const chapterCounts = {};

rawData.forEach(q => {
  // Count Topics
  const t = q.topic || "Unknown Topic";
  topicCounts[t] = (topicCounts[t] || 0) + 1;

  // Count Chapters (Sometimes chapters are better for grouping)
  const c = q.chapter || "Unknown Chapter";
  chapterCounts[c] = (chapterCounts[c] || 0) + 1;
});

console.log("\n📊 UNIQUE CHAPTERS (Use these to group into your 6 topics):");
console.log("-----------------------------------------------------");
Object.entries(chapterCounts)
  .sort((a, b) => b[1] - a[1]) // Sort by count
  .forEach(([name, count]) => {
    console.log(`"${name}": ${count}`);
  });

console.log("\n-----------------------------------------------------\n");