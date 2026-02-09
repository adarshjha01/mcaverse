import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================================================
// SYLLABUS MAPPING RULES - NIMCET 2026
// ============================================================================

const MATHEMATICS_TOPIC_MAPPING = {
  // Set Theory and Logic
  'sets': 'Set Theory and Logic',
  'set': 'Set Theory and Logic',
  'set theory': 'Set Theory and Logic',
  'relations': 'Set Theory and Logic',
  'relation': 'Set Theory and Logic',
  'functions': 'Set Theory and Logic',
  'function': 'Set Theory and Logic',
  'logic': 'Set Theory and Logic',
  'mathematical logic': 'Set Theory and Logic',
  
  // Probability and Statistics
  'probability': 'Probability and Statistics',
  'statistics': 'Probability and Statistics',
  'stats': 'Probability and Statistics',
  'permutations': 'Probability and Statistics',
  'combinations': 'Probability and Statistics',
  'permutation': 'Probability and Statistics',
  'combination': 'Probability and Statistics',
  
  // Algebra
  'matrices': 'Algebra',
  'matrix': 'Algebra',
  'determinants': 'Algebra',
  'determinant': 'Algebra',
  'progressions': 'Algebra',
  'progression': 'Algebra',
  'sequences': 'Algebra',
  'sequence': 'Algebra',
  'series': 'Algebra',
  'algebra': 'Algebra',
  'algebraic expressions': 'Algebra',
  'polynomials': 'Algebra',
  'polynomial': 'Algebra',
  'quadratic equations': 'Algebra',
  'linear equations': 'Algebra',
  'equations': 'Algebra',
  
  // Coordinate Geometry
  'lines': 'Coordinate Geometry',
  'line': 'Coordinate Geometry',
  'circles': 'Coordinate Geometry',
  'circle': 'Coordinate Geometry',
  'conic sections': 'Coordinate Geometry',
  'parabola': 'Coordinate Geometry',
  'ellipse': 'Coordinate Geometry',
  'hyperbola': 'Coordinate Geometry',
  'coordinate geometry': 'Coordinate Geometry',
  'analytic geometry': 'Coordinate Geometry',
  'straight lines': 'Coordinate Geometry',
  
  // Calculus
  'limits': 'Calculus',
  'limit': 'Calculus',
  'integration': 'Calculus',
  'integral': 'Calculus',
  'derivatives': 'Calculus',
  'derivative': 'Calculus',
  'differentiation': 'Calculus',
  'differential': 'Calculus',
  'calculus': 'Calculus',
  'continuity': 'Calculus',
  'differentiability': 'Calculus',
  
  // Trigonometry
  'trigonometry': 'Trigonometry',
  'trig': 'Trigonometry',
  'inverse trigonometry': 'Trigonometry',
  'inverse trig': 'Trigonometry',
  'trigonometric': 'Trigonometry',
  'sine': 'Trigonometry',
  'cosine': 'Trigonometry',
  'tangent': 'Trigonometry',
  'trigonometric functions': 'Trigonometry',
  'trigonometric identities': 'Trigonometry',
  
  // DEPRECATED - Vectors
  'vectors': 'DEPRECATED_VECTORS',
  'vector': 'DEPRECATED_VECTORS',
  'vector algebra': 'DEPRECATED_VECTORS',
};

