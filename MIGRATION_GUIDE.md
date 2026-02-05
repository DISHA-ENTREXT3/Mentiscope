# Migration and Deployment Guide: Render Backend + Firebase Database

This guide outlines the steps to move your backend from Firebase Cloud Functions to Render, while keeping your data in Firebase Firestore.

## 1. Firebase Setup (Database & Auth)

- **Keep your current Firebase project.** Your Firestore data and Firebase Authentication will remain unchanged.
- **Service Account Key**:
  1.  Go to the [Firebase Console](https://console.firebase.google.com/).
  2.  Project Settings > Service Accounts.
  3.  Click **Generate new private key**.
  4.  Save the JSON file. You will need its contents for the Render environment variables.

## 2. Render Setup (Backend)

1.  Create a new **Web Service** on Render.
2.  Connect your GitHub repository.
3.  Set the following configuration:
    - **Root Directory**: `backend-node`
    - **Build Command**: `npm install`
    - **Start Command**: `node src/index.js`
4.  Add **Environment Variables**:
    - `PORT`: `5000` (or leave blank, Render provides one)
    - `NODE_ENV`: `production`
    - `OPENAI_API_KEY`: Your OpenAI API key.
    - `FIREBASE_SERVICE_ACCOUNT`: Paste the **entire content** of the service account JSON file.
    - `ALLOWED_ORIGINS`: `https://mentiscope.vercel.app` (comma separated if multiple)
5.  Deploy the service. Note the **Service URL** (e.g., `https://mentiscope-backend.onrender.com`).

## 3. Vercel Setup (Frontend)

1.  Go to your Vercel Dashboard.
2.  Select your project > Settings > Environment Variables.
3.  Add/Update:
    - `NEXT_PUBLIC_API_URL`: Set this to your Render Service URL (without the trailing slash).
4.  Redeploy your frontend.

## 4. GitHub & CI/CD

1.  **Remove Secrets from Code**: Ensure no API keys or local settings are hardcoded.
2.  **GitHub Secrets**: (Optional) Add `OPENAI_API_KEY` and `FIREBASE_SERVICE_ACCOUNT` to GitHub Actions secrets if you want to run automated tests on every push.
3.  **Tests**:
    - Run `npm run test` in `backend-node` for unit tests.
    - Run `npx playwright test` in `frontend` for E2E tests.

## Local Development

1.  Frontend: `npm run dev` in `frontend` directory.
2.  Backend: `npm run dev` in `backend-node` directory (make sure you have a `.env` file with the required keys).

## Key Changes Made:

- Created `backend-node`: A standalone Express server for Render.
- Updated `frontend/src/lib/api.ts`: Now calls the Render API instead of Firebase Functions.
- Added E2E Tests: Located in `frontend/e2e`.
- Added Unit Tests: Located in `backend-node/src/tests`.
- Removed hardcoded `localhost` references in API calls.
