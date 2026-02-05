import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getFunctions, Functions } from 'firebase/functions';

// ... (previous imports)

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const functions: Functions = getFunctions(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
