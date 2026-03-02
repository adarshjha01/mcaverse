// src/app/api/video-notes/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { verifyAuth } from '@/lib/auth-admin';
import { z } from 'zod';

const NoteSchema = z.object({
  videoId: z.string().min(1),
  content: z.string().max(5000),
});

// GET: Fetch the user's note for a specific video
export async function GET(request: Request) {
  const requesterUid = await verifyAuth();
  if (!requesterUid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('videoId');

  if (!videoId) {
    return NextResponse.json({ error: 'videoId is required' }, { status: 400 });
  }

  try {
    // Each user has one note per video, stored as: videoNotes/{userId}__{videoId}
    const docId = `${requesterUid}__${videoId}`;
    const docRef = db.collection('videoNotes').doc(docId);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      return NextResponse.json({
        content: data?.content || '',
        updatedAt: data?.updatedAt?.toDate?.()?.toISOString() || null,
      });
    }

    return NextResponse.json({ content: '', updatedAt: null });
  } catch (error) {
    console.error('Error fetching video note:', error);
    return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 });
  }
}

// POST: Save/update the user's note for a specific video
export async function POST(request: Request) {
  const requesterUid = await verifyAuth();
  if (!requesterUid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const validated = NoteSchema.safeParse(body);
  if (!validated.success) {
    return NextResponse.json({ errors: validated.error.flatten().fieldErrors }, { status: 400 });
  }

  const { videoId, content } = validated.data;

  try {
    const docId = `${requesterUid}__${videoId}`;
    const docRef = db.collection('videoNotes').doc(docId);

    await docRef.set(
      {
        userId: requesterUid,
        videoId,
        content,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving video note:', error);
    return NextResponse.json({ error: 'Failed to save note' }, { status: 500 });
  }
}
