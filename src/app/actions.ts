// src/app/actions.ts
"use server";

import { db } from '@/lib/firebaseAdmin';

// --- Type Definitions ---
export type Lecture = {
  id: string;
  title: string;
  youtubeLink: string;
};

export type Topic = {
  name: string;
  lectures: Lecture[];
};

export type Subject = {
  subject: string;
  topics: Topic[];
};

type FirestoreTopic = {
  name: string;
  playlistId: string;
};

type YouTubePlaylistItem = {
  snippet: {
    resourceId: { videoId: string };
    title: string;
  };
};

// --- Helper: Fetch YouTube Playlist ---
async function fetchPlaylist(playlistId: string): Promise<Lecture[]> {
    // Return empty if no ID is provided (e.g. placeholder topics)
    if (!playlistId) return [];

    const API_KEY = process.env.YOUTUBE_API_KEY;
    if (!API_KEY) {
        console.error("YOUTUBE_API_KEY is not defined in environment variables.");
        return [];
    }

    const URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${API_KEY}&maxResults=50`;
    
    try {
        // Cache for 1 hour (3600 seconds)
        const res = await fetch(URL, { next: { revalidate: 3600 } });
        
        if (!res.ok) {
            console.error(`YouTube API Error: ${res.status} ${res.statusText}`);
            return [];
        }
        
        const data = await res.json();
        if (!data.items) return [];

        return data.items.map((item: YouTubePlaylistItem) => ({
            id: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            youtubeLink: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
        })).reverse(); // Optional: Reverse if you want oldest first (typical for tutorials)
        
    } catch (error) {
        console.error(`Failed to fetch playlist ${playlistId}:`, error);
        return [];
    }
}

// --- Main Action: Get Course Data Dynamic ---
export async function getCourseData(): Promise<Subject[]> {
    try {
        // 1. Fetch the curriculum structure from Firestore
        const snapshot = await db.collection('curriculum').orderBy('order', 'asc').get();
        
        if (snapshot.empty) {
            console.warn("No curriculum found in Firestore. Please seed the database.");
            return [];
        }

        const courseData: Subject[] = [];

        // 2. Fetch all playlists in parallel
        await Promise.all(snapshot.docs.map(async (doc) => {
            const data = doc.data();
            const subjectName = data.title;
            const topicsList: FirestoreTopic[] = data.topics || [];

            const processedTopics: Topic[] = [];

            // 3. For each topic, fetch the YouTube videos
            for (const topic of topicsList) {
                // Only fetch if a playlist ID exists
                const lectures = topic.playlistId ? await fetchPlaylist(topic.playlistId) : [];
                
                // Add topic even if lectures are empty (so it shows up in UI as "Coming Soon" or empty)
                processedTopics.push({
                    name: topic.name,
                    lectures: lectures
                });
            }

            if (processedTopics.length > 0) {
                courseData.push({
                    subject: subjectName,
                    topics: processedTopics
                });
            }
        }));

        // 4. Re-sort strictly by the 'order' field (Promise.all might mix them up)
        const orderMap = new Map(snapshot.docs.map(d => [d.data().title, d.data().order]));
        courseData.sort((a, b) => (orderMap.get(a.subject) || 0) - (orderMap.get(b.subject) || 0));

        return courseData;

    } catch (error) {
        console.error("Error fetching course data:", error);
        return [];
    }
}