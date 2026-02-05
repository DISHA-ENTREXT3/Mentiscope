# Firebase Deployment Guide

## Quick Setup for Production

### 1. Firebase Console Configuration

#### A. Firestore Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Firestore Database** → **Rules**
4. Copy the contents of `firestore.rules` from this repository
5. Click **Publish**

#### B. Authentication Setup

1. Go to **Authentication** → **Sign-in method**
2. Enable **Google** provider
3. Add your production domain to **Authorized domains**:
   - Example: `mentiscope.vercel.app`
   - Example: `yourdomain.com`

#### C. Firestore Indexes (Optional but Recommended)

1. Go to **Firestore Database** → **Indexes**
2. Create composite indexes:

**Index 1: Students by Parent**

- Collection ID: `students`
- Fields indexed:
  - `parent_id` (Ascending)
  - `created_at` (Descending)

**Index 2: Assessments by Student**

- Collection ID: `assessments`
- Fields indexed:
  - `student_id` (Ascending)
  - `created_at` (Descending)

**Index 3: Analysis by Student**

- Collection ID: `analysis`
- Fields indexed:
  - `student_id` (Ascending)
  - `created_at` (Descending)

### 2. Environment Variables

#### For Vercel Deployment:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

**Firebase Admin SDK (Server-side)**

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
```

**Firebase Client SDK (Client-side)**

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

**OpenAI API Key (for AI analysis)**

```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Important Notes:**

- For `FIREBASE_PRIVATE_KEY`, ensure newlines (`\n`) are preserved
- Wrap the private key in double quotes
- Select all environments (Production, Preview, Development) for each variable

### 3. Getting Firebase Credentials

#### Admin SDK Credentials:

1. Go to Firebase Console → **Project Settings** (gear icon)
2. Navigate to **Service Accounts** tab
3. Click **Generate New Private Key**
4. Download the JSON file
5. Extract values:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

#### Client SDK Credentials:

1. Go to Firebase Console → **Project Settings**
2. Scroll to **Your apps** section
3. Click on your web app or create one
4. Copy the config values to environment variables

### 4. Deployment Checklist

Before deploying to production:

- [ ] Firebase project created
- [ ] Firestore security rules deployed
- [ ] Google Authentication enabled
- [ ] Authorized domains added
- [ ] All environment variables set in Vercel
- [ ] Firebase Admin SDK credentials configured
- [ ] Firebase Client SDK credentials configured
- [ ] OpenAI API key added (if using AI features)
- [ ] Database indexes created (optional but recommended)

### 5. Testing Production Deployment

After deployment:

1. **Test Authentication**:
   - Visit `/login`
   - Sign in with Google
   - Verify redirect to dashboard

2. **Test Student Creation**:
   - Complete onboarding form
   - Verify student appears in Firebase Console
   - Check that `password` field (10 chars) is present
   - Verify `neural_id` field exists

3. **Test Dashboard Access**:
   - Navigate to student dashboard
   - Verify data loads correctly
   - Check that AI analysis triggers (if configured)

### 6. Security Notes

**Password Storage:**

- Passwords are stored as plain text (10 characters)
- Only accessible by the parent who created the student
- Protected by Firestore security rules
- Cannot be modified after creation

**Security Rules Highlights:**

- Parents can only access their own students
- Password field is protected from updates
- Neural ID cannot be changed after creation
- Analysis results are read-only for parents

### 7. Troubleshooting

**Issue: "Firebase DB not initialized"**

- Check that all `FIREBASE_*` environment variables are set
- Verify private key format (includes `\n` characters)
- Redeploy after adding environment variables

**Issue: "Permission denied" in Firestore**

- Ensure security rules are published
- Check that user is authenticated
- Verify parent_id matches authenticated user

**Issue: Authentication not working**

- Add your domain to Firebase authorized domains
- Check that Google provider is enabled
- Verify client SDK credentials are correct

**Issue: Environment variables not working**

- Ensure variables are set for the correct environment
- Redeploy after adding new variables
- Check for typos in variable names

### 8. Firebase CLI Deployment (Alternative)

If you prefer using Firebase CLI:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init firestore

# Deploy security rules
firebase deploy --only firestore:rules

# Deploy indexes
firebase deploy --only firestore:indexes
```

### 9. Monitoring and Logs

**Firebase Console:**

- Monitor authentication: **Authentication** → **Users**
- View database: **Firestore Database** → **Data**
- Check logs: **Functions** → **Logs** (if using Cloud Functions)

**Vercel Dashboard:**

- View deployment logs: **Deployments** → Select deployment → **Logs**
- Monitor runtime logs: **Logs** tab
- Check function execution: **Functions** tab

### 10. Cost Considerations

**Free Tier Limits:**

- Firestore: 50K reads, 20K writes, 20K deletes per day
- Authentication: Unlimited
- Cloud Functions: 125K invocations, 40K GB-seconds per month

**Recommendations:**

- Monitor usage in Firebase Console
- Set up billing alerts
- Optimize queries to reduce reads
- Use caching where appropriate

---

## Quick Reference

### Essential Firebase Console Links:

- **Security Rules**: Firestore Database → Rules
- **Authentication**: Authentication → Sign-in method
- **Environment Config**: Project Settings → General
- **Service Account**: Project Settings → Service Accounts
- **Usage**: Usage and billing

### Essential Vercel Links:

- **Environment Variables**: Settings → Environment Variables
- **Deployment Logs**: Deployments → [Select] → Logs
- **Domain Settings**: Settings → Domains

---

**Need Help?**

- Firebase Documentation: https://firebase.google.com/docs
- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs

**Last Updated**: 2026-02-06  
**Version**: 2.0 (Simplified - No Hashing)
