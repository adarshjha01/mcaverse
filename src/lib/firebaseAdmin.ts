// src/lib/firebaseAdmin.ts
// src/lib/firebaseAdmin.ts
console.log("TRUSTED HOSTS:", process.env.SERVER_ACTIONS_TRUSTED_HOSTS); // <-- ADD THIS LINE

import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// This is a more robust way to handle the service account credentials
const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID!,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
  // The .env file can struggle with newlines, so we replace the literal '\n' with actual newlines
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
};

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore();

export { db };
