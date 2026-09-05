/**
 * Firebase client SDK bootstrap.
 *
 * All values come from NEXT_PUBLIC_* env vars — copy `.env.local.example`
 * to `.env.local` and fill in the values from your Firebase project
 * (Project settings > General > Your apps > Web app). The exact same
 * values used by `neria_commerce/app/lib/firebase/client.ts` work here
 * because both apps point at the same Firebase project.
 *
 * This file is safe to import from both Client Components and the browser
 * bundle. It guards against re-initializing the app on hot reload /
 * multiple imports, which Next.js dev mode can otherwise trigger.
 */

import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";
import {
  getFirestore,
  connectFirestoreEmulator,
  type Firestore,
} from "firebase/firestore";
import {
  getStorage,
  connectStorageEmulator,
  type FirebaseStorage,
} from "firebase/storage";
import {
  getFunctions,
  connectFunctionsEmulator,
  type Functions,
} from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // Optional — Analytics; safe to leave undefined.
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

function assertConfig() {
  const missing = Object.entries(firebaseConfig)
    .filter(([key, value]) => key !== "measurementId" && !value)
    .map(([key]) => key);

  if (missing.length > 0 && typeof window !== "undefined") {
    // Don't throw at import time (breaks the whole app tree during
    // build/prerender); just warn loudly so it's obvious in the browser
    // console during setup.
    // eslint-disable-next-line no-console
    console.error(
      `[firebase] Missing required env vars: ${missing.join(", ")}. ` +
        `Copy .env.local.example to .env.local and fill in your Firebase project config.`,
    );
  }
}
assertConfig();

export const firebaseApp: FirebaseApp =
  getApps().length > 0 ? getApps()[0]! : initializeApp(firebaseConfig);

export const auth: Auth = getAuth(firebaseApp);
export const db: Firestore = getFirestore(firebaseApp);
export const storage: FirebaseStorage = getStorage(firebaseApp);
// Region must match the region Cloud Functions are deployed to in
// `neria_commerce/functions/src/config.ts` — `us-central1` for this project.
export const functions: Functions = getFunctions(firebaseApp, "us-central1");

// Local emulator support — set NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true in
// .env.local when running `firebase emulators:start` alongside `next dev`.
let emulatorsConnected = false;
if (
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true" &&
  !emulatorsConnected
) {
  emulatorsConnected = true;
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectStorageEmulator(storage, "127.0.0.1", 9199);
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}
