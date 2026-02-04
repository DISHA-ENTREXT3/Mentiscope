# Firebase Backend Migration Guide

## Overview

This guide shows how to migrate from a separate FastAPI backend to Firebase Cloud Functions, creating a fully Firebase-based architecture.

---

## Architecture Comparison

### Current (Firebase + FastAPI)

```
Frontend (Vercel) → FastAPI (Railway/Render) → PostgreSQL
                  ↓
            Firebase Auth
```

### Proposed (Firebase-Only)

```
Frontend (Vercel/Firebase Hosting) → Firebase Cloud Functions → Firestore
                                   ↓
                            Firebase Auth
```

---

## Benefits of Firebase-Only Architecture

### Cost

- ✅ **Free Tier**: Generous limits for small apps
- ✅ **Pay-as-you-go**: Only pay for what you use
- ✅ **No Server Costs**: No Railway/Render subscription

### Simplicity

- ✅ **Single Platform**: Everything in Firebase Console
- ✅ **Auto-Scaling**: Handles traffic spikes automatically
- ✅ **No DevOps**: No server management needed

### Features

- ✅ **Real-time**: Built-in real-time database updates
- ✅ **Offline Support**: Works offline automatically
- ✅ **Security Rules**: Built-in access control

---

## Implementation Steps

### Step 1: Enable Firestore Database

1. **Go to Firebase Console** → Your Project
2. **Click "Firestore Database"** in sidebar
3. **Click "Create database"**
4. **Choose Production Mode**
5. **Select a location** (e.g., us-central)

### Step 2: Set Up Cloud Functions

#### Install Firebase CLI

```bash
npm install -g firebase-tools
```

#### Login to Firebase

```bash
firebase login
```

#### Initialize Functions

```bash
cd backend
firebase init functions
```

Select:

- ✅ Use existing project
- ✅ TypeScript or JavaScript (recommend TypeScript)
- ✅ ESLint
- ✅ Install dependencies

### Step 3: Create Database Schema in Firestore

Firestore uses collections and documents instead of SQL tables.

#### Collections Structure:

```
users/
  {userId}/
    - name
    - email
    - created_at

students/
  {studentId}/
    - name
    - grade_level
    - parent_id
    - school_type
    - created_at

assessments/
  {assessmentId}/
    - student_id
    - type
    - data (JSON)
    - analysis_results (JSON)
    - created_at

insights/
  {insightId}/
    - student_id
    - assessment_id
    - type
    - title
    - observation
    - interpretation
    - confidence_score
    - scientific_references (array)
    - dimension
    - is_viewed
    - created_at

action_plans/
  {actionPlanId}/
    - student_id
    - insight_id
    - title
    - description
    - role_target
    - status
    - due_date
    - created_at
```

### Step 4: Migrate Backend Logic to Cloud Functions

#### Example: Create Student Function

**File**: `backend/functions/src/index.ts`

```typescript
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// Create Student
export const createStudent = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated",
    );
  }

  const { name, grade_level, school_type } = data;
  const parent_id = context.auth.uid;

  // Validate input
  if (!name || !grade_level) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Name and grade level are required",
    );
  }

  // Create student document
  const studentRef = db.collection("students").doc();
  await studentRef.set({
    name,
    grade_level,
    parent_id,
    school_type: school_type || "public",
    created_at: admin.firestore.FieldValue.serverTimestamp(),
  });

  return {
    id: studentRef.id,
    name,
    grade_level,
    parent_id,
    school_type,
  };
});

// Submit Assessment
export const submitAssessment = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated",
      );
    }

    const { student_id, assessment_type, assessment_data } = data;

    // Verify student belongs to user
    const studentDoc = await db.collection("students").doc(student_id).get();
    if (
      !studentDoc.exists ||
      studentDoc.data()?.parent_id !== context.auth.uid
    ) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Access denied",
      );
    }

    // Create assessment
    const assessmentRef = db.collection("assessments").doc();
    await assessmentRef.set({
      student_id,
      type: assessment_type,
      data: assessment_data,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Trigger AI analysis (async)
    await triggerAnalysis(student_id, assessmentRef.id);

    return {
      id: assessmentRef.id,
      student_id,
      type: assessment_type,
    };
  },
);

// Trigger AI Analysis (using OpenAI)
async function triggerAnalysis(studentId: string, assessmentId: string) {
  // This would call OpenAI API
  // For now, we'll create a placeholder insight

  const insightRef = db.collection("insights").doc();
  await insightRef.set({
    student_id: studentId,
    assessment_id: assessmentId,
    type: "strength",
    title: "Analysis in Progress",
    observation: "AI analysis is being generated...",
    interpretation: "Results will be available shortly.",
    confidence_score: 0,
    dimension: "cognitive_development",
    scientific_references: [],
    is_viewed: false,
    created_at: admin.firestore.FieldValue.serverTimestamp(),
  });

  // TODO: Implement actual OpenAI integration
  // This could be a separate background function
}

// Get Student Dashboard
export const getStudentDashboard = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated",
      );
    }

    const { student_id } = data;

    // Get student
    const studentDoc = await db.collection("students").doc(student_id).get();
    if (
      !studentDoc.exists ||
      studentDoc.data()?.parent_id !== context.auth.uid
    ) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Access denied",
      );
    }

    // Get assessments
    const assessmentsSnapshot = await db
      .collection("assessments")
      .where("student_id", "==", student_id)
      .orderBy("created_at", "desc")
      .get();

    // Get insights
    const insightsSnapshot = await db
      .collection("insights")
      .where("student_id", "==", student_id)
      .orderBy("created_at", "desc")
      .get();

    // Get action plans
    const actionPlansSnapshot = await db
      .collection("action_plans")
      .where("student_id", "==", student_id)
      .orderBy("created_at", "desc")
      .get();

    return {
      student: { id: studentDoc.id, ...studentDoc.data() },
      assessments: assessmentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
      insights: insightsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
      action_plans: actionPlansSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
    };
  },
);
```

