// src/app/actions.ts
"use server";

import { z } from 'zod';
import { getAuth } from 'firebase-admin/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
// ... (Your other actions and imports remain)

// --- Schemas for Auth ---
const SignUpSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const LoginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(1, "Password is required."),
});


// --- Server Action for Email/Password Signup ---
export async function signUpWithEmail(prevState: any, formData: FormData) {
  // --- DEBUGGING LINE ---
  console.log("SERVER_ACTIONS_TRUSTED_HOSTS:", process.env.SERVER_ACTIONS_TRUSTED_HOSTS);

  const validatedFields = SignUpSchema.safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }
  
  const { name, email, password } = validatedFields.data;

  try {
    await getAuth().createUser({
      email,
      password,
      displayName: name,
    });
  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      return { message: "An account with this email already exists." };
    }
    return { message: "Something went wrong. Please try again." };
  }

  redirect('/login');
}

// --- Server Action for Email/Password Login ---     
export async function signInWithEmail(prevState: any, formData: FormData) {
    const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors };
    }
    
    return { success: true, data: validatedFields.data };
}

// Add these to src/app/actions.ts

import { FieldValue } from 'firebase-admin/firestore';
import { db } from '@/lib/firebaseAdmin';

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
        const res = await fetch(URL, { next: { revalidate: 3600 } }); // Cache for 1 hour
        if (!res.ok) return [];
        const data = await res.json();
        return data.items.map((item: any) => ({
            id: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            youtubeLink: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
        })).reverse(); // Show most recent videos first
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
            // For now, we'll put all videos under one topic per subject.
            // This can be expanded later if you organize your playlists by topic.
            courseData.push({
                subject,
                topics: [{ name: `${subject} Lectures`, lectures }]
            });
        }
    }
    return courseData;
}

// // --- Server Action to get user's video progress ---
// export async function getUserVideoProgress(userId: string) {
//     if (!userId) return { completed: [], revision: [] };
//     try {
//         const docRef = db.collection('videoProgress').doc(userId);
//         const docSnap = await docRef.get();
//         if (docSnap.exists) {
//             const data = docSnap.data();
//             return {
//                 completed: data?.completedLectures || [],
//                 revision: data?.revisionLectures || [],
//             };
//         }
//         return { completed: [], revision: [] };
//     } catch (error) {
//         console.error("Error fetching user progress:", error);
//         return { completed: [], revision: [] };
//     }
// }

// // --- Server Action to update user's video progress ---
// export async function updateVideoProgress(
//     userId: string,
//     lectureId: string,
//     type: 'completed' | 'revision',
//     isAdding: boolean
// ) {
//     if (!userId) return;
//     const docRef = db.collection('videoProgress').doc(userId);
//     const field = type === 'completed' ? 'completedLectures' : 'revisionLectures';
    
//     try {
//         if (isAdding) {
//             await docRef.set({ [field]: FieldValue.arrayUnion(lectureId) }, { merge: true });
//         } else {
//             await docRef.update({ [field]: FieldValue.arrayRemove(lectureId) });
//         }
//         revalidatePath('/videos'); // Refresh the data on the videos page
//     } catch (error) {
//         console.error("Error updating user progress:", error);
//     }
// }
