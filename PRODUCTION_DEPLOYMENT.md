# Mentiscope Production Deployment Guide

## Overview
This guide covers deploying Mentiscope to production with Vercel (frontend) and Render (backend).

## Prerequisites
- GitHub account with Mentiscope repository
- Vercel account
- Render account  
- Firebase project with Firestore database
- OpenRouter API key (free tier available)
- DodoPayments account for payment processing

## Step 1: Firebase Setup

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com
   - Create a new project named "Mentiscope"
   - Enable Firestore Database (Start in production mode)
   - Enable Authentication (Google OAuth provider)

2. **Get Firebase Credentials**
   - Project Settings → Service Accounts
   - Generate new private key (JSON format) for backend
   - Copy Web API credentials for frontend

3. **Update Firestore Security Rules**
   ```firestore
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Students - owned by parent
       match /students/{document=**} {
         allow read, write: if request.auth.uid == resource.data.parent_id;
         allow create: if request.auth.uid == request.resource.data.parent_id;
       }
       
       // Assessments - owned by parent
       match /assessments/{document=**} {
         allow read, write: if request.auth.uid == resource.data.parent_id;
         allow create: if request.auth.uid == request.resource.data.parent_id;
       }
       
       // Support requests - public
       match /support_requests/{document=**} {
         allow create: if true;
         allow read: if request.auth != null;
       }
     }
   }
   ```

## Step 2: Frontend Deployment (Vercel)

1. **Connect Repository**
   - Go to https://vercel.com
   - Click "Add New" → "Project"
   - Import the Mentiscope GitHub repository
   - Select `frontend` folder as root directory

2. **Set Environment Variables**
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY = <from Firebase>
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = <your-project>.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID = <your-project-id>
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = <your-project>.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = <from Firebase>
   NEXT_PUBLIC_FIREBASE_APP_ID = <from Firebase>
   NEXT_PUBLIC_API_URL = https://mentiscope-api.onrender.com
   ```

3. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your frontend will be live at `https://<your-project>.vercel.app`

## Step 3: Backend Deployment (Render)

1. **Create Web Service**
   - Go to https://render.com
   - Click "New+" → "Web Service"
   - Connect GitHub repository
   - Select root directory: `/backend-node`

2. **Configure Service**
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `node src/index.js`

3. **Set Environment Variables**
   ```
   FIREBASE_PROJECT_ID = <your-project-id>
   FIREBASE_PRIVATE_KEY = <paste full private key from service account JSON>
   FIREBASE_CLIENT_EMAIL = <from service account JSON>
   OPENROUTER_API_KEY = <your OpenRouter API key>
   OPENROUTER_REFERER = https://mentiscope.vercel.app
   DODO_PAYMENTS_API_KEY = <your DodoPayments key>
   ALLOWED_ORIGINS = https://mentiscope.vercel.app,https://*.vercel.app
   PORT = 5000
   NODE_ENV = production
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Build and deploy will start automatically
   - Your backend will be live at `https://mentiscope-api.onrender.com`

## Step 4: OpenRouter AI Setup

1. **Get API Key**
   - Visit https://openrouter.ai
   - Sign up and create API key
   - Free tier includes access to mistral-7b-instruct

2. **Configure in Backend**
   - Add `OPENROUTER_API_KEY` environment variable to Render
   - Free tier supports approximately 100 requests/month

## Step 5: Payment Processing (DodoPayments)

1. **Create DodoPayments Account**
   - Visit https://dodopayments.com
   - Complete merchant onboarding

2. **Configure Products**
   - Create products for each pricing tier:
     - Neural Basic: $0 (free)
     - Cognitive Pro: $29/month or $290/year
     - Neural Elite: $99/month or $990/year

3. **Add API Keys**
   - Add `DODO_PAYMENTS_API_KEY` to Render environment
   - Add `DODO_PAYMENTS_ENDPOINT` if using sandbox

## Step 6: Production Verification

### Frontend Checks
- [ ] Home page loads without errors
- [ ] Navigation works (all links functional)
- [ ] Blog section displays properly formatted content
- [ ] Support chatbot shows 6 ticket categories
- [ ] Sign up → onboarding flow works end-to-end
- [ ] Dashboard loads after onboarding completes

### Backend Checks
- [ ] Health check: `GET https://mentiscope-api.onrender.com/`
- [ ] Student creation: POST `/api/students`
- [ ] Assessment submission: POST `/api/assessments/submit`
- [ ] AI analysis: POST `/api/students/{id}/analyze`
- [ ] Support ticket: POST `/api/support`

### Database Checks
- [ ] Firestore collections created: `students`, `assessments`, `support_requests`
- [ ] Authentication working with Google OAuth
- [ ] Security rules enforced (test with different users)

## Step 7: Post-Launch Monitoring

1. **Set Up Error Tracking**
   - Install Sentry on Vercel
   - Monitor frontend errors

2. **Monitor Backend**
   - Check Render dashboard for logs
   - Monitor API response times
   - Track OpenRouter API usage

3. **Performance Monitoring**
   - Use Vercel Analytics
   - Monitor Core Web Vitals
   - Track database query performance

## Troubleshooting

### Firebase Connection Issues
```bash
# Test connection
curl -H "Authorization: Bearer YOUR_ID_TOKEN" \
  "https://firestore.googleapis.com/v1/projects/YOUR_PROJECT/databases/(default)/documents/students"
```

### OpenRouter API Issues
```bash
# Test OpenRouter connection
curl -X POST https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer YOUR_OPENROUTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "mistral/mistral-7b-instruct:free",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### Payment Processing Issues
- Verify DodoPayments API key is correct
- Check that product IDs match payment form
- Test in sandbox environment first

## Support
For issues or questions:
- Email: support@mentiscope.com
- GitHub Issues: https://github.com/DISHA-ENTREXT3/Mentiscope/issues
