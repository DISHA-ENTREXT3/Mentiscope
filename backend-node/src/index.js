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

// Initialize Firebase Admin
const firebaseConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,
};

if (process.env.FIREBASE_SERVICE_ACCOUNT && process.env.FIREBASE_SERVICE_ACCOUNT.startsWith('{')) {
    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("Firebase Admin initialized with Service Account Key.");
    } catch (error) {
        console.error("Failed to parse Service Account JSON, falling back to default...");
        admin.initializeApp(firebaseConfig);
    }
} else {
    // If no key is allowed, initialize with Project ID
    // This will use Google Application Default Credentials or standard project access
    admin.initializeApp(firebaseConfig);
    console.log(`Firebase Admin initialized with Project ID: ${firebaseConfig.projectId}. (Note: Full admin bypass may be limited)`);
}

const db = admin.firestore();

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

// Load scientific references
const scientificRefsPath = path.join(__dirname, "scientific_references.json");
let scientificRefs = {};
try {
    scientificRefs = JSON.parse(fs.readFileSync(scientificRefsPath, "utf8"));
} catch (error) {
    console.error("Failed to load scientific references:", error);
}

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Auth Middleware
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthenticated' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying ID token:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.post('/api/triggerNeuralAnalysis', authenticate, async (req, res) => {
    const { studentId, assessmentId } = req.body;
    
    if (!studentId) {
        return res.status(400).json({ error: 'Missing studentId' });
    }

    try {
        // 2. Fetch Student Data
        const studentRef = db.collection('students').doc(studentId);
        const studentSnap = await studentRef.get();
        if (!studentSnap.exists) {
            return res.status(404).json({ error: 'Student not found' });
        }
        const studentData = studentSnap.data();

        // Security: Ensure user owns the student
        if (studentData.parent_id !== req.user.uid) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // 3. Fetch Assessment Data (Latest or Specific)
        let assessmentRef;
        let assessmentData;

        if (assessmentId) {
            assessmentRef = db.collection('assessments').doc(assessmentId);
            const assessmentSnap = await assessmentRef.get();
            if (!assessmentSnap.exists) return res.status(404).json({ error: 'Assessment not found' });
            assessmentData = assessmentSnap.data();
        } else {
            // Get latest
            const assessmentsQuery = await db.collection('assessments')
                .where('student_id', '==', studentId)
                .orderBy('created_at', 'desc')
                .limit(1)
                .get();
            
            if (assessmentsQuery.empty) {
                return res.status(400).json({ error: 'No assessments found to analyze.' });
            }
            assessmentRef = assessmentsQuery.docs[0].ref;
            assessmentData = assessmentsQuery.docs[0].data();
        }

        // 4. Construct Prompt for OpenAI
        const prompt = `
        You are Mentiscope's Neural Engine, an advanced AI for student growth analysis.
        
        Analyze the following student profile and assessment data to generate a "Whole-Child Growth Map".
        Your analysis must be grounded in the provided scientific research foundations.
        
        Return ONLY valid JSON matching the exact structure requested below. Do not include markdown formatting.
        
        Student Profile:
        - Name: ${studentData.name}
        - Grade: ${studentData.grade_level}
        - School Type: ${studentData.school_type || "Not specified"}
        
        Assessment Data:
        ${JSON.stringify(assessmentData.data)}
        
        Scientific Foundations available for reference:
        ${JSON.stringify(scientificRefs)}
        
        REQUIRED JSON STRUCTURE:
        {
            "dashboard_summary": "A 1-sentence strategic high-level summary of the child's current state.",
            "overall_growth_summary": "A 2-sentence detailed explanation of their growth patterns and potential.",
            "confidence_level": 85,
            "perception_gap": {
                "gap_score": 15,
                "misalignment": "Brief description of where parent and student views diverge.",
                "synergy_tip": "Specific advice to bridge this gap."
            },
            "trajectory": {
                "current": 75,
                "projected_30d": 80,
                "projected_90d": 90,
                "growth_driver": "Key factor driving this growth"
            },
            "dimensions": [
                { 
                    "name": "Academic Focus", 
                    "status": "Strong" | "Developing" | "Needs Support", 
                    "trend": "up" | "down" | "stable", 
                    "score": 75,
                    "scientific_backing": "Brief explanation of how this dimension choice is backed by the research provided (e.g. Pashler et al. 2008)."
                }
            ],
            "scientific_references": [
                { "title": "...", "authors": "...", "year": 2008, "relevance_to_child": "How this specific study applies to this student." }
            ],
            "strengths": [
                { "title": "Strength Name", "explanation": "Why this is a strength." }
            ],
            "support_areas": [
                { "title": "Area Name", "explanation": "Why this needs support." }
            ],
            "risks": [
                { "name": "Risk Name", "observations": "What was seen.", "why_it_matters": "Implication.", "urgency": "Low" | "Watch" | "Focus" }
            ],
            "action_plan": {
                "student_actions": [{ "task": "Specific task", "type": "Immediate" | "Habit" }],
                "parent_actions": [{ "task": "Specific task", "type": "Immediate" | "Habit" }],
                "environment_adjustments": ["Suggestion 1"]
            },
            "communication_guidance": {
                "recommended_tone": "e.g. 'Supportive but firm'",
                "to_encourage": ["Phrase 1"],
                "to_avoid": ["Phrase 1"],
                "frequency": "Recommended check-in frequency"
            },
            "explainability": [
                { 
                    "insight": "Core insight title", 
                    "observation": "What the AI saw.", 
                    "why_it_matters": "Why it is important.", 
                    "expected_impact": "Positive outcome if addressed." 
                }
            ]
        }
        `;

        // 5. Call OpenAI
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4-turbo-preview",
            response_format: { type: "json_object" },
            temperature: 0.5,
        });

        const analysisResult = JSON.parse(completion.choices[0].message.content);

        // 6. Save data back to Firestore
        await assessmentRef.update({
            analysis_results: analysisResult,
            analyzed_at: admin.firestore.FieldValue.serverTimestamp(),
            status: 'analyzed'
        });

        res.json({ 
            status: "success", 
            message: "Neural Analysis Synthesis Complete.",
            data: analysisResult 
        });

    } catch (error) {
        console.error("Neural Analysis Failed:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
