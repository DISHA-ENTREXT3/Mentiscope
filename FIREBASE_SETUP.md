# Firebase Setup Guide for Mentiscope

This guide will walk you through setting up Firebase for your Mentiscope application.

## Prerequisites

- A Google account
- Access to the [Firebase Console](https://console.firebase.google.com/)

---

## Step 1: Create a Firebase Project

1. **Go to Firebase Console**: Visit [https://console.firebase.google.com/](https://console.firebase.google.com/)

2. **Create a New Project**:
   - Click on "Add project" or "Create a project"
   - Enter your project name: `mentiscope` (or your preferred name)
   - Click "Continue"

3. **Google Analytics** (Optional):
   - You can enable or disable Google Analytics
   - If enabled, select or create an Analytics account
   - Click "Create project"

4. **Wait for Project Creation**:
   - Firebase will set up your project (this takes a few seconds)
   - Click "Continue" when ready

---

## Step 2: Register Your Web App

1. **Add a Web App**:
   - In your Firebase project dashboard, click the **Web icon** (`</>`) to add a web app
   - Or go to Project Settings > General > Your apps > Add app > Web

2. **Register App**:
   - Enter an app nickname: `Mentiscope Web App`
   - ✅ Check "Also set up Firebase Hosting" (optional, but recommended)
   - Click "Register app"

3. **Copy Firebase Configuration**:
   - Firebase will display your app's configuration object
   - It looks like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "your-project-id.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project-id.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef1234567890",
     measurementId: "G-XXXXXXXXXX",
   };
   ```

   - **Keep this window open** or copy these values somewhere safe

---

## Step 3: Enable Google Authentication

1. **Navigate to Authentication**:
   - In the Firebase Console left sidebar, click **"Authentication"**
   - Click **"Get started"** if this is your first time

2. **Enable Google Sign-In**:
   - Go to the **"Sign-in method"** tab
   - Find **"Google"** in the list of providers
   - Click on it to expand

3. **Configure Google Provider**:
   - Toggle the **"Enable"** switch to ON
   - Enter a **"Project support email"** (your email address)
   - Click **"Save"**

4. **Optional - Add Authorized Domains**:
   - Go to **"Settings"** tab in Authentication
   - Scroll to **"Authorized domains"**
   - Add your production domain (e.g., `mentiscope.vercel.app`)
   - `localhost` is already authorized by default for development

---

## Step 4: Configure Your Application

1. **Update `.env.local` File**:
   - Open `frontend/.env.local` in your project
   - Replace the placeholder values with your Firebase config:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

2. **Save the File**

---

## Step 5: Test Locally

1. **Start Your Development Server**:

   ```bash
   cd frontend
   npm run dev
   ```

2. **Test Authentication**:
   - Open your browser to `http://localhost:3000`
   - Click "Get Started" or "Sign In"
   - Try signing in with Google
   - You should be redirected to Google's sign-in page
   - After successful sign-in, you'll be redirected back to your app

3. **Verify in Firebase Console**:
   - Go to Firebase Console > Authentication > Users
   - You should see your user account listed

---

## Step 6: Deploy to Vercel (Production)

### 6.1 Add Environment Variables to Vercel

1. **Go to Your Vercel Dashboard**:
   - Visit [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your Mentiscope project

2. **Navigate to Settings**:
   - Click on **"Settings"** tab
   - Go to **"Environment Variables"**

3. **Add Each Firebase Variable**:
   Add the following environment variables one by one:

   | Variable Name                              | Value                    |
   | ------------------------------------------ | ------------------------ |
   | `NEXT_PUBLIC_FIREBASE_API_KEY`             | Your Firebase API Key    |
   | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`         | Your Auth Domain         |
   | `NEXT_PUBLIC_FIREBASE_PROJECT_ID`          | Your Project ID          |
   | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`      | Your Storage Bucket      |
   | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Your Messaging Sender ID |
   | `NEXT_PUBLIC_FIREBASE_APP_ID`              | Your App ID              |
   | `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`      | Your Measurement ID      |
   | `NEXT_PUBLIC_API_URL`                      | Your production API URL  |

   For each variable:
   - Click **"Add New"**
   - Enter the **Name** and **Value**
   - Select all environments (Production, Preview, Development)
   - Click **"Save"**

### 6.2 Update Authorized Domains in Firebase

1. **Get Your Vercel Domain**:
   - In Vercel dashboard, find your deployment URL
   - Example: `mentiscope.vercel.app`

2. **Add to Firebase Authorized Domains**:
   - Go to Firebase Console > Authentication > Settings
   - Scroll to **"Authorized domains"**
   - Click **"Add domain"**
   - Enter your Vercel domain (without `https://`)
   - Click **"Add"**

### 6.3 Redeploy Your Application

1. **Trigger a New Deployment**:
   - In Vercel dashboard, go to **"Deployments"**
   - Click **"Redeploy"** on your latest deployment
   - Or push a new commit to your GitHub repository

2. **Verify Production Deployment**:
   - Visit your production URL
   - Test the sign-in flow
   - Check that authentication works correctly

---

## Step 7: Security Best Practices

### 7.1 Set Up Firebase Security Rules

Firebase automatically creates basic security rules, but you should review them:

1. **Firestore Rules** (if using Firestore in the future):
   - Go to Firebase Console > Firestore Database > Rules
   - Ensure users can only access their own data

2. **Storage Rules** (if using Firebase Storage):
   - Go to Firebase Console > Storage > Rules
   - Restrict access appropriately

### 7.2 API Key Security

**Important**: The `NEXT_PUBLIC_FIREBASE_API_KEY` is safe to expose in client-side code. Firebase uses:

- **App Check** to prevent unauthorized access
- **Security Rules** to protect your data
- **Authentication** to verify users

However, you should still:

- Enable **Firebase App Check** for additional security
- Set up proper **Security Rules** for any Firebase services you use
- Monitor usage in Firebase Console

---

## Step 8: Optional - Enable Additional Features

### Firebase Firestore (Database)

If you want to store user data in Firebase:

1. **Enable Firestore**:
   - Go to Firebase Console > Firestore Database
   - Click "Create database"
   - Choose production mode or test mode
   - Select a location

2. **Update Security Rules**:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

### Firebase Analytics

Already enabled if you selected it during project creation. View analytics in Firebase Console > Analytics.

### Firebase Hosting

For hosting your frontend directly on Firebase:

1. **Install Firebase CLI**:

   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:

   ```bash
   firebase login
   ```

3. **Initialize Hosting**:
   ```bash
   firebase init hosting
   ```

---

## Troubleshooting

### Issue: "Firebase: Error (auth/unauthorized-domain)"

**Solution**: Add your domain to Firebase authorized domains:

- Firebase Console > Authentication > Settings > Authorized domains

### Issue: Sign-in popup blocked

**Solution**:

- Ensure pop-ups are allowed in your browser
- Or use redirect-based sign-in instead of popup

### Issue: Environment variables not working

**Solution**:

- Ensure all variables start with `NEXT_PUBLIC_`
- Restart your development server after changing `.env.local`
- For Vercel, ensure variables are added to all environments

---

## Summary

You've successfully:
✅ Created a Firebase project  
✅ Enabled Google Authentication  
✅ Configured your application with Firebase credentials  
✅ Set up environment variables for local and production  
✅ Deployed to Vercel with Firebase integration

Your Mentiscope application now uses Firebase for authentication! 🎉

---

## Next Steps

- Set up Firebase Firestore for data storage
- Implement user profiles in Firebase
- Add more authentication providers (GitHub, Email/Password)
- Enable Firebase Analytics for user insights
- Set up Firebase Cloud Functions for backend logic

For more information, visit the [Firebase Documentation](https://firebase.google.com/docs).
