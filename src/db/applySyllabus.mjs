// src/db/applySyllabus.mjs
import { readFileSync, writeFileSync } from 'fs';

const FILE_PATH = './src/db/questions_clean.json';

// 1. TOPICS TO DELETE (Vectors & Out of Scope)
const DELETE_KEYWORDS = [
    "Vector",
    "Parallelepiped",
    "Coplanar",
    "Work and Energy",
    "Physics Applications"
];

// 2. SYLLABUS MAPPING (Strictly based on your provided text)
const SYLLABUS_MAP = {
    // --- MATHEMATICS (50 Questions) ---
    // Target: "Set Theory and Logic"
    "Set Theory and Logic": "Set Theory and Logic",
    "Discrete Mathematics": "Set Theory and Logic",
    "Graph Theory": "Set Theory and Logic",
    "Topology": "Set Theory and Logic",

    // Target: "Probability and Statistics"
    "Probability and Statistics": "Probability and Statistics",
    "Averages": "Probability and Statistics",
    "Means": "Probability and Statistics",
    "Variance": "Probability and Statistics",
    "Binomial Distribution": "Probability and Statistics",
    "Combinatorial Geometry": "Probability and Statistics",
    "Game Theory": "Probability and Statistics",

    // Target: "Algebra"
    "Algebra": "Algebra",
    "Absolute Value": "Algebra",
    "Binomial Theorem": "Algebra",
    "Combinatorics": "Algebra", // Syllabus lists Permutations & Combinations under Algebra
    "Complex Numbers": "Algebra",
    "Complex Analysis": "Algebra",
    "Determinants": "Algebra",
    "Eigenvalues": "Algebra",
    "Exponentials and Logarithms": "Algebra",
    "Field Theory": "Algebra",
    "Inequalities": "Algebra",
    "Lexicographic Order": "Algebra",
    "Logarithmic Inequalities": "Algebra",
    "Logarithms": "Algebra",
    "Matrices": "Algebra",
    "Modular Arithmetic": "Algebra",
    "Number Theory": "Algebra",
    "Surd Simplification": "Algebra",

    // Target: "Coordinate Geometry"
    "Coordinate Geometry": "Coordinate Geometry",
    "Curves": "Coordinate Geometry",
    "Polar Coordinates": "Coordinate Geometry",
    "Regular Polygons": "Coordinate Geometry",
    "Three Dimensional Geometry": "Coordinate Geometry", // Mapping 3D here as per standard practice, or delete if strictly 2D
    "Coordinate Geometry [DEPRECATED]": "Coordinate Geometry",

    // Target: "Calculus"
    "Calculus": "Calculus",
    "Area Between Curves": "Calculus",
    "Area Under Curves": "Calculus",
    "Critical Points": "Calculus",
    "Limits": "Calculus",
    "Continuity": "Calculus",
    "Differentiation": "Calculus",
    "Integration": "Calculus",
    "Measure Theory": "Calculus",
    "Numerical Methods": "Calculus",
    "Optimization": "Calculus",
    "Related Rates": "Calculus",
    "Calculus [DEPRECATED]": "Calculus",

    // Target: "Trigonometry"
    "Trigonometry": "Trigonometry",
    "Heights and Distances": "Trigonometry",
    "Triangles": "Trigonometry",

    // --- COMPUTER AWARENESS (20 Questions) ---
    // Target: "Computer Basics"
    "Computer Basics": "Computer Basics",
    "Fundamentals of Computing": "Computer Basics",
    "General Computer Science": "Computer Basics",
    "Data Management": "Computer Basics",
    "Unknown Topic": "Computer Basics",

    // Target: "Data Representation"
    "Data Representation": "Data Representation",
    "Digital Logic": "Data Representation", // Boolean Algebra is here
    "Mathematics for Computing": "Data Representation",

    // Target: "Computer Software"
    "Operating Systems": "Computer Software",
    "Programming Concepts": "Computer Software",

    // Target: "Computer Hardware" (None in current list, but ready for future)
    
    // Target: "Internet and Email" (None in current list, but ready for future)

    // --- GENERAL ENGLISH (10 Questions) ---
    // Target: "General English" (Consolidating all)
    "General english": "General English",
    "Grammar": "General English",
    "Vocabulary": "General English",
    "Reading Comprehension": "General English",
    "Synonyms and Antonyms": "General English",
    "Idioms and Phrases": "General English",
    "Spelling": "General English",
    "Sentence Structure": "General English",
    "Analogies": "General English"
};

function applySyllabus() {
    try {
        console.log(`📖 Reading ${FILE_PATH}...`);
        const rawData = readFileSync(FILE_PATH, 'utf8');
        let questions = JSON.parse(rawData);

        const initialCount = questions.length;
        let deletedCount = 0;
        let mergedCount = 0;

        // FILTER & MAP
        const cleanedQuestions = questions.filter(q => {
            const oldTopic = q.topic ? q.topic.trim() : "Unknown Topic";

            // 1. DELETE VECTORS
            if (DELETE_KEYWORDS.some(keyword => oldTopic.includes(keyword))) {
                deletedCount++;
                return false; // Remove this question
            }
            return true; // Keep others
        }).map(q => {
            const oldTopic = q.topic ? q.topic.trim() : "Unknown Topic";

            // 2. MERGE TOPICS
            if (SYLLABUS_MAP[oldTopic]) {
                if (q.topic !== SYLLABUS_MAP[oldTopic]) {
                    q.topic = SYLLABUS_MAP[oldTopic];
                    mergedCount++;
                }
                // Clean up any deprecated flags
                delete q.deprecated;
            } else {
                // If topic is not in map, keep it but warn (or default to something)
                // console.log(`Warning: Unmapped topic "${oldTopic}"`);
            }
            return q;
        });

        console.log(`\n📉 Removed ${deletedCount} Vector/Physics questions.`);
        console.log(`🔄 Merged ${mergedCount} questions into Syllabus topics.`);
        console.log(`📦 Final Question Count: ${cleanedQuestions.length} (was ${initialCount})`);

        // Write back
        writeFileSync(FILE_PATH, JSON.stringify(cleanedQuestions, null, 2));
        console.log(`✅ Syllabus Applied. Saved to ${FILE_PATH}`);

    } catch (error) {
        console.error("❌ Error:", error);
    }
}

applySyllabus();