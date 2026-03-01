// src/app/api/admin/generate-nimcet-full/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { verifyAuth } from '@/lib/auth-admin';

// --- CONFIGURATION ---
const TEST_CONFIG = {
  title: "NIMCET Full Length Mock Test - 01",
  exam: "nimcet",
  testType: "full-length",
  totalDuration: 120,
  sections: [
    { name: "Mathematics", count: 50, duration: 70, marks: 12, negative: 3 },
    { name: "Logical Reasoning", count: 40, duration: 30, marks: 6, negative: 1.5 },
    { name: "Computer Awareness", count: 10, duration: 10, marks: 4, negative: 1 },
    { name: "General English", count: 20, duration: 10, marks: 4, negative: 1 }
  ]
};

// --- HELPER: SHUFFLE ARRAY ---
function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export async function POST() {
  const requesterUid = await verifyAuth();
  if (!requesterUid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const questionsRef = db.collection('questions');
    let allQuestionIds: string[] = [];
    const sectionsMetadata: any[] = [];

    // --- FETCH QUESTIONS PER SECTION ---
    for (const section of TEST_CONFIG.sections) {
      // Fetch more than needed to ensure randomness, or fetch all
      const snapshot = await questionsRef
        .where('subject', '==', section.name)
        .limit(100) // Safety limit
        .get();

      if (snapshot.empty) {
        return NextResponse.json({ 
          error: `No questions found for subject: ${section.name}. Please seed the database first.` 
        }, { status: 400 });
      }

      let docIds = snapshot.docs.map(doc => doc.id);
      
      // Shuffle and Slice
      docIds = shuffleArray(docIds);
      const selectedIds = docIds.slice(0, section.count);

      if (selectedIds.length < section.count) {
        return NextResponse.json({ 
          error: `Not enough questions for ${section.name}. Required: ${section.count}, Found: ${selectedIds.length}` 
        }, { status: 400 });
      }

      // Add to master list
      allQuestionIds = [...allQuestionIds, ...selectedIds];

      // Store section metadata for the UI
      sectionsMetadata.push({
        name: section.name,
        duration: section.duration,
        questionCount: section.count,
        marksPerQuestion: section.marks,
        negativeMarks: section.negative,
        startIndex: allQuestionIds.length - selectedIds.length, // Track where this section starts in the master list
        endIndex: allQuestionIds.length - 1
      });
    }

    // --- CREATE MOCK TEST DOCUMENT ---
    const testData = {
      title: TEST_CONFIG.title,
      exam: TEST_CONFIG.exam,
      testType: TEST_CONFIG.testType,
      durationInMinutes: TEST_CONFIG.totalDuration,
      totalMarks: 960, // (50*12) + (40*6) + (10*4) + (20*4) = 600 + 240 + 40 + 80 = 960
      question_ids: allQuestionIds,
      sections: sectionsMetadata, // <--- New Field for Sectional Logic
      createdAt: new Date(),
      status: "Published"
    };

    // Add to Firestore
    const docRef = await db.collection('mockTests').add(testData);

    return NextResponse.json({ 
      success: true, 
      message: `Test Created Successfully! ID: ${docRef.id}`, 
      testId: docRef.id,
      structure: sectionsMetadata
    });

  } catch (error: any) {
    console.error("Error generating test:", error);
    return NextResponse.json({ error: 'Failed to generate test.' }, { status: 500 });
  }
}