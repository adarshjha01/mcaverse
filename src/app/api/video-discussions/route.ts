// src/app/api/video-discussions/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { verifyAuth } from '@/lib/auth-admin';
import { z } from 'zod';

const MessageSchema = z.object({
  videoId: z.string().min(1),
  content: z.string().min(1, "Message cannot be empty.").max(1000),
  authorId: z.string(),
  authorName: z.string(),
  authorPhoto: z.string().optional(),
});

// GET: Fetch messages for a specific video (public — no auth required)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('videoId');

  if (!videoId) {
    return NextResponse.json({ error: 'videoId is required' }, { status: 400 });
  }

  try {
    const snapshot = await db
      .collection('videoDiscussions')
      .where('videoId', '==', videoId)
      .limit(100)
      .get();

    const messages = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
      }))
      .sort((a, b) => {
        if (!a.createdAt) return -1;
        if (!b.createdAt) return 1;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching video discussions:', error);
    return NextResponse.json({ error: 'Failed to fetch discussions' }, { status: 500 });
  }
}

// POST: Add a new discussion message for a video
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

  const validated = MessageSchema.safeParse(body);
  if (!validated.success) {
    return NextResponse.json({ errors: validated.error.flatten().fieldErrors }, { status: 400 });
  }

  const { videoId, content, authorId, authorName, authorPhoto } = validated.data;

  if (authorId !== requesterUid) {
    return NextResponse.json({ error: 'Forbidden: Cannot post as another user.' }, { status: 403 });
  }

  try {
    const docRef = await db.collection('videoDiscussions').add({
      videoId,
      content,
      authorId,
      authorName,
      authorPhoto: authorPhoto || null,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      message: {
        id: docRef.id,
        videoId,
        content,
        authorId,
        authorName,
        authorPhoto: authorPhoto || null,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error creating video discussion:', error);
    return NextResponse.json({ error: 'Failed to post message' }, { status: 500 });
  }
}

// DELETE: Delete a discussion message (only by author)
export async function DELETE(request: Request) {
  const requesterUid = await verifyAuth();
  if (!requesterUid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const messageId = searchParams.get('messageId');

  if (!messageId) {
    return NextResponse.json({ error: 'messageId is required' }, { status: 400 });
  }

  try {
    const docRef = db.collection('videoDiscussions').doc(messageId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    if (doc.data()?.authorId !== requesterUid) {
      return NextResponse.json({ error: 'Forbidden: You can only delete your own messages.' }, { status: 403 });
    }

    await docRef.delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting video discussion:', error);
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
