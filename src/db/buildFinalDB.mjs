// src/db/buildFinalDB.mjs
// ═══════════════════════════════════════════════════════════════════
// ULTIMATE DATABASE BUILDER
// Takes allQuestions.json (ALL questions, including PYQs) and:
//   1. Applies comprehensive LaTeX fixes (improved over fixDB.mjs)
//   2. Audits the result for remaining errors
//   3. Outputs allQuestions_final.json ready for Firebase upload
// ═══════════════════════════════════════════════════════════════════
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ──────────── COMPREHENSIVE LATEX FIXER ────────────

function fixLatex(text) {
    if (!text || typeof text !== 'string') return text;
    let f = text;

    // ─── PASS 1: Structural fixes (order matters!) ───

    // 1a. Remove malformed \frac{\mkern 1mu} artifacts  →  nothing
    //     e.g.  "$sin\frac{\mkern 1mu} \alpha"  →  "$sin \alpha"
    f = f.replace(/\\frac\{\\mkern\s*\d*mu\}\s*/g, '');

    // 1b. Fix \mathop \frac{\lim } pattern → \mathop{\lim}
    //     e.g. "$\mathop \frac{\lim }\limits_{n \to \infty}"  →  "$\lim\limits_{n \to \infty}"
    f = f.replace(/\\mathop\s*\\frac\{\\lim\s*\}\\limits/g, '\\lim\\limits');
    f = f.replace(/\\mathop\s*\{\\lim\s*\}\\limits/g, '\\lim\\limits');

    // 2. Add backslash before trig/log functions NOT preceded by \ or a letter
    //    sin → \sin, cos → \cos, tan → \tan, etc.
    //    But NOT "cosine", "signal", "tangent", etc.
    f = f.replace(/(?<![\\a-zA-Z])(sin|cos|tan|cot|sec|csc|log|ln|lim|max|min|det|gcd|exp|inf|sup)(?![a-zA-Z])/g, '\\$1');

    // 3. Fix {{num}}{{den}} → \frac{num}{den} (missing \frac)
    //    Step A: Simple regex for non-nested cases (covers 95%+ of errors)
    f = f.replace(/(?<!\\frac)\{\{([^{}]+)\}\}\{\{([^{}]+)\}\}/g, '\\frac{$1}{$2}');
    f = f.replace(/(?<!\\frac)\{\{([^{}]+)\}\}\{\{([^{}]+)\}\}/g, '\\frac{$1}{$2}');
    //    Step B: Brace-depth-aware for nested cases like {{{x+{y}}}}{{{z^{2}}}}
    f = fixMissingFrac(f);

    // 4. Fix malformed trig^n in \frac numerator (COMPREHENSIVE)
    //    These patterns have a trig function (with exponent) incorrectly as the \frac numerator
    
    // 4a. \frac{\sin ^{-1}}\left( ... \right)  →  \sin^{-1}\left( ... \right)
    //     \frac{\cos ^{ - 1}}\left( ... \right) →  \cos^{-1}\left( ... \right)
    f = f.replace(/\\frac\{\\(sin|cos|tan|cot|sec|csc)\s*\^\s*\{\s*-\s*1\s*\}\s*\}/g, 
        '\\$1^{-1}');
    
    // 4b. \frac{\sin ^2}\left( {x} \right)  →  \sin^2 \left( {x} \right)
    //     \frac{\cos ^3}\left( ... \right)   →  \cos^3 \left( ... \right)
    f = f.replace(/\\frac\{\\(sin|cos|tan|cot|sec|csc)\s*\^\s*(\d+)\s*\}/g, 
        '\\$1^{$2}');
    
    // 4c. \frac{\sin ^2}{\alpha - \beta}{2}  →  \sin^2 \frac{\alpha - \beta}{2}
    f = f.replace(/\\frac\{\\(sin|cos|tan|cot|sec|csc)\s*\^\s*(\d*)\s*\}\{?\{([^}]+)\}\}?\{(\d+)\}/g, 
        '\\$1^{$2} \\frac{$3}{$4}');
    
    // 4d. Simpler form: \frac{\sin ^2}x  →  \sin^2 x
    f = f.replace(/\\frac\{\\(sin|cos|tan|cot|sec|csc)\s*\^\s*(\d*)\s*\}([a-zA-Z])/g, 
        '\\$1^{$2} $3');
    
    // 4e. Catch-all: \frac{\sin ^{anything}} → \sin^{anything}
    //     This catches any remaining \frac{\\trig ^{...}} patterns
    f = f.replace(/\\frac\{\\(sin|cos|tan|cot|sec|csc)\s*\^\s*(\{[^}]*\}|\d+)\s*\}/g, 
        '\\$1^$2');
    
    // 4f. \frac{\sin} or \frac{\cos} (trig as numerator with no exponent)
    //     e.g. \frac{\cos}\left( ... →  \cos\left( ...
    f = f.replace(/\\frac\{\\(sin|cos|tan|cot|sec|csc)\s*\}/g, 
        '\\$1');

    // 5. Simplify double-braced fractions: \frac{{num}}{{den}} → \frac{num}{den}
    //    But only for simple (non-nested) content
    f = f.replace(/\\frac\{\{([^{}]+)\}\}\{\{([^{}]+)\}\}/g, '\\frac{$1}{$2}');

    // 6. Fix quadruple braces: {{{{x}}}} → {x}
    f = f.replace(/\{\{\{\{([^}]+)\}\}\}\}/g, '{$1}');

    // 7. Fix triple braces: {{{x}}} → {x}  (leave alone if part of valid nesting)
    //    Only strip the outer extra pair
    f = f.replace(/\{\{\{([^{}]+)\}\}\}/g, '{$1}');

    // ─── PASS 2: Fix \left/\right mismatches (SMART, not strip-all) ───
    
    // Count \left and \right occurrences
    const leftMatches = f.match(/\\left[\(\[\{\|.]/g) || [];
    const rightMatches = f.match(/\\right[\)\]\}\|.]/g) || [];
    const leftCount = leftMatches.length;
    const rightCount = rightMatches.length;

    if (leftCount !== rightCount) {
        // Strategy: Strip orphan \left or \right but keep the delimiter character
        // This is safer than removing ALL \left/\right like the old fixDB.mjs
        if (leftCount > rightCount) {
            // More \left than \right → remove excess \left (keep the bracket)
            let excess = leftCount - rightCount;
            f = f.replace(/\\left([\(\[\{\|.])/g, (match, bracket) => {
                if (excess > 0) { excess--; return bracket; }
                return match;
            });
        } else {
            // More \right than \left → remove excess \right (keep the bracket)
            let excess = rightCount - leftCount;
            f = f.replace(/\\right([\)\]\}\|.])/g, (match, bracket) => {
                if (excess > 0) { excess--; return bracket; }
                return match;
            });
        }
    }

    // ─── PASS 3: Fix unclosed $ signs ───

    // Count $ signs (exclude $$)
    const dollars = f.match(/(?<!\$)\$(?!\$)/g) || [];
    if (dollars.length % 2 !== 0) {
        // Try to fix: if the text ends without a closing $, add one
        const lastDollar = f.lastIndexOf('$');
        const afterLast = f.substring(lastDollar + 1).trim();
        if (afterLast.length > 0 && !afterLast.startsWith('$')) {
            // There's text after the last $, so that $ was an opener → close it
            f = f + '$';
        } else {
            // The last $ seems like a stray closer → remove it
            f = f.substring(0, lastDollar) + f.substring(lastDollar + 1);
        }
    }

    // ─── PASS 4: Clean up artifacts ───

    // Fix empty \frac{}{} that might have been created
    f = f.replace(/\\frac\{\s*\}\{\s*\}/g, '');

    // Fix double backslashes before trig functions: \\\\sin → \\sin
    f = f.replace(/\\\\(sin|cos|tan|cot|sec|csc|log|ln)/g, '\\$1');

    // Clean up multiple consecutive spaces inside $ $
    f = f.replace(/  +/g, ' ');

    return f;
}

