// src/db/auditLocalJson.mjs
import { readFileSync } from 'fs';

const FILE_PATH = './src/db/questions_clean.json';

function auditLocalJson() {
    try {
        console.log(`📖 Reading file: ${FILE_PATH}...`);
        const rawData = readFileSync(FILE_PATH, 'utf8');
        const questions = JSON.parse(rawData);

        console.log(`📦 Total questions found: ${questions.length}`);

        const topicCounts = {};

        questions.forEach(q => {
            // Clean up strings to match what the app does
            const subject = q.subject ? q.subject.trim() : "Unknown Subject";
            const topic = q.topic ? q.topic.trim() : "Unknown Topic";
            
            // Check for deprecation
            const isDeprecated = q.deprecated === true ? " [DEPRECATED]" : "";
            
            const key = `${subject} -> ${topic}${isDeprecated}`;

            if (!topicCounts[key]) {
                topicCounts[key] = 0;
            }
            topicCounts[key]++;
        });

        console.log("\n📊 TOPIC BREAKDOWN (inside questions_clean.json):");
        console.log("----------------------------------------");
        
        const sortedKeys = Object.keys(topicCounts).sort();
        
        sortedKeys.forEach(key => {
            console.log(`${key}: ${topicCounts[key]} questions`);
        });

        console.log("----------------------------------------");

    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

auditLocalJson();