import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getFunctions, Functions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Only initialize if we're on the client side
const isClient = typeof window !== 'undefined';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isClient && firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your-api-key') {
  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    auth = getAuth(app!);
    db = getFirestore(app!);
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    console.warn("Firebase credentials may be invalid. Authentication will be degraded.");
  }
} else if (!isClient) {
  console.warn("Firebase initialization skipped (not on client side).");
}

export { auth, db };
export const functions: Functions | null = app ? getFunctions(app!) : null;

let googleProvider: GoogleAuthProvider | null = null;
if (isClient && app) {
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
}

export { googleProvider };

export default app;
