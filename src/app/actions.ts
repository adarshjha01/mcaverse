// src/app/actions.ts
"use server";

import { z } from 'zod';
import { db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Resend } from 'resend';

// --- Initialize Resend ---
const resend = new Resend(process.env.RESEND_API_KEY);

// --- Schema for Guest Application ---
const GuestApplicationSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  expertise: z.string().min(5, { message: "Please describe your expertise." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

// --- ADDED THIS FUNCTION BACK ---
export async function submitGuestApplication(prevState: any, formData: FormData) {
  const validatedFields = GuestApplicationSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    expertise: formData.get('expertise'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
      message: "Validation failed."
    };
  }

  const { name, email, expertise, message } = validatedFields.data;

  try {
    await db.collection('guest-applications').add({
      name,
      email,
      expertise,
      message,
      submittedAt: new Date(),
    });

    await resend.emails.send({
      from: 'MCAverse <onboarding@resend.dev>',
      to: [email],
      subject: 'Thank You for Your MCAverse Podcast Application!',
      html: `<p>Thank you, ${name}! We've received your application and will get back to you soon. As a next step, please fill out this questionnaire: YOUR_GOOGLE_FORM_LINK_HERE</p>`,
    });

     await resend.emails.send({
      from: 'MCAverse <onboarding@resend.dev>',
      to: [process.env.ADMIN_EMAIL_ADDRESS!],
      subject: `New Podcast Guest Application: ${name}`,
      html: `<p>New application from ${name} (${email}). Expertise: ${expertise}. Message: ${message}</p>`,
    });

    return { success: true, message: "Thank you! Your application has been submitted." };

  } catch (error) {
    console.error("Error processing application:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}


// --- Discussion Forum Actions ---
const PostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  content: z.string().min(10, "Content must be at least 10 characters."),
  author: z.string().min(2, "Please provide your name."),
});

export async function createDiscussionPost(prevState: any, formData: FormData) {
  const validatedFields = PostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    author: formData.get('author'),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  try {
    const { title, content, author } = validatedFields.data;
    await db.collection('discussions').add({
      title,
      content,
      author,
      createdAt: FieldValue.serverTimestamp(),
      replyCount: 0,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return { message: "Failed to create post. Please try again." };
  }

  revalidatePath('/community');
  redirect('/community');
}

const ReplySchema = z.object({
    replyContent: z.string().min(1, "Reply cannot be empty."),
    author: z.string().min(2, "Please provide your name."),
    discussionId: z.string(),
});

export async function addReply(prevState: any, formData: FormData) {
    const validatedFields = ReplySchema.safeParse({
        replyContent: formData.get('replyContent'),
        author: formData.get('author'),
        discussionId: formData.get('discussionId'),
    });

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors };
    }
    
    const { replyContent, author, discussionId } = validatedFields.data;
    const discussionRef = db.collection('discussions').doc(discussionId);

    try {
        await discussionRef.collection('replies').add({
            content: replyContent,
            author,
            createdAt: FieldValue.serverTimestamp(),
        });
        await discussionRef.update({
            replyCount: FieldValue.increment(1),
        });
    } catch (error) {
        console.error("Error adding reply:", error);
        return { message: "Failed to add reply." };
    }

    revalidatePath(`/community/${discussionId}`);
    return { success: true };
}

// --- Schema for AI Chat ---
const ChatSchema = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty."),
  history: z.string(), // History will be a stringified JSON array
});

// --- Server Action to get a response from Gemini ---
export async function getAIResponse(prevState: any, formData: FormData) {
  const validatedFields = ChatSchema.safeParse({
    prompt: formData.get('prompt'),
    history: formData.get('history'),
  });

  if (!validatedFields.success) {
    return { error: "Invalid prompt." };
  }

  const { prompt, history } = validatedFields.data;
  const chatHistory = JSON.parse(history);

  try {
    const payload = {
      contents: [...chatHistory, { role: "user", parts: [{ text: prompt }] }],
    };
    const apiKey = ""; // Leave as-is
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return { error: "Failed to get response from AI." };
    }

    const result = await response.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return { error: "Received an empty response from AI." };
    }

    return { response: text };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { error: "An error occurred while contacting the AI." };
  }
}
