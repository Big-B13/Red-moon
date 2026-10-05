// ── Red Moon · Firebase bootstrap ────────────────────────────────
// Reads the web config from environment variables (.env.local).
// Until those are filled in, `firebaseConfigured` is false and the
// archive runs in demo mode so the UI can be explored safely.

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseConfigured = Boolean(
  config.apiKey && config.projectId && config.appId
);

let services = null;

/** Returns { app, auth, db } or null when not configured yet.
 *  Storage is deliberately omitted: free Spark projects can't create a
 *  Storage bucket, so the vault is link-based (see lib/archiveDb.js). */
export function getFirebase() {
  if (!firebaseConfigured) return null;
  if (!services) {
    const app = getApps().length ? getApps()[0] : initializeApp(config);
    services = {
      app,
      auth: getAuth(app),
      db: getFirestore(app),
    };
  }
  return services;
}
