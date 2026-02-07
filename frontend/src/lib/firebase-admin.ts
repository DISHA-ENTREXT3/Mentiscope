import * as admin from 'firebase-admin';

const projectId = process.env.FIREBASE_PROJECT_ID_PRIVATE || process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!admin.apps.length) {
  if (projectId && clientEmail && privateKey) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
        projectId
      });
      console.log('Firebase Admin initialized successfully');
    } catch (error) {
      console.error('Firebase admin initialization error:', error);
    }
  } else {
    // Only warn if not in a build environment where we expect them to be missing
    if (process.env.NODE_ENV === 'production') {
      console.warn("Firebase Admin credentials missing in production!");
    }
  }
}

// Get instance only if app was initialized to avoid build-time crashes
export const db = admin.apps.length ? admin.firestore() : null;
export const auth = admin.apps.length ? admin.auth() : null;
