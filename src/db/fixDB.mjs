import fs from 'fs';

function fixLatexErrors(text) {
    if (!text || typeof text !== 'string') return text;
    
    let fixed = text;
    
    // 1. Add backslash before trig/log functions (Do this first!)
    // Matches sin, cos, tan, etc. that are NOT preceded by a \ or a letter
    fixed = fixed.replace(/(?<![\\a-zA-Z])(sin|cos|tan|cot|sec|csc|log|ln)(?![a-zA-Z])/g, '\\$1');
    
    // 2. Replace {{num}}{{den}} with \frac{num}{den}
    // We use a non-greedy (.*?) match so it safely handles multiple fractions on one line
    fixed = fixed.replace(/(?<!\\frac)\{\{(.*?)\}\}\{\{(.*?)\}\}/g, '\\frac{$1}{$2}');
    
    // Run it a second time just in case there are nested fractions!
    fixed = fixed.replace(/(?<!\\frac)\{\{(.*?)\}\}\{\{(.*?)\}\}/g, '\\frac{$1}{$2}');
    
    // 3. Remove malformed \mkern spacing artifacts
    fixed = fixed.replace(/\\frac\{\\mkern\s*1mu\}\s*/g, '');
    
    // 4. Fix malformed trig^2 inside \frac
    // Turns \frac{\cos ^2}{\alpha}{2} into \cos^2 \frac{\alpha}{2}
    fixed = fixed.replace(/\\frac\{\\(sin|cos|tan|cot|sec|csc)\s*\^(\d*)\}\{\{([^}]+)\}\}\{(\d+)\}/g, '\\$1^$2 \\frac{$3}{$4}');
    fixed = fixed.replace(/\\frac\{\\(sin|cos|tan|cot|sec|csc)\s*\^\s*(\d*)\}\{([^}]+)\}\{(\d+)\}/g, '\\$1^$2 \\frac{$3}{$4}');
    
    // 5. Fix double braces in standard fractions: \frac{{num}}{{den}} -> \frac{num}{den}
    fixed = fixed.replace(/\\frac\{\{([^{}]+)\}\}\{\{([^{}]+)\}\}/g, '\\frac{$1}{$2}');
    
    // 6. Fix nested quadruple braces: {{{{num}}}} -> {num}
    fixed = fixed.replace(/\{\{\{\{([^}]+)\}\}\}\}/g, '{$1}');
    
    // 7. THE BULLETPROOF MISMATCH FIX: Strip \left and \right
    // This stops KaTeX from crashing on unbalanced brackets, while keeping the actual ( ) symbols perfectly intact!
    fixed = fixed.replace(/\\left\b/g, '');
    fixed = fixed.replace(/\\right\b/g, '');
    
    return fixed;
}

function main() {
    // 1. Setup proper Codespace paths
    const inputPath = './src/db/allQuestions.json';
    const outputPath = './src/db/allQuestions_fixed.json'; // Safe new file!
    
    console.log('📖 Reading database...');
    if (!fs.existsSync(inputPath)) {
        console.error(`❌ Cannot find ${inputPath}. Make sure you are in the project root!`);
        return;
    }
    
    const rawData = fs.readFileSync(inputPath, 'utf8');
    const data = JSON.parse(rawData);
    
    let totalFixes = { question_text: 0, options: 0, explanation: 0 };
    let questionsFixed = new Set();
    
    console.log('🛠️ Fixing LaTeX errors (This might take a second)...\n');
    
    // Helper function to process strings and count fixes
    const processText = (text, type, qid) => {
        if (!text || typeof text !== 'string') return text;
        const fixed = fixLatexErrors(text);
        if (fixed !== text) {
            totalFixes[type]++;
            questionsFixed.add(qid);
        }
        return fixed;
    };

    // 2. Loop through the database
    const fixedData = data.map(q => {
        const qid = q.question_id || q.id || 'Unknown';
        
        if (q.question_text) {
            q.question_text = processText(q.question_text, 'question_text', qid);
        }
        
        if (q.options && Array.isArray(q.options)) {
            q.options = q.options.map(opt => processText(opt, 'options', qid));
        }
        
        if (q.explanation) {
            q.explanation = processText(q.explanation, 'explanation', qid);
        }
        
        return q;
    });
    
    // 3. Save the results
    fs.writeFileSync(outputPath, JSON.stringify(fixedData, null, 2), 'utf8');
    
    const total = totalFixes.question_text + totalFixes.options + totalFixes.explanation;
    
    // 4. Print beautiful summary
    console.log('='.repeat(60));
    console.log('✅ LATEX FIX SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total questions processed: ${data.length}`);
    console.log(`Questions successfully healed: ${questionsFixed.size}`);
    console.log('-'.repeat(60));
    console.log(`${'Field'.padEnd(20)} ${'Items Fixed'.padStart(15)}`);
    console.log('-'.repeat(60));
    console.log(`${'question_text'.padEnd(20)} ${String(totalFixes.question_text).padStart(15)}`);
    console.log(`${'options'.padEnd(20)} ${String(totalFixes.options).padStart(15)}`);
    console.log(`${'explanation'.padEnd(20)} ${String(totalFixes.explanation).padStart(15)}`);
    console.log('-'.repeat(60));
    console.log(`${'TOTAL FIXES APPLIED'.padEnd(20)} ${String(total).padStart(15)}`);
    console.log('='.repeat(60));
    console.log(`\n📁 Fixed database saved to: ${outputPath}`);
    console.log(`\n🚀 NEXT STEP: Open 'src/db/auditDB.mjs', change the input path to './src/db/allQuestions_fixed.json', and run it to verify!`);
}

main();