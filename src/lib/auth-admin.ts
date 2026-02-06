// src/lib/auth-admin.ts
import { auth } from "@/lib/firebaseAdmin";
import { headers } from "next/headers";

export async function verifyAuth() {
  const headersList = await headers();
  const token = headersList.get("Authorization")?.split("Bearer ")[1];

  if (!token) {
    return null;
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    console.error("Auth verification failed:", error);
    return null;
  }
}