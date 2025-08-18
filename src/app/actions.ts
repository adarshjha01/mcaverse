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

