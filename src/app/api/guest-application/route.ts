// src/app/api/guest-application/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

const GuestApplicationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email."),
  expertise: z.string().min(5, "Please describe your expertise."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export async function POST(request: Request) {
    const formData = await request.formData();
    const validatedFields = GuestApplicationSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success) {
        return NextResponse.json({ 
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Validation failed." 
        }, { status: 400 });
    }

    const { name, email, expertise, message } = validatedFields.data;
    const adminEmail = "theadarshjha22@gmail.com";
    const googleFormLink = "https://forms.gle/tqB3xQ2gFgnLFLKEA";

    try {
        await db.collection('guest-applications').add({
            name, email, expertise, message,
            submittedAt: FieldValue.serverTimestamp(),
        });

        await resend.emails.send({
            from: 'MCAverse Guest Application <onboarding@resend.dev>',
            to: [email],
            subject: 'Thank You for Your MCAverse Podcast Application!',
            html: `<h1>Thank You, ${name}!</h1><p>We've received your application. As a next step, please fill out this questionnaire:</p><a href="${googleFormLink}">Complete Questionnaire</a><p>Best,<br>The MCAverse Team</p>`,
        });

        await resend.emails.send({
            from: 'MCAverse New Application <onboarding@resend.dev>',
            to: [adminEmail],
            subject: `New Podcast Guest Application: ${name}`,
            html: `<p>New application from ${name} (${email}). Expertise: ${expertise}. Message: ${message}</p>`,
        });

        return NextResponse.json({ success: true, message: "Thank you! Kindly go through your provided email for further proceedings." });

    } catch (error) {
        console.error("Error processing application:", error);
        return NextResponse.json({ success: false, message: "Something went wrong. Please try again." }, { status: 500 });
    }
}
