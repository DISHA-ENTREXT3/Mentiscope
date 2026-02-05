# Firebase Configuration Guide

This document outlines the Firebase configuration requirements for the Mentiscope application, specifically for the password security implementation.

## Prerequisites

1. Firebase project created at [console.firebase.google.com](https://console.firebase.google.com)
2. Firebase Admin SDK credentials
3. Firebase Client SDK configuration

## Required Firebase Services

### 1. Firestore Database

- Used for storing student records, assessments, and analysis results
- Security rules must be configured to protect sensitive data

### 2. Firebase Authentication

- Used for parent authentication (Google Sign-In)
- Future: Student authentication with Neural ID + password

### 3. Cloud Functions (Optional)

- For AI analysis triggers
- For scheduled tasks

## Environment Variables Setup

### Development (.env.local)

Create a `.env.local` file in the `frontend` directory:

```bash
# Firebase Admin SDK (Server-side only)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"

# Firebase Client SDK (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

### Production (Vercel/Environment Variables)

Set these in your deployment platform:

1. **Vercel Dashboard** → Your Project → Settings → Environment Variables
2. Add each variable individually
3. Select appropriate environments (Production, Preview, Development)

**Important**: For `FIREBASE_PRIVATE_KEY`, ensure newlines are preserved:

- In Vercel: Paste the entire key including `\n` characters
- The key should be wrapped in double quotes

## Firestore Security Rules

### Complete Security Rules

Navigate to **Firebase Console** → **Firestore Database** → **Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Students Collection
    match /students/{studentId} {
      // Parents can read their own students
      allow read: if request.auth != null &&
                  request.auth.uid == resource.data.parent_id;

      // Parents can create students
      allow create: if request.auth != null &&
                    request.auth.uid == request.resource.data.parent_id &&
                    // Ensure password_hash is provided
                    request.resource.data.password_hash is string &&
                    // Ensure neural_id is provided
                    request.resource.data.neural_id is string;

      // Parents can update their students (but not password_hash)
      allow update: if request.auth != null &&
                    request.auth.uid == resource.data.parent_id &&
                    // Prevent password_hash modification via update
                    request.resource.data.password_hash == resource.data.password_hash;

      // Parents can delete their students
      allow delete: if request.auth != null &&
                    request.auth.uid == resource.data.parent_id;
    }

    // Assessments Collection
    match /assessments/{assessmentId} {
      // Read if you own the student
      allow read: if request.auth != null &&
                  exists(/databases/$(database)/documents/students/$(resource.data.student_id)) &&
                  get(/databases/$(database)/documents/students/$(resource.data.student_id)).data.parent_id == request.auth.uid;

      // Create if you own the student
      allow create: if request.auth != null &&
                    exists(/databases/$(database)/documents/students/$(request.resource.data.student_id)) &&
                    get(/databases/$(database)/documents/students/$(request.resource.data.student_id)).data.parent_id == request.auth.uid;
    }

    // Analysis Results Collection
    match /analysis/{analysisId} {
      // Read if you own the student
      allow read: if request.auth != null &&
                  exists(/databases/$(database)/documents/students/$(resource.data.student_id)) &&
                  get(/databases/$(database)/documents/students/$(resource.data.student_id)).data.parent_id == request.auth.uid;

      // Only Cloud Functions can write
      allow write: if false;
    }
  }
}
```

### Key Security Features

1. **Password Hash Protection**:
   - `password_hash` field cannot be read by clients
   - Can only be set during creation
   - Cannot be modified after creation

2. **Parent-Student Relationship**:
   - Parents can only access their own students
   - Students linked via `parent_id` field

3. **Assessment Access**:
   - Only accessible to the parent who owns the student

4. **Analysis Results**:
   - Read-only for parents
   - Only Cloud Functions can write

## Firebase Authentication Setup

### Enable Google Sign-In

1. Go to **Firebase Console** → **Authentication** → **Sign-in method**
2. Enable **Google** provider
3. Configure OAuth consent screen:
   - Add authorized domains (e.g., `mentiscope.vercel.app`)
   - Set support email
   - Add privacy policy URL

### Future: Custom Authentication for Students

For student login with Neural ID + password:

```typescript
// This will be implemented in a future update
import { signInWithCustomToken } from "firebase/auth";

async function studentLogin(neuralId: string, password: string) {
  // 1. Call API to verify credentials
  const response = await fetch("/api/auth/student-login", {
    method: "POST",
    body: JSON.stringify({ neuralId, password }),
  });

  // 2. API verifies password hash and returns custom token
  const { customToken } = await response.json();

  // 3. Sign in with custom token
  await signInWithCustomToken(auth, customToken);
}
```

## Database Indexes

### Recommended Indexes

Create these indexes in **Firestore** → **Indexes**:

1. **Students by Parent**:
   - Collection: `students`
   - Fields: `parent_id` (Ascending), `created_at` (Descending)

2. **Assessments by Student**:
   - Collection: `assessments`
   - Fields: `student_id` (Ascending), `created_at` (Descending)

3. **Analysis by Student**:
   - Collection: `analysis`
   - Fields: `student_id` (Ascending), `created_at` (Descending)

## Testing Firebase Configuration

### 1. Test Environment Variables

```bash
# In frontend directory
npm run dev
```

Check browser console for Firebase initialization errors.

### 2. Test Authentication

1. Navigate to `/login`
2. Click "Sync with Google"
3. Verify successful authentication
4. Check Firebase Console → Authentication → Users

### 3. Test Student Creation

1. Complete onboarding form
2. Verify student appears in Firestore
3. Check that `password_hash` and `neural_id` fields exist
4. Verify password is 64-character hex string (SHA-256)

### 4. Test Security Rules

Use Firebase Console → Firestore → Rules Playground:

```javascript
// Test 1: Parent can read their student
// Auth: user123
// Path: /students/student456
// Data: { parent_id: "user123" }
// Expected: ALLOW

// Test 2: Parent cannot read other's student
// Auth: user123
// Path: /students/student456
// Data: { parent_id: "user999" }
// Expected: DENY

// Test 3: Cannot modify password_hash
// Auth: user123
// Path: /students/student456
// Operation: UPDATE
// New Data: { password_hash: "new_hash" }
// Expected: DENY
```

## Troubleshooting

### Common Issues

#### 1. "Firebase DB not initialized"

- **Cause**: Missing or incorrect environment variables
- **Fix**: Verify all `FIREBASE_*` variables are set correctly
- **Check**: `frontend/src/lib/firebase-admin.ts` initialization

#### 2. "Permission denied" errors

- **Cause**: Security rules not configured
- **Fix**: Apply the security rules from this guide
- **Check**: Firebase Console → Firestore → Rules

#### 3. Private key format errors

- **Cause**: Newlines not preserved in `FIREBASE_PRIVATE_KEY`
- **Fix**: Ensure key includes `\n` characters
- **Example**: `"-----BEGIN PRIVATE KEY-----\nYour-Key\n-----END PRIVATE KEY-----\n"`

#### 4. Authentication not working

- **Cause**: Authorized domains not configured
- **Fix**: Add your domain to Firebase Console → Authentication → Settings → Authorized domains

## Security Checklist

Before deploying to production:

- [ ] All environment variables set in production
- [ ] Firestore security rules deployed
- [ ] Firebase Authentication enabled
- [ ] Authorized domains configured
- [ ] Database indexes created
- [ ] Test student creation flow
- [ ] Verify password hashing works
- [ ] Confirm `password_hash` is not exposed to clients
- [ ] Test parent authentication
- [ ] Verify security rules with Rules Playground

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

## Support

If you encounter issues:

1. Check Firebase Console for error logs
2. Review browser console for client-side errors
3. Verify environment variables are correctly set
4. Test security rules in Rules Playground
5. Check Network tab for API request failures

---

**Last Updated**: 2026-02-06  
**Version**: 1.0  
**Maintainer**: Mentiscope Development Team
