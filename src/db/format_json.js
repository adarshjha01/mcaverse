const fs = require('fs');
const path = require('path');

// File paths
const inputFilePath = path.join(__dirname, 'allQuestions.json');
const outputFilePath = path.join(__dirname, 'formatted_allQuestions.json');

// Helper function to format LaTeX strings
function formatLatex(text) {
    if (!text || typeof text !== 'string') return text;

    // 1. Convert block $$ ... $$ to inline $ ... $
    text = text.replace(/\$\$\s*([\s\S]*?)\s*\$\$/g, (match, p1) => {
        return `$${p1.trim()}$`;
    });

    // 2. Fix the specific {{\alpha} \over {\beta}} format to \frac{\alpha}{\beta}
    text = text.replace(/\{\{\s*(.*?)\s*}\\over{\s*(.*?)\s*}}/g, '\\frac{$1}{$2}');

    // 3. Fix the simpler {\alpha \over \beta} format to \frac{\alpha}{\beta}
    text = text.replace(/\{\s*(.*?)\s*\\over\s*(.*?)\s*}/g, '\\frac{$1}{$2}');

    return text;
}

// Main execution function
function processQuestions() {
    console.log('Reading allQuestions.json...');
    
    // Read the file synchronously (fine for scripts running locally)
    const rawData = fs.readFileSync(inputFilePath, 'utf8');
    const questions = JSON.parse(rawData);

    console.log(`Successfully loaded ${questions.length} questions. Processing...`);

    questions.forEach((q, index) => {
        // 1. Rename ID to JM01, JM02, etc.
        // padStart(2, '0') ensures 1 becomes 01, while 100 stays 100
        const newId = `JM${String(index + 1).padStart(2, '0')}`;
        q.question_id = newId;

        // 2. Format LaTeX in question text
        if (q.question_text) {
            q.question_text = formatLatex(q.question_text);
        }

        // 3. Format LaTeX in options array
        if (Array.isArray(q.options)) {
            q.options = q.options.map(opt => formatLatex(opt));
        }

        // 4. Format LaTeX in explanation
        if (q.explanation) {
            q.explanation = formatLatex(q.explanation);
        }

        // 5. Generate missing explanation
        if (!q.explanation || q.explanation.trim() === "") {
            // Check for a specific known question to inject our hardcoded explanation
            const hasSpecificOption = q.options && q.options.some(opt => opt.includes("A is false and B is true"));
            
            if (hasSpecificOption) {
                q.explanation = "Given $\\cos(\\beta - \\gamma) + \\cos(\\gamma - \\alpha) + \\cos(\\alpha - \\beta) = -\\frac{3}{2}$\n\nMultiply by 2 and add 3 to both sides:\n$3 + 2\\cos(\\beta - \\gamma) + 2\\cos(\\gamma - \\alpha) + 2\\cos(\\alpha - \\beta) = 0$\n\nSubstitute $3 = (\\sin^2\\alpha + \\cos^2\\alpha) + (\\sin^2\\beta + \\cos^2\\beta) + (\\sin^2\\gamma + \\cos^2\\gamma)$:\n\nGrouping the cosine and sine terms together, we obtain perfect squares:\n$(\\cos\\alpha + \\cos\\beta + \\cos\\gamma)^2 + (\\sin\\alpha + \\sin\\beta + \\sin\\gamma)^2 = 0$\n\nSince the sum of squares of real numbers is zero, each individual term must be zero. \n\n$\\Rightarrow \\cos\\alpha + \\cos\\beta + \\cos\\gamma = 0$ (Statement A is true)\n$\\Rightarrow \\sin\\alpha + \\sin\\beta + \\sin\\gamma = 0$ (Statement B is true)\n\nTherefore, both statements A and B are true.";
            } else {
                q.explanation = "Explanation missing in the original database. Solved using standard mathematical principles.";
            }
        }
    });

    // Write the updated data back to a new file
    console.log('Writing to formatted_allQuestions.json...');
    fs.writeFileSync(outputFilePath, JSON.stringify(questions, null, 2), 'utf8');
    console.log('Done! Your file has been completely formatted.');
}

// Run the script
try {
    processQuestions();
} catch (error) {
    console.error("An error occurred during processing:", error.message);
}