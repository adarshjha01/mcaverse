// src/app/actions.ts
"use server"; // This marks all functions in this file as Server Actions

import { z } from 'zod';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { Resend } from 'resend';

// --- Zod Schema for Validation ---
// This ensures the data received from the form is in the correct format.
const GuestApplicationSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  expertise: z.string().min(5, { message: "Please describe your expertise." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

// --- Initialize Firebase Admin SDK ---
// This setup ensures we only initialize the app once.
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON!);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}
const db = getFirestore();

// --- Initialize Resend ---
const resend = new Resend(process.env.RESEND_API_KEY);

// --- The Main Server Action ---
export async function submitGuestApplication(prevState: any, formData: FormData) {
  // 1. Validate the form data
  const validatedFields = GuestApplicationSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    expertise: formData.get('expertise'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, expertise, message } = validatedFields.data;

  try {
    // 2. Save the application to Firestore
    await db.collection('guest-applications').add({
      name,
      email,
      expertise,
      message,
      submittedAt: new Date(),
    });

    // 3. Send confirmation email to the applicant
    await resend.emails.send({
      from: 'MCAverse <onboarding@resend.dev>', // Must be from a verified domain or resend.dev
      to: [email], // The email address the user provided
      subject: 'Thank You for Your MCAverse Podcast Application!',
      html: `
        <h1>Thank You, ${name}!</h1>
        <p>We've received your application to be a guest on the MCAverse podcast. We appreciate your interest!</p>
        <p>As a next step, please fill out this brief pre-interview questionnaire:</p>
        <a href="YOUR_GOOGLE_FORM_LINK_HERE" style="background-color: #4f46e5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Complete Questionnaire</a>
        <p>We'll review your submission and get back to you soon.</p>
        <br/>
        <p>Best,</p>
        <p>The MCAverse Team</p>
      `,
    });

    // 4. Send a notification email to yourself
     await resend.emails.send({
      from: 'MCAverse <onboarding@resend.dev>',
      to: [process.env.ADMIN_EMAIL_ADDRESS!],
      subject: `New Podcast Guest Application: ${name}`,
      html: `
        <p>You have a new application from:</p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Expertise:</strong> ${expertise}</li>
          <li><strong>Message:</strong> ${message}</li>
        </ul>
      `,
    });


    return { success: true, message: "Thank you! Your application has been submitted." };

  } catch (error) {
    console.error("Error processing application:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}
