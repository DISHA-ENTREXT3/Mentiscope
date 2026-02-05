const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID;

// Initialize Firebase Admin for AUTH ONLY (No key needed for verification!)
if (!admin.apps.length) {
    admin.initializeApp({
        projectId: PROJECT_ID
    });
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Load scientific references
const scientificRefsPath = path.join(__dirname, "scientific_references.json");
let scientificRefs = {};
try {
    scientificRefs = JSON.parse(fs.readFileSync(scientificRefsPath, "utf8"));
} catch (error) {
    console.error("Failed to load scientific references:", error);
}

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:3000', 'https://mentiscope.vercel.app'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Helper for Firestore REST API (Works as the logged-in user!)
async function firestoreREST(method, documentPath, data, idToken) {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${documentPath}`;
    
    // Convert regular JSON to Firestore's "Weighted" REST format for certain fields
    // This is a simplified version for our specific needs
    const body = data ? JSON.stringify({
        fields: Object.entries(data).reduce((acc, [key, val]) => {
            if (typeof val === 'string') acc[key] = { stringValue: val };
            else if (typeof val === 'number') acc[key] = { doubleValue: val };
            else if (typeof val === 'boolean') acc[key] = { booleanValue: val };
            else if (typeof val === 'object') acc[key] = { stringValue: JSON.stringify(val) }; // Store complex as string for simplicity
            return acc;
        }, {})
    }) : null;

    const res = await fetch(url, {
        method,
        headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
        },
        body
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || 'Firestore API Error');
    }
    return await res.json();
}

app.get('/', (req, res) => res.json({ status: "Neural API Live", mode: "Organization-Safe" }));

app.post('/api/triggerNeuralAnalysis', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthenticated' });
    
    const idToken = authHeader.split('Bearer ')[1];
    const { studentId } = req.body;

    try {
        // 1. Verify user identity
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const userId = decodedToken.uid;

        // 2. Fetch Data via REST API (Inherits user permissions!)
        const studentRaw = await firestoreREST('GET', `students/${studentId}`, null, idToken);
        
        // Simple extraction
        const student = {
            name: studentRaw.fields.name?.stringValue,
            grade_level: studentRaw.fields.grade_level?.stringValue,
            parent_id: studentRaw.fields.parent_id?.stringValue
        };

        if (student.parent_id !== userId) return res.status(403).json({ error: 'Permission Denied' });

        // 3. OpenAI Synthesis
        const prompt = `Student: ${student.name}, Grade: ${student.grade_level}. Analyze progress. Return JSON.`;
        
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4-turbo-preview",
            response_format: { type: "json_object" },
        });

        const analysisResults = JSON.parse(completion.choices[0].message.content);

        // 4. Update Database
        // Note: For REST PATCH to work, we point to the assessments sub-collection
        // For this demo, let's assume we update a flag on the student or similar
        // if you have a specific assessmentId, replace it here.
        
        res.json({ status: "success", data: analysisResults });

    } catch (error) {
        console.error("Neural Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`Secure Backend running on ${PORT}`));
