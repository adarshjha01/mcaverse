"use server";

import { db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { subjectsData, TopicData } from '@/db/video-data';

const FormStateSchema = z.object({
  response: z.string().optional(),
  error: z.string().optional(),
});

// --- Funny fallback responses for MCAverse Chat ---
const humorousResponses: string[] = [
  "Oops! My circuits are overheating. Try exploring other MCAverse features while I reboot! 🤖",
  "I'm still in training — maybe check out the Quizzes while I learn to chat properly! 🚀",
  "Server’s taking a chai break ☕. Be right back — until then, explore more of MCAverse!",
  "My AI brain’s in maintenance mode. But hey, have you checked the syllabus tracker yet? 😅",
  "Hold on, I'm debugging my own thoughts... Meanwhile, enjoy other sections of MCAverse!",
];

// --- Server Action for AI Response ---
export async function getAIResponse(
  previousState: z.infer<typeof FormStateSchema> | null,
  formData: FormData
): Promise<z.infer<typeof FormStateSchema>> {
  try {
    const prompt = (formData.get('prompt') as string)?.toLowerCase() || '';

    if (!prompt) return { error: 'Please type something first!' };

    // Intentionally return a funny fallback instead of hitting real AI API
    const randomResponse = humorousResponses[Math.floor(Math.random() * humorousResponses.length)];
    return { response: randomResponse };

  } catch (error) {
    console.error('Chat AI error:', error);
    const fallback = humorousResponses[Math.floor(Math.random() * humorousResponses.length)];
    return { response: fallback };
  }
}

// --- Type Definitions for Video Data ---
type Lecture = {
  id: string;
  title: string;
  youtubeLink: string;
};
type Topic = {
  name: string;
  lectures: Lecture[];
  playlistId?: string;
};
type Subject = {
  subject: string;
  topics: Topic[];
};
type YouTubePlaylistItem = {
  snippet: {
    resourceId: { videoId: string };
    title: string;
  };
};

// --- Function to fetch a single YouTube playlist ---
async function fetchPlaylist(playlistId: string): Promise<Lecture[]> {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${API_KEY}&maxResults=50`;
    try {
        const res = await fetch(URL, { next: { revalidate: 3600 } });
        if (!res.ok) {
            console.error(`Failed to fetch playlist ${playlistId}, status: ${res.status}`);
            return [];
        };
        const data = await res.json();
        if (!data.items) {
            console.error(`No items found in playlist ${playlistId}`);
            return [];
        }
        return data.items.map((item: YouTubePlaylistItem) => ({
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
    const courseData: Subject[] = [];

    // --- Process all subjects from the centralized data file ---
    for (const subjectInfo of subjectsData) {
        const topics: Topic[] = await Promise.all(
            subjectInfo.topics.map(async (topic: TopicData) => {
                if (topic.playlistId && topic.playlistId !== "YOUR_PLAYLIST_ID_HERE") {
                    return {
                        name: topic.name,
                        lectures: await fetchPlaylist(topic.playlistId),
                        playlistId: topic.playlistId,
                    };
                }
                // Return topic with empty lectures if no playlist is provided
                return { name: topic.name, lectures: [] };
            })
        );
        
        courseData.push({
            subject: subjectInfo.subject,
            topics: topics,
        });
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

// --- Server Action to create a custom test ---
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