const COMPUTER_AWARENESS_TOPIC_MAPPING = {
  // Data Representation
  'binary': 'Data Representation',
  'hexadecimal': 'Data Representation',
  'hex': 'Data Representation',
  'octal': 'Data Representation',
  'boolean': 'Data Representation',
  'boolean algebra': 'Data Representation',
  'number systems': 'Data Representation',
  'data representation': 'Data Representation',
  
  // Computer Basics
  'cpu': 'Computer Basics',
  'processor': 'Computer Basics',
  'memory': 'Computer Basics',
  'ram': 'Computer Basics',
  'rom': 'Computer Basics',
  'storage': 'Computer Basics',
  'hardware': 'Computer Basics',
  'input/output': 'Computer Basics',
  'i/o devices': 'Computer Basics',
  'computer basics': 'Computer Basics',
  'computer organization': 'Computer Basics',
  'computer architecture': 'Computer Basics',
  
  // Programming Concepts
  'c programming': 'Programming Concepts',
  'c language': 'Programming Concepts',
  'pointers': 'Programming Concepts',
  'pointer': 'Programming Concepts',
  'programming': 'Programming Concepts',
  'data structures': 'Programming Concepts',
  'algorithms': 'Programming Concepts',
  'programming concepts': 'Programming Concepts',
  'control structures': 'Programming Concepts',
  'loops': 'Programming Concepts',
  'functions': 'Programming Concepts',
  'arrays': 'Programming Concepts',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Convert string to snake_case
 */
function toSnakeCase(str) {
  if (!str || typeof str !== 'string') return str;
  
  return str
    .trim()
    .replace(/([A-Z])/g, '_$1') // Add underscore before capitals
    .replace(/[\s-]+/g, '_')     // Replace spaces and hyphens with underscore
    .replace(/[^\w_]/g, '')      // Remove non-alphanumeric except underscore
    .replace(/_+/g, '_')         // Replace multiple underscores with single
    .replace(/^_|_$/g, '')       // Remove leading/trailing underscores
    .toLowerCase();
}

/**
 * Normalize text for matching (lowercase, trim, remove special chars)
 */
function normalizeForMatching(text) {
  if (!text || typeof text !== 'string') return '';
  return text.toLowerCase().trim().replace(/[^\w\s]/g, '');
}

/**
 * Map a topic based on subject and mapping rules
 */
function mapTopic(subject, topic) {
  if (!topic || typeof topic !== 'string') return topic;
  
  const normalizedSubject = normalizeForMatching(subject);
  const normalizedTopic = normalizeForMatching(topic);
  
  // Mathematics topics
  if (normalizedSubject.includes('math')) {
    const mappedTopic = MATHEMATICS_TOPIC_MAPPING[normalizedTopic];
    if (mappedTopic) {
      return mappedTopic;
    }
    
    // Partial matching for compound topics
    for (const [key, value] of Object.entries(MATHEMATICS_TOPIC_MAPPING)) {
      if (normalizedTopic.includes(key) || key.includes(normalizedTopic)) {
        return value;
      }
    }
  }
  
  // Computer Awareness topics
  if (normalizedSubject.includes('computer') || normalizedSubject.includes('awareness')) {
    const mappedTopic = COMPUTER_AWARENESS_TOPIC_MAPPING[normalizedTopic];
    if (mappedTopic) {
      return mappedTopic;
    }
    
    // Partial matching for compound topics
    for (const [key, value] of Object.entries(COMPUTER_AWARENESS_TOPIC_MAPPING)) {
      if (normalizedTopic.includes(key) || key.includes(normalizedTopic)) {
        return value;
      }
    }
  }
  
  // Return original if no mapping found
  return topic;
}

/**
 * Standardize subject name
 */
function standardizeSubject(subject) {
  if (!subject || typeof subject !== 'string') return subject;
  
  const normalized = normalizeForMatching(subject);
  
  if (normalized.includes('math')) {
    return 'Mathematics';
  }
  
  if (normalized.includes('computer') || normalized.includes('awareness')) {
    return 'Computer Awareness';
  }
  
  // Return capitalized version
  return subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase();
}

/**
 * Process tags array - convert to snake_case
 */
function processTags(tags) {
  if (!Array.isArray(tags)) return [];
  
  return tags
    .filter(tag => tag && typeof tag === 'string')
    .map(tag => toSnakeCase(tag))
    .filter((tag, index, self) => self.indexOf(tag) === index); // Remove duplicates
}

/**
 * Check if question should be deprecated (Vectors topic)
 */
function shouldDeprecate(topic, tags, question, options) {
  const normalizedTopic = normalizeForMatching(topic || '');
  const vectorKeywords = ['vector', 'vectors', 'vector algebra'];
  
  // Check topic
  if (vectorKeywords.some(keyword => normalizedTopic.includes(keyword))) {
    return true;
  }
  
  // Check tags
  if (Array.isArray(tags)) {
    const normalizedTags = tags.map(tag => normalizeForMatching(tag || ''));
    if (normalizedTags.some(tag => vectorKeywords.some(keyword => tag.includes(keyword)))) {
      return true;
    }
  }
  
  // Check question text
  const normalizedQuestion = normalizeForMatching(question || '');
  const normalizedOptions = Array.isArray(options) 
    ? options.map(opt => normalizeForMatching(opt || '')).join(' ')
    : '';
  
  const fullText = normalizedQuestion + ' ' + normalizedOptions;
  
  // Only deprecate if "vector" is a major theme, not just mentioned
  const vectorMentions = (fullText.match(/\bvector/gi) || []).length;
  if (vectorMentions >= 2) {
    return true;
  }
  
  return false;
}

// ============================================================================
// MAIN CLEANING FUNCTION
// ============================================================================

/**
 * Clean a single question object
 */
function cleanQuestion(question, index) {
  const cleaned = { ...question };
  
  // Standardize subject
  if (cleaned.subject) {
    cleaned.subject = standardizeSubject(cleaned.subject);
  }
  
  // Map topic
  if (cleaned.topic) {
    const mappedTopic = mapTopic(cleaned.subject, cleaned.topic);
    
    if (mappedTopic === 'DEPRECATED_VECTORS') {
      cleaned.deprecated = true;
      cleaned.deprecation_reason = 'Vectors topic not in NIMCET 2026 syllabus';
      // Keep original topic for reference
    } else {
      cleaned.topic = mappedTopic;
    }
  }
  
  // Check for deprecation based on content
  if (!cleaned.deprecated) {
    const shouldDep = shouldDeprecate(
      cleaned.topic,
      cleaned.tags,
      cleaned.question,
      cleaned.options
    );
    
    if (shouldDep) {
      cleaned.deprecated = true;
      cleaned.deprecation_reason = 'Contains vector-related content not in NIMCET 2026 syllabus';
    }
  }
  
  // Process tags
  if (cleaned.tags) {
    cleaned.tags = processTags(cleaned.tags);
  }
  
  // Convert difficulty to snake_case if exists
  if (cleaned.difficulty && typeof cleaned.difficulty === 'string') {
    cleaned.difficulty = toSnakeCase(cleaned.difficulty);
  }
  
  return cleaned;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  try {
    console.log('🚀 Starting NIMCET 2026 Syllabus Data Cleaning...\n');
    
    // Read input file
    const inputPath = '/workspaces/codespaces-blank/mcaverse/src/db/questions.json';
    console.log(`📖 Reading: ${inputPath}`);
    
    const rawData = readFileSync(inputPath, 'utf8');
    const questions = JSON.parse(rawData);
    
    console.log(`✅ Loaded ${questions.length} questions\n`);
    
    // Statistics
    const stats = {
      total: questions.length,
      cleaned: 0,
      deprecated: 0,
      subjectChanges: 0,
      topicChanges: 0,
      tagsProcessed: 0,
    };
    
    // Clean each question
    console.log('🧹 Cleaning questions...');
    const cleanedQuestions = questions.map((q, index) => {
      const original = { ...q };
      const cleaned = cleanQuestion(q, index);
      
      // Track changes
      if (cleaned.subject !== original.subject) stats.subjectChanges++;
      if (cleaned.topic !== original.topic) stats.topicChanges++;
      if (cleaned.deprecated) stats.deprecated++;
      if (cleaned.tags && cleaned.tags.length > 0) stats.tagsProcessed++;
      
      stats.cleaned++;
      
      // Progress indicator
      if ((index + 1) % 100 === 0) {
        process.stdout.write(`\r   Processed: ${index + 1}/${questions.length}`);
      }
      
      return cleaned;
    });
    
    console.log(`\r   Processed: ${questions.length}/${questions.length} ✅\n`);
    
    // Save cleaned data
    const outputPath = '/workspaces/codespaces-blank/mcaverse/src/db/questions_clean.json';
    console.log(`💾 Saving to: ${outputPath}`);
    
    writeFileSync(
      outputPath,
      JSON.stringify(cleanedQuestions, null, 2),
      'utf8'
    );
    
    console.log('✅ File saved successfully!\n');
    
    // Print statistics
    console.log('📊 Cleaning Statistics:');
    console.log('━'.repeat(50));
    console.log(`   Total Questions:        ${stats.total}`);
    console.log(`   Successfully Cleaned:   ${stats.cleaned}`);
    console.log(`   Deprecated (Vectors):   ${stats.deprecated}`);
    console.log(`   Subject Changes:        ${stats.subjectChanges}`);
    console.log(`   Topic Changes:          ${stats.topicChanges}`);
    console.log(`   Questions with Tags:    ${stats.tagsProcessed}`);
    console.log('━'.repeat(50));
    
    // Sample output
    console.log('\n📝 Sample Cleaned Questions:');
    console.log('━'.repeat(50));
    
    // Show first cleaned question
    if (cleanedQuestions.length > 0) {
      console.log('\nFirst Question:');
      console.log(JSON.stringify(cleanedQuestions[0], null, 2));
    }
    
    // Show first deprecated question if any
    const firstDeprecated = cleanedQuestions.find(q => q.deprecated);
    if (firstDeprecated) {
      console.log('\nFirst Deprecated Question (Vector):');
      console.log(JSON.stringify(firstDeprecated, null, 2));
    }
    
    console.log('\n✅ Cleaning Complete!');
    console.log(`📁 Output file: questions_clean.json\n`);
    
  } catch (error) {
    console.error('\n❌ Error during cleaning:', error);
    process.exit(1);
  }
}

// Run the script
main();