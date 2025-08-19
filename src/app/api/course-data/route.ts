// src/app/api/course-data/route.ts
import { NextResponse } from 'next/server';

// --- Type Definitions for Video Data ---
type Lecture = {
  id: string;
  title: string;
  youtubeLink: string;
};
type Subject = {
  subject: string;
  topics: { name: string; lectures: Lecture[] }[];
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

// --- Main GET handler ---
export async function GET() {
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
    return NextResponse.json(courseData);
}