### Step 5: Update Frontend to Use Cloud Functions

**File**: `frontend/src/lib/firebase-functions.ts`

```typescript
import { getFunctions, httpsCallable } from "firebase/auth";
import app from "./firebase";

const functions = getFunctions(app);

// Create Student
export const createStudent = async (data: {
  name: string;
  grade_level: string;
  school_type?: string;
}) => {
  const createStudentFn = httpsCallable(functions, "createStudent");
  const result = await createStudentFn(data);
  return result.data;
};

// Submit Assessment
export const submitAssessment = async (data: {
  student_id: string;
  assessment_type: string;
  assessment_data: Record<string, any>;
}) => {
  const submitAssessmentFn = httpsCallable(functions, "submitAssessment");
  const result = await submitAssessmentFn(data);
  return result.data;
};

// Get Student Dashboard
export const getStudentDashboard = async (studentId: string) => {
  const getDashboardFn = httpsCallable(functions, "getStudentDashboard");
  const result = await getDashboardFn({ student_id: studentId });
  return result.data;
};
```

### Step 6: Set Up Firestore Security Rules

**File**: `firestore.rules`

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can only read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Students - parents can only access their own students
    match /students/{studentId} {
      allow read: if request.auth != null &&
                     resource.data.parent_id == request.auth.uid;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
                               resource.data.parent_id == request.auth.uid;
    }

    // Assessments - tied to student ownership
    match /assessments/{assessmentId} {
      allow read: if request.auth != null &&
                     get(/databases/$(database)/documents/students/$(resource.data.student_id)).data.parent_id == request.auth.uid;
      allow create: if request.auth != null;
    }

    // Insights - tied to student ownership
    match /insights/{insightId} {
      allow read, update: if request.auth != null &&
                             get(/databases/$(database)/documents/students/$(resource.data.student_id)).data.parent_id == request.auth.uid;
    }

    // Action Plans - tied to student ownership
    match /action_plans/{planId} {
      allow read, update: if request.auth != null &&
                             get(/databases/$(database)/documents/students/$(resource.data.student_id)).data.parent_id == request.auth.uid;
    }
  }
}
```

### Step 7: Deploy Cloud Functions

```bash
cd backend/functions
npm run build
firebase deploy --only functions
```

---

## Cost Comparison

### Firebase-Only (Estimated Monthly Cost)

**Free Tier Includes:**

- 50,000 reads/day
- 20,000 writes/day
- 20,000 deletes/day
- 125,000 Cloud Function invocations
- 1 GB storage
- 10 GB/month bandwidth

**For 100 active users:**

- Firestore: ~$5-10/month
- Cloud Functions: ~$5/month
- Authentication: Free
- **Total: ~$10-15/month**

### Separate Backend (Current)

- Railway/Render: $5-20/month
- PostgreSQL: $5-15/month (or included)
- Firebase Auth: Free
- **Total: ~$10-35/month**

---

## Migration Checklist

- [ ] Enable Firestore in Firebase Console
- [ ] Install Firebase CLI
- [ ] Initialize Cloud Functions
- [ ] Migrate database schema to Firestore
- [ ] Rewrite API endpoints as Cloud Functions
- [ ] Update frontend to use Cloud Functions
- [ ] Set up Firestore security rules
- [ ] Test all functionality
- [ ] Deploy Cloud Functions
- [ ] Update environment variables
- [ ] Remove old backend deployment

---

## Recommendation

**For MVP/Early Stage**: Use Firebase-only architecture

- Faster to deploy
- Lower cost
- Easier to manage
- Good enough for 1000s of users

**For Scale/Complex AI**: Keep separate backend

- More control
- Better for heavy AI processing
- Easier Python integration
- Can always migrate later

---

## Next Steps

1. **Try Firebase-only first** - It's simpler and cheaper
2. **If you need heavy AI processing** - Keep the FastAPI backend
3. **Hybrid approach** - Use Firebase for data, Cloud Functions for simple logic, and call external API for AI

Would you like me to help you implement the Firebase-only solution?
