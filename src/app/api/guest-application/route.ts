// src/app/api/guest-application/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

// HTML sanitizer to prevent XSS in email templates
function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// THE FIX 1: Map the Zod schema to exactly match your new React form fields
const GuestApplicationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email."),
  social: z.string().url("Please enter a valid URL for your profile/social link."),
  topic: z.string().min(10, "Topic description must be at least 10 characters."),
});

export async function POST(request: Request) {
    try {
        // THE FIX 2: Parse the incoming request as JSON, not formData!
        const body = await request.json();
        
        const validatedFields = GuestApplicationSchema.safeParse(body);

        if (!validatedFields.success) {
            return NextResponse.json({ 
                errors: validatedFields.error.flatten().fieldErrors,
                message: "Validation failed. Check your inputs." 
            }, { status: 400 });
        }

        // Destructure the newly named fields
        const { name, email, social, topic } = validatedFields.data;
        const safeName = escapeHtml(name);
        const safeSocial = escapeHtml(social);
        const safeTopic = escapeHtml(topic);
        const adminEmail = "theadarshjha22@gmail.com";
        const googleFormLink = "https://forms.gle/tqB3xQ2gFgnLFLKEA";

        // Save to database
        await db.collection('guest-applications').add({
            name, 
            email, 
            social, 
            topic,
            submittedAt: FieldValue.serverTimestamp(),
        });

        // Send Email to the Applicant
        await resend.emails.send({
            from: 'MCAverse Guest Application <onboarding@resend.dev>',
            to: [email],
            subject: 'Thank You for Your MCAverse Podcast Application!',
            html: `<h1>Thank You, ${safeName}!</h1>
                   <p>We've received your application to be a guest on the podcast.</p>
                   <p>As a next step, please fill out this quick questionnaire so we can prepare:</p>
                   <a href="${googleFormLink}" style="display:inline-block;padding:10px 20px;background-color:#4f46e5;color:#ffffff;text-decoration:none;border-radius:5px;font-weight:bold;margin-top:10px;">Complete Questionnaire</a>
                   <p><br>Best,<br>The MCAverse Team</p>`,
        });

        // Send Email Alert to the Admin
        await resend.emails.send({
            from: 'MCAverse New Application <onboarding@resend.dev>',
            to: [adminEmail],
            subject: `New Podcast Guest Application: ${safeName}`,
            html: `<h2>New Guest Application</h2>
                   <p><strong>Name:</strong> ${safeName}</p>
                   <p><strong>Email:</strong> ${escapeHtml(email)}</p>
                   <p><strong>Profile Link:</strong> <a href="${safeSocial}">${safeSocial}</a></p>
                   <p><strong>Proposed Topic:</strong></p>
                   <blockquote style="border-left:4px solid #ccc;padding-left:10px;color:#555;">${safeTopic}</blockquote>`,
        });

        return NextResponse.json({ success: true, message: "Thank you! Kindly go through your provided email for further proceedings." });

    } catch (error) {
        console.error("Error processing guest application:", error);
        return NextResponse.json({ success: false, message: "Something went wrong. Please try again." }, { status: 500 });
    }
}