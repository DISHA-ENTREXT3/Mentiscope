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

const JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'));

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

const scientificRefsPath = path.join(__dirname, "scientific_references.json");
let scientificRefs = {};
try {
    scientificRefs = JSON.parse(fs.readFileSync(scientificRefsPath, "utf8"));
} catch (error) {
    console.error("Failed to load scientific references:", error);
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

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
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Firestore Protocol Failure');
    }
    return await response.json();
}

function fromFirestore(doc) {
    if (!doc.fields) return doc;
    const obj = { id: doc.name?.split('/').pop() };
    for (const [key, value] of Object.entries(doc.fields)) {
        if (value.stringValue !== undefined) obj[key] = value.stringValue;
        else if (value.integerValue !== undefined) obj[key] = parseInt(value.integerValue);
        else if (value.doubleValue !== undefined) obj[key] = parseFloat(value.doubleValue);
        else if (value.booleanValue !== undefined) obj[key] = value.booleanValue;
        else if (value.mapValue !== undefined) obj[key] = fromFirestore(value.mapValue);
        else if (value.arrayValue !== undefined) obj[key] = (value.arrayValue.values || []).map(v => Object.values(v)[0]);
        else if (value.timestampValue !== undefined) obj[key] = value.timestampValue;
    }
    return obj;
}

app.get('/', (req, res) => res.json({ status: "Neural API Active", mode: "Compliance-Safe Proxy" }));

app.post('/api/triggerNeuralAnalysis', authenticate, async (req, res) => {
    const { studentId } = req.body;
    // Extract UID from multiple possible fields in keyless payload
    const userId = req.user.user_id || req.user.sub || req.user.uid;

    if (!studentId) return res.status(400).json({ error: "Missing identity" });

    try {
        const studentRaw = await firestoreREST('GET', `students/${studentId}`, null, req.idToken);
        const student = fromFirestore(studentRaw);

        const ownerId = student.parent_id || student.userId || student.owner_id;
        
        // HEARTBEAT LOGGING
        console.log(`[NEURAL HEARTBEAT] Request for Student: ${studentId}`);
        console.log(`[NEURAL HEARTBEAT] Document Owner: ${ownerId}`);
        console.log(`[NEURAL HEARTBEAT] Requesting User: ${userId}`);

        if (ownerId && ownerId.trim() !== userId.trim()) {
            return res.status(403).json({ error: 'Permission Denied: Hierarchy Misalignment' });
        }

        const queryUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`;
        const qRes = await fetch(queryUrl, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${req.idToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                structuredQuery: {
                    from: [{ collectionId: 'assessments' }],
                    where: { fieldFilter: { field: { fieldPath: 'student_id' }, op: 'EQUAL', value: { stringValue: studentId } } },
                    orderBy: [{ field: { fieldPath: 'created_at' }, direction: 'DESCENDING' }],
                    limit: 1
                }
            })
        });

        const qData = await qRes.json();
        const latestDoc = qData[0]?.document;
        if (!latestDoc) return res.status(400).json({ error: "No synthesis telemetry found." });
        
        const assessment = fromFirestore(latestDoc);
        const assessmentPath = latestDoc.name.split('/documents/')[1];

        const prompt = `Synthesize JSON growth map for ${student.name}. Data: ${JSON.stringify(assessment.data)}. Use refs: ${JSON.stringify(scientificRefs)}.`;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "Educational Psychologist logic. Valid JSON only." }, { role: "user", content: prompt }],
            model: "gpt-4-turbo-preview",
            response_format: { type: "json_object" },
        });

        const results = JSON.parse(completion.choices[0].message.content);

        await firestoreREST('PATCH', assessmentPath, {
            fields: {
                ...latestDoc.fields,
                analysis_results: { stringValue: JSON.stringify(results) },
                status: { stringValue: 'analyzed' },
                analyzed_at: { timestampValue: new Date().toISOString() }
            }
        }, req.idToken);

        res.json({ status: "success", data: results });

    } catch (error) {
        console.error("Neural Failure:", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`Neural Intel Backend active on ${PORT}`));
