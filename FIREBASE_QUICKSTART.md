# Firebase Setup - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Firebase Project (2 min)

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name it "Mentiscope" → Continue
4. Disable Google Analytics (optional) → Create project

### Step 2: Add Web App (1 min)

1. Click the Web icon `</>` in project overview
2. Register app as "Mentiscope Web App"
3. **Copy the config values** (you'll need these!)

### Step 3: Enable Google Auth (1 min)

1. Click "Authentication" in sidebar → "Get started"
2. Click "Sign-in method" tab
3. Enable "Google" provider
4. Add your support email → Save

### Step 4: Update Your Code (1 min)

Open `frontend/.env.local` and paste your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mentiscope-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mentiscope-xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mentiscope-xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Step 5: Test It! (30 sec)

```bash
cd frontend
npm run dev
```

Visit http://localhost:3000 and try signing in!

---

## 📋 For Vercel Deployment

### Add Environment Variables to Vercel:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add each variable from your `.env.local` file
3. Select all environments (Production, Preview, Development)
4. Click Save

### Add Your Vercel Domain to Firebase:

1. Firebase Console → Authentication → Settings → Authorized domains
2. Click "Add domain"
3. Enter your Vercel domain (e.g., `mentiscope.vercel.app`)
4. Save

### Redeploy:

Push to GitHub or click "Redeploy" in Vercel dashboard

---

## ✅ Verification Checklist

- [ ] Firebase project created
- [ ] Web app registered in Firebase
- [ ] Google authentication enabled
- [ ] `.env.local` updated with Firebase config
- [ ] Local development server running
- [ ] Can sign in with Google locally
- [ ] Environment variables added to Vercel
- [ ] Vercel domain added to Firebase authorized domains
- [ ] Production deployment successful
- [ ] Can sign in with Google in production

---

## 🆘 Common Issues

### "Firebase: Error (auth/unauthorized-domain)"

**Fix**: Add your domain to Firebase Console → Authentication → Settings → Authorized domains

### Environment variables not working

**Fix**:

- Restart dev server after changing `.env.local`
- Ensure all variables start with `NEXT_PUBLIC_`
- For Vercel, verify variables are added to all environments

### Sign-in popup blocked

**Fix**: Allow popups in browser settings

---

## 📚 Full Documentation

For detailed instructions, see `FIREBASE_SETUP.md`

---

**Need Help?** Check the [Firebase Documentation](https://firebase.google.com/docs/auth)
