import fs from 'fs'; // FIXED: Proper ES Module import

function countLatexErrors(text) {
    if (!text) return { count: 0, details: [] };
   
    let errors = 0;
    const details = [];
   
    // Pattern 1: {{num}}{{den}} instead of \frac{num}{den} (missing \frac)
    const pattern1 = /(?<!\\frac)\{\{[^}]+\}\}\{\{[^}]+\}\}/g;
    const matches1 = text.match(pattern1) || [];
    errors += matches1.length;
    matches1.forEach(m => details.push(`Missing \\frac: ${m.substring(0, 50)}`));
   
    // Pattern 2: sin/cos/tan/cot/sec/csc without backslash
    const pattern2 = /(?<![\\a-zA-Z])(sin|cos|tan|cot|sec|csc|log|ln)(?![a-zA-Z])/g;
    const matches2 = text.match(pattern2) || [];
    errors += matches2.length;
    matches2.forEach(m => details.push(`Missing backslash before: ${m}`));
   
    // Pattern 3: \frac{\mkern or malformed fracs
    const pattern3 = /\\frac\{\\mkern/g;
    const matches3 = text.match(pattern3) || [];
    errors += matches3.length;
    matches3.forEach(() => details.push("Malformed \\frac with \\mkern"));
   
    // Pattern 4: \frac{\cos ^2} or \frac{\sin ^2} - trig function incorrectly in frac
    const pattern4 = /\\frac\{\\(cos|sin|tan)\s*\^/g;
    const matches4 = text.match(pattern4) || [];
    errors += matches4.length;
    matches4.forEach(() => details.push("Malformed trig^2 inside \\frac numerator"));
   
    // Pattern 5: Unmatched \left without \right
    const leftCount = (text.match(/\\left[\(\[\{]/g) || []).length;
    const rightCount = (text.match(/\\right[\)\]\}]/g) || []).length;
    if (leftCount !== rightCount) {
        errors += Math.abs(leftCount - rightCount);
        details.push(`Mismatched \\left/\\right: ${leftCount} left, ${rightCount} right`);
    }
   
    // Pattern 6: Empty braces in math mode \frac{}{}
    const pattern6 = /\\frac\{\s*\}\{\s*\}/g;
    const matches6 = text.match(pattern6) || [];
    errors += matches6.length;
    matches6.forEach(() => details.push("Empty \\frac{}{}"));
   
    // Pattern 7: Unclosed $ signs (odd number)
    const dollarCount = (text.match(/\$/g) || []).length;
    if (dollarCount % 2 !== 0) {
        errors += 1;
        details.push(`Unclosed $ sign (odd count: ${dollarCount})`);
    }
   
    return { count: errors, details };
}

function main() {
    // FIXED: Use relative path for the Codespace
    const filepath = './src/db/allQuestions.json'; 
   
    const rawData = fs.readFileSync(filepath, 'utf8');
    const data = JSON.parse(rawData);
   
    const totalErrors = { question_text: 0, options: 0, explanation: 0 };
    const allDetails = [];
    const questionsWithErrors = new Set();
   
    data.forEach(q => {
        const qid = q.question_id || q.id || 'Unknown';
       
        if (q.question_text) {
            const { count, details } = countLatexErrors(q.question_text);
            totalErrors.question_text += count;
            if (count > 0) questionsWithErrors.add(qid);
            details.forEach(d => allDetails.push(`${qid} | question_text | ${d}`));
        }
       
        if (q.options && Array.isArray(q.options)) {
            q.options.forEach((opt, i) => {
                if (opt) {
                    const { count, details } = countLatexErrors(opt);
                    totalErrors.options += count;
                    if (count > 0) questionsWithErrors.add(qid);
                    details.forEach(d => allDetails.push(`${qid} | option[${i}] | ${d}`));
                }
            });
        }
       
        if (q.explanation) {
            const { count, details } = countLatexErrors(q.explanation);
            totalErrors.explanation += count;
            if (count > 0) questionsWithErrors.add(qid);
            details.forEach(d => allDetails.push(`${qid} | explanation | ${d}`));
        }
    });
   
    const total = totalErrors.question_text + totalErrors.options + totalErrors.explanation;
   
    console.log('='.repeat(60));
    console.log('LATEX ERROR SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total questions analyzed: ${data.length}`);
    console.log(`Questions with errors: ${questionsWithErrors.size}`);
    console.log('-'.repeat(60));
    console.log(`${'Field'.padEnd(20)} ${'Error Count'.padStart(15)}`);
    console.log('-'.repeat(60));
    console.log(`${'question_text'.padEnd(20)} ${String(totalErrors.question_text).padStart(15)}`);
    console.log(`${'options'.padEnd(20)} ${String(totalErrors.options).padStart(15)}`);
    console.log(`${'explanation'.padEnd(20)} ${String(totalErrors.explanation).padStart(15)}`);
    console.log('-'.repeat(60));
    console.log(`${'TOTAL'.padEnd(20)} ${String(total).padStart(15)}`);
    console.log('='.repeat(60));
   
    console.log('\nDETAILED ERRORS (first 100):');
    console.log('-'.repeat(60));
    allDetails.slice(0, 100).forEach(detail => console.log(detail));
   
    if (allDetails.length > 100) {
        console.log(`\n... and ${allDetails.length - 100} more errors`);
    }
   
    // FIXED: Save report inside your project folder so you can actually read it
    const reportPath = './src/db/latex_error_report.txt';
    const reportContent = [
        'LATEX ERROR FULL REPORT',
        '='.repeat(60),
        `Total errors: ${total}`,
        `question_text: ${totalErrors.question_text}`,
        `options: ${totalErrors.options}`,
        `explanation: ${totalErrors.explanation}`,
        '='.repeat(60),
        '',
        ...allDetails
    ].join('\n');
   
    fs.writeFileSync(reportPath, reportContent);
    console.log(`\nFull report saved to: ${reportPath}`);
}

main();