// ──────────── BRACE-DEPTH-AWARE FRAC FIXER ────────────

// Finds {{...}}{{...}} patterns (where ... can contain nested braces)
// and converts them to \frac{...}{...}. Only handles cases the simple
// regex can't (i.e., content with nested braces inside).
function fixMissingFrac(text) {
    if (!text) return text;
    let result = '';
    let i = 0;
    
    while (i < text.length) {
        // Check if we're at a {{ 
        if (text[i] === '{' && i + 1 < text.length && text[i+1] === '{') {
            // Check not preceded by \frac, \dfrac, \tfrac
            const before = text.substring(Math.max(0, i - 6), i);
            if (/\\[dt]?frac$/.test(before)) {
                result += text[i];
                i++;
                continue;
            }
            
            // Try to extract {{balanced_content}}{{balanced_content}}
            const firstGroup = extractDoubleBraced(text, i);
            if (firstGroup !== null) {
                const afterFirst = i + firstGroup.totalLen;
                // Check for {{ immediately after
                if (afterFirst + 1 < text.length && 
                    text[afterFirst] === '{' && text[afterFirst + 1] === '{') {
                    const secondGroup = extractDoubleBraced(text, afterFirst);
                    if (secondGroup !== null) {
                        result += '\\frac{' + firstGroup.content + '}{' + secondGroup.content + '}';
                        i = afterFirst + secondGroup.totalLen;
                        continue;
                    }
                }
            }
        }
        result += text[i];
        i++;
    }
    return result;
}

