const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const { createRemoteJWKSet, jwtVerify } = require('jose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID;

// Auth token verification keys
const JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'));

// Dynamic CORS configuration
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

// Load scientific foundations
const scientificRefsPath = path.join(__dirname, "scientific_references.json");
let scientificRefs = {};
try {
    if (fs.existsSync(scientificRefsPath)) {
        scientificRefs = JSON.parse(fs.readFileSync(scientificRefsPath, "utf8"));
    }
} catch (error) {
    console.error("Failed to load scientific references:", error);
}

// OpenAI Client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/**
 * Keyless Verification Middleware
 * Authenticates users via Google public keys
 */
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthenticated' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    try {
        const { payload } = await jwtVerify(idToken, JWKS, {
            issuer: `https://securetoken.google.com/${PROJECT_ID}`,
            audience: PROJECT_ID,
        });
        req.user = payload;
        req.idToken = idToken; 
        next();
    } catch (error) {
        console.error('Auth Error:', error.message);
        res.status(401).json({ error: 'Invalid security protocol' });
    }
};

/**
 * Helper: Firestore REST API Integration
 */
async function firestoreREST(method, path, data = null, idToken) {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${path}`;
    const options = {
        method,
        headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
        }
    };
    if (data) options.body = JSON.stringify(data);
    
    const response = await fetch(url, options);
    const result = await response.json();
    if (!response.ok) {
        console.error(`Firestore Error [${method} ${path}]:`, result);
        throw new Error(result.error?.message || 'Firestore Protocol Failure');
    }
    return result;
}

/**
 * Utility: Flatten Firestore REST response to clean JSON
 */
function fromFirestore(doc) {
    if (!doc.fields) return doc;
    const obj = { id: doc.name?.split('/').pop() };
    for (const [key, value] of Object.entries(doc.fields)) {
        if (value.stringValue !== undefined) obj[key] = value.stringValue;
        else if (value.integerValue !== undefined) obj[key] = parseInt(value.integerValue);
        else if (value.doubleValue !== undefined) obj[key] = parseFloat(value.doubleValue);
        else if (value.booleanValue !== undefined) obj[key] = value.booleanValue;
        else if (value.mapValue !== undefined) obj[key] = fromFirestore(value.mapValue);
        else if (value.arrayValue !== undefined) obj[key] = (value.arrayValue.values || []).map(v => {
            if (typeof v === 'object' && v !== null) {
                return Object.values(v)[0];
            }
            return v;
        });
        else if (value.timestampValue !== undefined) obj[key] = value.timestampValue;
    }
    return obj;
}

app.get('/', (req, res) => res.json({ status: "Neural API Active", mode: "Live Production" }));

/**
 * Trigger Neural Analysis Protocol
 * Creates fresh analysis based on assessment data
 */
app.post('/api/triggerNeuralAnalysis', authenticate, async (req, res) => {
    const { studentId } = req.body;
    const userId = req.user.user_id || req.user.sub || req.user.uid;

    if (!studentId) return res.status(400).json({ error: "Student ID required" });

    try {
        // 1. Fetch Student and Verify Ownership
        const studentRaw = await firestoreREST('GET', `students/${studentId}`, null, req.idToken);
        const student = fromFirestore(studentRaw);

        // STRICT OWNERSHIP CHECK
        const ownerId = student.parent_id || student.userId || student.owner_id;
        if (!ownerId || ownerId.trim() !== userId.trim()) {
            return res.status(403).json({ error: 'Permission Denied: Identity Misalignment' });
        }

        // 2. Fetch Latest Assessment Data
        const queryUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`;
        const qRes = await fetch(queryUrl, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${req.idToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                structuredQuery: {
                    from: [{ collectionId: 'assessments' }],
                    where: { 
                        fieldFilter: { 
                            field: { fieldPath: 'student_id' }, 
                            op: 'EQUAL', 
                            value: { stringValue: studentId } 
                        } 
                    },
                    limit: 1
                }
            })
        });

        const qData = await qRes.json();
        const latestDoc = Array.isArray(qData) && qData[0]?.document ? qData[0].document : null;
        
        if (!latestDoc) {
            return res.status(400).json({ error: "No synthesis telemetry found. Please complete an assessment first." });
        }
        
        const assessment = fromFirestore(latestDoc);
        const assessmentPath = latestDoc.name.split('/documents/')[1];

        // 3. Neural Synthesis (OpenAI Logic)
        const prompt = `
            You are Mentiscope's Neural Synthesis Engine.
            Synthesize a fresh, detailed growth analysis based on this live telemetry.
            
            STUDENT PROFILE: ${JSON.stringify(student)}
            LATEST ASSESSMENT DATA: ${JSON.stringify(assessment.data)}
            SCIENTIFIC FOUNDATIONS: ${JSON.stringify(scientificRefs)}
            
            Return a JSON object exactly matching the dashboard schema, providing deep insights into:
            - overall growth trajectory
            - perception gaps between parent and student (if available in assessment data)
            - dimension-specific scores (8 domains)
            - actionable leverage points and support areas
            - communication guidance for the parent
            
            Ensure the tone is scientific yet supportive.
        `;

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a professional educational psychologist. Return strictly valid JSON." },
                { role: "user", content: prompt }
            ],
            model: "gpt-4-turbo-preview",
            response_format: { type: "json_object" },
            temperature: 0.7
        });

        const analysisResults = JSON.parse(completion.choices[0].message.content);

        // 4. Update Database via PATCH
        await firestoreREST('PATCH', assessmentPath, {
            fields: {
                ...latestDoc.fields,
                analysis_results: { stringValue: JSON.stringify(analysisResults) },
                status: { stringValue: 'analyzed' },
                analyzed_at: { timestampValue: new Date().toISOString() }
            }
        }, req.idToken);

        res.json({ 
            status: "success", 
            message: "Neural Analysis Synthesis Complete",
            data: analysisResults 
        });

    } catch (error) {
        console.error("Neural Failure:", error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Public Support Uplink
 */
app.post('/api/support', async (req, res) => {
    const { product, category, message, user_email } = req.body;
    try {
        const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/support_requests`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fields: {
                    product: { stringValue: product || "Mentiscope" },
                    category: { stringValue: category || "General" },
                    message: { stringValue: message },
                    user_email: { stringValue: user_email },
                    created_at: { timestampValue: new Date().toISOString() }
                }
            })
        });
        res.json({ status: "success", message: "Support ticket generated." });
    } catch (error) {
        console.error("Support Error:", error.message);
        res.status(500).json({ error: "Failed to route support ticket." });
    }
});

app.listen(PORT, () => console.log(`Live Neural API active on ${PORT}`));
