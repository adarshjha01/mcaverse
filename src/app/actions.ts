// src/app/actions.ts
"use server";

import { db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { redirect } from 'next/navigation';

// --- Type Definitions for Video Data ---
type Lecture = {
  id: string;
  title: string;
  youtubeLink: string;
};
type Topic = {
  name: string;
  lectures: Lecture[];
};
type Subject = {
  subject: string;
  topics: Topic[];
};

// --- Function to fetch a single YouTube playlist ---
async function fetchPlaylist(playlistId: string): Promise<Lecture[]> {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${API_KEY}&maxResults=50`;
    try {
        const res = await fetch(URL, { next: { revalidate: 3600 } });
        if (!res.ok) return [];
        const data = await res.json();
        return data.items.map((item: any) => ({
            id: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            youtubeLink: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
        })).reverse();
    } catch (error) {
        console.error(`Failed to fetch playlist ${playlistId}:`, error);
        return [];
    }
}

// --- Server Action to get all course data ---
export async function getCourseData(): Promise<Subject[]> {
    const playlistIds = {
        "Mathematics": process.env.YOUTUBE_MATH_PLAYLIST_ID,
        "Logical Reasoning": process.env.YOUTUBE_LR_PLAYLIST_ID,
        "Computer Science": process.env.YOUTUBE_CS_PLAYLIST_ID,
        "English": process.env.YOUTUBE_ENGLISH_PLAYLIST_ID,
    };
    const courseData: Subject[] = [];
    for (const [subject, id] of Object.entries(playlistIds)) {
        if (id) {
            const lectures = await fetchPlaylist(id);
            courseData.push({
                subject,
                topics: [{ name: `${subject} Lectures`, lectures }]
            });
        }
    }
    return courseData;
}

type CustomTestParams = {
  subject: string;
  topic?: string;
  numQuestions: number;
  duration: number;
  userId: string;
};

// --- NEW: Server Action to create a custom test ---
export async function createCustomTest(params: CustomTestParams) {
  "use server";
  const { subject, topic, numQuestions, duration, userId } = params;

  try {
    // 1. Build the query based on provided parameters
    let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = 
        db.collection('questions').where('subject', '==', subject);
    if (topic) {
      query = query.where('topic', '==', topic);
    }

    const questionsSnapshot = await query.get();

    if (questionsSnapshot.empty) {
      return { error: 'No questions found for the selected criteria. Please try another combination.' };
    }

    const allQuestionIds = questionsSnapshot.docs.map(doc => doc.id);

    // 2. Handle cases where there aren't enough questions
    if (allQuestionIds.length < numQuestions) {
        return { error: `Only found ${allQuestionIds.length} questions. Please select a smaller number.` };
    }

    // 3. Shuffle and select the requested number of questions
    const selectedQuestionIds = allQuestionIds
      .sort(() => 0.5 - Math.random())
      .slice(0, numQuestions);

    // 4. Create a new temporary mock test document
    const testTitle = topic
      ? `Custom: ${subject} - ${topic}`
      : `Custom: ${subject}`;

    const newTestRef = await db.collection('mockTests').add({
      title: testTitle,
      exam: 'custom',
      testType: topic ? 'topic-wise' : 'subject-wise',
      durationInMinutes: duration,
      question_ids: selectedQuestionIds,
      isCustom: true,
      userId: userId,
      createdAt: FieldValue.serverTimestamp(),
    });

    // 5. If successful, redirect the user to the test
    redirect(`/mock-tests/take/${newTestRef.id}`);

  } catch (error) {
    console.error("Error creating custom test:", error);
    return { error: 'Failed to create the test on the server. Please try again.' };
  }
}