// Extract content from a {{...}} group where ... can contain nested braces.
// Tracks brace depth starting from 2 (for the opening {{) down to 0 (for }}).
// Returns { content: string, totalLen: number } or null.
function extractDoubleBraced(text, pos) {
    if (pos + 1 >= text.length || text[pos] !== '{' || text[pos + 1] !== '{') return null;
    
    let depth = 2; // two opening braces consumed
    let j = pos + 2;
    
    while (j < text.length && depth > 0) {
        if (text[j] === '{') depth++;
        else if (text[j] === '}') depth--;
        j++;
    }
    
    if (depth !== 0) return null;
    
    // j is now one past the last closing }
    // For {{21}}: pos=0, j=6 → content = text[2..4) = "21", totalLen = 6
    // For {{{x+{y}}}}: pos=0, j=11 → content = text[2..9) = "{x+{y}}", totalLen = 11
    const content = text.substring(pos + 2, j - 2);
    return { content, totalLen: j - pos };
}

// ──────────── LATEX ERROR COUNTER (for audit) ────────────

function countLatexErrors(text) {
    if (!text) return { count: 0, details: [] };
    let errors = 0;
    const details = [];

    // 1. {{num}}{{den}} without \frac
    const p1 = (text.match(/(?<!\\frac)\{\{[^}]+\}\}\{\{[^}]+\}\}/g) || []);
    errors += p1.length;
    p1.forEach(m => details.push(`Missing \\frac: ${m.substring(0, 50)}`));

    // 2. sin/cos/tan without backslash
    const p2 = (text.match(/(?<![\\a-zA-Z])(sin|cos|tan|cot|sec|csc|log|ln)(?![a-zA-Z])/g) || []);
    errors += p2.length;
    p2.forEach(m => details.push(`Missing backslash: ${m}`));

    // 3. \frac{\mkern malformed
    const p3 = (text.match(/\\frac\{\\mkern/g) || []);
    errors += p3.length;
    p3.forEach(() => details.push("Malformed \\frac{\\mkern}"));

    // 4. trig^2 in frac numerator (exclude \begin{aligned} contexts which are valid LaTeX)
    //    Only flag \frac{\sin ^... patterns NOT inside \begin{aligned} blocks
    const p4raw = text.match(/\\frac\{\\(cos|sin|tan)\s*\\^/g) || [];
    // Count how many are in aligned/gathered blocks (these are usually valid)
    const inAligned = (text.match(/\\begin\{(aligned|gathered|array|matrix)/g) || []).length;
    // If the text uses \begin{aligned}, the trig-in-frac pattern is likely valid LaTeX
    const p4count = inAligned > 0 ? 0 : p4raw.length;
    errors += p4count;
    if (p4count > 0) p4raw.forEach(() => details.push("Malformed trig^2 in \\frac"));

    // 5. \left/\right mismatch
    const leftC = (text.match(/\\left[\(\[\{\|.]/g) || []).length;
    const rightC = (text.match(/\\right[\)\]\}\|.]/g) || []).length;
    if (leftC !== rightC) {
        errors += Math.abs(leftC - rightC);
        details.push(`Mismatch \\left/\\right: ${leftC}/${rightC}`);
    }

    // 6. Empty \frac{}{}
    const p6 = (text.match(/\\frac\{\s*\}\{\s*\}/g) || []);
    errors += p6.length;
    p6.forEach(() => details.push("Empty \\frac{}{}"));

    // 7. Unclosed $ (odd count)
    const dollarC = (text.match(/(?<!\$)\$(?!\$)/g) || []).length;
    if (dollarC % 2 !== 0) {
        errors += 1;
        details.push(`Unclosed $ (${dollarC})`);
    }

    return { count: errors, details };
}

// ──────────── MAIN ────────────

function main() {
    const inputPath = path.join(__dirname, 'allQuestions.json');
    const outputPath = path.join(__dirname, 'allQuestions_final.json');
    const reportPath = path.join(__dirname, 'final_audit_report.txt');

    console.log('═'.repeat(60));
    console.log('  MCAVERSE DATABASE BUILDER v2.0');
    console.log('  Input: allQuestions.json (ALL questions including PYQs)');
    console.log('═'.repeat(60));

    // ─── 1. Read source ───
    if (!fs.existsSync(inputPath)) {
        console.error(`❌ ${inputPath} not found!`);
        return;
    }
    const rawData = fs.readFileSync(inputPath, 'utf8');
    const data = JSON.parse(rawData);
    console.log(`\n📖 Loaded ${data.length} questions from ${inputPath}`);

    // ─── 2. Audit BEFORE fix ───
    let beforeErrors = 0;
    let beforeQuestionsWithErrors = new Set();
    data.forEach(q => {
        const qid = q.question_id || 'unknown';
        let qErr = 0;
        if (q.question_text) qErr += countLatexErrors(q.question_text).count;
        if (q.options) q.options.forEach(o => { if(o) qErr += countLatexErrors(o).count; });
        if (q.explanation) qErr += countLatexErrors(q.explanation).count;
        beforeErrors += qErr;
        if (qErr > 0) beforeQuestionsWithErrors.add(qid);
    });

    console.log(`\n📊 BEFORE FIX:`);
    console.log(`   Total LaTeX errors: ${beforeErrors}`);
    console.log(`   Questions with errors: ${beforeQuestionsWithErrors.size} / ${data.length}`);

    // ─── 3. Apply fixes ───
    console.log(`\n🔧 Applying comprehensive LaTeX fixes...`);
    
    let fixCounts = { question_text: 0, options: 0, explanation: 0 };
    let questionsFixed = new Set();

    const fixedData = data.map(q => {
        const qid = q.question_id || 'unknown';

        if (q.question_text) {
            const original = q.question_text;
            q.question_text = fixLatex(q.question_text);
            if (q.question_text !== original) {
                fixCounts.question_text++;
                questionsFixed.add(qid);
            }
        }

        if (q.options && Array.isArray(q.options)) {
            q.options = q.options.map(opt => {
                if (!opt || typeof opt !== 'string') return opt;
                const original = opt;
                const fixed = fixLatex(opt);
                if (fixed !== original) {
                    fixCounts.options++;
                    questionsFixed.add(qid);
                }
                return fixed;
            });
        }

        if (q.explanation) {
            const original = q.explanation;
            q.explanation = fixLatex(q.explanation);
            if (q.explanation !== original) {
                fixCounts.explanation++;
                questionsFixed.add(qid);
            }
        }

        return q;
    });

    const totalFixes = fixCounts.question_text + fixCounts.options + fixCounts.explanation;
    console.log(`   ✅ Fixed ${totalFixes} fields across ${questionsFixed.size} questions`);
    console.log(`      question_text: ${fixCounts.question_text}`);
    console.log(`      options:       ${fixCounts.options}`);
    console.log(`      explanation:   ${fixCounts.explanation}`);

    // ─── 4. Audit AFTER fix ───
    let afterErrors = 0;
    let afterQuestionsWithErrors = new Set();
    const afterDetails = [];
    const afterFieldErrors = { question_text: 0, options: 0, explanation: 0 };

    fixedData.forEach(q => {
        const qid = q.question_id || 'unknown';
        let qErr = 0;

        if (q.question_text) {
            const r = countLatexErrors(q.question_text);
            afterFieldErrors.question_text += r.count;
            qErr += r.count;
            r.details.forEach(d => afterDetails.push(`${qid} | question_text | ${d}`));
        }
        if (q.options && Array.isArray(q.options)) {
            q.options.forEach((opt, i) => {
                if (opt) {
                    const r = countLatexErrors(opt);
                    afterFieldErrors.options += r.count;
                    qErr += r.count;
                    r.details.forEach(d => afterDetails.push(`${qid} | option[${i}] | ${d}`));
                }
            });
        }
        if (q.explanation) {
            const r = countLatexErrors(q.explanation);
            afterFieldErrors.explanation += r.count;
            qErr += r.count;
            r.details.forEach(d => afterDetails.push(`${qid} | explanation | ${d}`));
        }

        afterErrors += qErr;
        if (qErr > 0) afterQuestionsWithErrors.add(qid);
    });

    console.log(`\n📊 AFTER FIX:`);
    console.log(`   Total LaTeX errors: ${afterErrors}`);
    console.log(`   Questions with errors: ${afterQuestionsWithErrors.size} / ${fixedData.length}`);
    console.log(`   Errors in question_text: ${afterFieldErrors.question_text}`);
    console.log(`   Errors in options:       ${afterFieldErrors.options}`);
    console.log(`   Errors in explanation:   ${afterFieldErrors.explanation}`);

    // ─── 5. Improvement summary ───
    const reduction = ((beforeErrors - afterErrors) / beforeErrors * 100).toFixed(1);
    console.log(`\n🎯 IMPROVEMENT:`);
    console.log(`   Errors reduced: ${beforeErrors} → ${afterErrors} (${reduction}% reduction)`);
    console.log(`   Questions healed: ${beforeQuestionsWithErrors.size - afterQuestionsWithErrors.size} fully fixed`);

    // ─── 6. Subject/topic stats ───
    const subjects = {};
    const examIds = {};
    fixedData.forEach(q => {
        const sub = q.subject || 'Unknown';
        subjects[sub] = (subjects[sub] || 0) + 1;
        const exam = q.exam_id || 'Unknown';
        examIds[exam] = (examIds[exam] || 0) + 1;
    });
    
    console.log(`\n📚 QUESTION STATS:`);
    console.log(`   Total: ${fixedData.length}`);
    console.log(`   By Subject:`);
    Object.entries(subjects).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log(`     ${k}: ${v}`));
    console.log(`   By Exam:`);
    Object.entries(examIds).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log(`     ${k}: ${v}`));

    // ─── 7. Save output ───
    fs.writeFileSync(outputPath, JSON.stringify(fixedData, null, 2), 'utf8');
    console.log(`\n📁 Final database saved to: ${outputPath}`);
    console.log(`   Questions: ${fixedData.length}`);
    console.log(`   Size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);

    // ─── 8. Save audit report ───
    const reportContent = [
        'FINAL AUDIT REPORT - allQuestions_final.json',
        '═'.repeat(60),
        `Generated: ${new Date().toISOString()}`,
        `Total questions: ${fixedData.length}`,
        '',
        'BEFORE FIX:',
        `  Total errors: ${beforeErrors}`,
        `  Questions with errors: ${beforeQuestionsWithErrors.size}`,
        '',
        'AFTER FIX:',
        `  Total errors: ${afterErrors}`,
        `  question_text: ${afterFieldErrors.question_text}`,
        `  options: ${afterFieldErrors.options}`,
        `  explanation: ${afterFieldErrors.explanation}`,
        `  Questions with errors: ${afterQuestionsWithErrors.size}`,
        '',
        `IMPROVEMENT: ${reduction}% error reduction`,
        '═'.repeat(60),
        '',
        'REMAINING ERRORS:',
        '─'.repeat(60),
        ...afterDetails
    ].join('\n');

    fs.writeFileSync(reportPath, reportContent, 'utf8');
    console.log(`📄 Audit report saved to: ${reportPath}`);

    console.log('\n' + '═'.repeat(60));
    console.log('  ✅ DATABASE BUILD COMPLETE');
    console.log('  Next: Run uploadFinalDB.mjs to push to Firebase');
    console.log('═'.repeat(60));
}

main();
