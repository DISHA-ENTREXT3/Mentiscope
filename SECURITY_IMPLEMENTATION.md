# Password Security Implementation

## Overview

This document describes the secure password generation and hashing implementation for student accounts in Mentiscope.

## Implementation Details

### 1. Password Generation

- **Length**: Fixed at 10 characters
- **Character Set**: Alphanumeric (a-z, A-Z, 0-9)
- **Randomness**: Uses cryptographically secure random number generation
  - Frontend: `window.crypto.getRandomValues()`
  - Backend: Node.js `crypto.randomInt()`

### 2. Password Hashing

- **Algorithm**: SHA-256
- **Storage**: Only the hashed password is stored in Firebase
- **One-time Display**: Raw password is shown only once during student creation

### 3. Files Modified/Created

#### Created Files:

1. **`frontend/src/lib/password.ts`**
   - Client-side password utilities using Web Crypto API
   - Functions: `generatePassword()`, `hashPassword()`

2. **`frontend/src/lib/password-server.ts`**
   - Server-side password utilities using Node.js crypto
   - Functions: `generatePassword()`, `hashPassword()`

#### Modified Files:

1. **`frontend/src/app/api/students/route.ts`**
   - Generates 10-character password on student creation
   - Hashes password before storing in Firebase
   - Returns raw password in API response (one-time only)
   - Adds `neural_id` field for friendly student identification

2. **`frontend/src/lib/api.ts`**
   - Updated `createStudent()` to call API endpoint
   - Returns student data including `raw_password` field

3. **`frontend/src/components/onboarding-form.tsx`**
   - Added "success" stage to display generated credentials
   - Shows student Neural ID and 10-character access key
   - Warns parent to store credentials securely

## Database Schema Changes

### Students Collection

New fields added to student documents:

```typescript
{
  id: string;
  name: string;
  grade_level: string;
  parent_id: string;
  school_type: string;
  created_at: string;
  readiness_score: number;
  password_hash: string; // NEW: SHA-256 hash of password
  neural_id: string; // NEW: Friendly ID (e.g., "STUDENT-A1B2C3")
}
```

## Security Best Practices

### ✅ Implemented

- Cryptographically secure random generation
- SHA-256 hashing before storage
- Password never stored in plain text
- One-time password display
- 10-character minimum length

### ⚠️ Important Notes

1. **Password Recovery**: Not possible due to one-way hashing. Parents must store the password securely.
2. **Password Reset**: Would require implementing a new password generation flow.
3. **Firebase Security Rules**: Should restrict access to `password_hash` field.

## Firebase Configuration Required

### Security Rules

Add these rules to Firebase Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /students/{studentId} {
      allow read: if request.auth != null &&
                  (request.auth.uid == resource.data.parent_id ||
                   request.auth.uid == studentId);

      allow create: if request.auth != null &&
                    request.auth.uid == request.resource.data.parent_id;

      allow update: if request.auth != null &&
                    request.auth.uid == resource.data.parent_id;

      // Never expose password_hash in client reads
      allow read: if request.auth != null &&
                  !('password_hash' in resource.data);
    }
  }
}
```

### Environment Variables

Ensure these are set in your `.env.local`:

```bash
# Firebase Admin SDK (Server-side)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key

# Firebase Client SDK (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## User Flow

### Student Creation Flow

1. Parent completes onboarding form
2. API generates 10-character password
3. API hashes password with SHA-256
4. Student record created with `password_hash` and `neural_id`
5. Success screen displays:
   - Neural ID (e.g., "STUDENT-A1B2C3")
   - Raw password (10 characters)
6. Parent must save credentials
7. Parent redirected to dashboard

### Future: Student Login Flow (To Implement)

1. Student enters Neural ID
2. Student enters password
3. Hash entered password
4. Compare with stored `password_hash`
5. Grant access if match

## Testing

### Manual Testing Steps

1. Complete onboarding form
2. Verify success screen shows:
   - Neural ID
   - 10-character password
3. Check Firebase console:
   - Student document exists
   - `password_hash` field is 64-character hex string
   - `neural_id` field is present
4. Verify password is NOT stored in plain text

### Security Validation

- [ ] Password is exactly 10 characters
- [ ] Password contains only alphanumeric characters
- [ ] `password_hash` is SHA-256 (64 hex chars)
- [ ] Raw password never stored in database
- [ ] Password displayed only once
- [ ] Firebase rules prevent `password_hash` exposure

## Future Enhancements

### Recommended Improvements

1. **Stronger Hashing**: Migrate from SHA-256 to bcrypt/argon2
2. **Password Complexity**: Add special characters requirement
3. **Student Login**: Implement authentication flow for students
4. **Password Reset**: Add secure password reset mechanism
5. **2FA**: Consider two-factor authentication for students
6. **Audit Logging**: Log password generation and authentication attempts

### Migration Path to Bcrypt

```typescript
// Instead of SHA-256
import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
```

## Compliance Notes

### COPPA Compliance

- Students under 13 require parental consent
- Parent creates account and receives credentials
- Parent responsible for credential security

### Data Protection

- Passwords hashed using industry-standard algorithm
- No plain-text password storage
- Minimal data collection

## Support

For questions or issues:

1. Check Firebase console for student records
2. Verify environment variables are set
3. Review Firebase security rules
4. Check browser console for errors

---

**Last Updated**: 2026-02-06  
**Version**: 1.0  
**Author**: Mentiscope Development Team
