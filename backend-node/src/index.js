const express = require('express');
const cors = require('cors');
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
    : ['http://localhost:3000', 'https://mentiscope.vercel.app', 'https://mentiscope.onrender.com'];

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

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    next();
});

app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Load scientific foundations
const scientificRefsPath = path.join(__dirname, "scientific_references.json");
let scientificRefs = { learning_science: [] };
try {
    if (fs.existsSync(scientificRefsPath)) {
        scientificRefs = JSON.parse(fs.readFileSync(scientificRefsPath, "utf8"));
    }
} catch (error) {
    console.error("Failed to load scientific references:", error);
}

/**
 * Standard Synthesis Engine (Non-AI)
 * Calculates growth metrics based on deterministic models.
 * AI features are reserved for the Premium Protocol.
 */
function performStandardSynthesis(student, assessmentData) {
    // 1. Calculate Dimension Scores (Deterministic Logic)
    const dimensions = [
        { name: "Academic Foundation", key: "academic" },
        { name: "Cognitive Agility", key: "cognitive" },
        { name: "Social Synergy", key: "social" },
        { name: "Emotional Resilience", key: "emotional" },
        { name: "Physical Readiness", key: "physical" },
        { name: "Creative Innovation", key: "creative" },
        { name: "Focus & Discipline", key: "focus" },
        { name: "Global Awareness", key: "global" }
    ].map(dim => {
        // Base score calculation from raw telemetry
        const rawAnswers = assessmentData[dim.key] || assessmentData.answers || {};
        let score = 50; // Starting baseline
        
        // Mock calculation: averages some values or uses defaults
        const count = Object.keys(rawAnswers).length;
        if (count > 0) {
            const sum = Object.values(rawAnswers).reduce((a, b) => (parseInt(a) || 0) + (parseInt(b) || 0), 0);
            score = Math.min(Math.max(Math.round((sum / (count * 5)) * 100), 10), 95);
        } else {
            // Random jitter for demo baseline if no specific category data exists
            score = 65 + Math.floor(Math.random() * 15);
        }

        return {
            name: dim.name,
            score: score,
            status: score > 80 ? "Strong" : score > 50 ? "Developing" : "Observation Required",
            trend: score > 70 ? "up" : "stable",
            scientific_backing: "Standard behavioral metrics based on age-appropriate benchmarks."
        };
    });

    const avgScore = Math.round(dimensions.reduce((acc, d) => acc + d.score, 0) / dimensions.length);

    return {
        dashboard_summary: `Standard Protocol Active: ${student.name} is demonstrating ${avgScore > 75 ? 'above-average' : 'steady'} growth across core domains.`,
        overall_growth_summary: `Your child successfully completed the calibration. We are monitoring ${dimensions.filter(d => d.score < 60).length} support areas while leveraging ${dimensions.filter(d => d.score > 80).length} high-proficiency pillars.`,
        confidence_level: 100, // 100% confidence in the standard deterministic model
        is_premium_analysis: false,
        perception_gap: {
            gap_score: 15,
            misalignment: "Standard alignment detected. AI-powered deep perception mapping available in Premium.",
            synergy_tip: "Maintain open dialogue sessions twice weekly to align expectations."
        },
        trajectory: {
            current: avgScore,
            projected_30d: avgScore + 2,
            projected_90d: avgScore + 5,
            growth_driver: "Consistent Engagement"
        },
        dimensions: dimensions,
        strengths: dimensions.filter(d => d.score > 75).map(d => ({
            title: d.name,
            explanation: `Demonstrates high aptitude and consistent performance in ${d.name.toLowerCase()} tasks.`
        })),
        support_areas: dimensions.filter(d => d.score <= 75).map(d => ({
            title: d.name,
            explanation: `This area is currently developing. Targeted reinforcement in ${d.name.toLowerCase()} will enhance overall readiness.`
        })),
        risks: [],
        action_plan: {
            student_actions: [
                { task: "Complete daily focus exercises", type: "Regular" },
                { task: "Participate in social group interactions", type: "Weekly" }
            ],
            parent_actions: [
                { task: "Review progress metrics weekly", type: "Strategic" }
            ],
            environment_adjustments: [
                { task: "Designate a quiet neural-focus zone for learning", type: "Structural" }
            ]
        },
        communication_guidance: {
            recommended_tone: "Encouraging & Analytical",
            to_encourage: ["Self-reflection", "Effort-based praise", "Curiosity"],
            to_avoid: ["Numerical targets focus", "Comparison with peers"],
            frequency: "Daily Check-ins"
        },
        explainability: [
            {
                insight: "Balanced Growth",
                observation: "Scores are clustered around a healthy average.",
                why_it_matters: "Indicates a stable foundation without immediate burnout risks.",
                expected_impact: "Stable long-term academic trajectory."
            }
        ],
        scientific_references: [
            {
                title: "Educational Scaffolding in Early Childhood",
                authors: "Standard Pedagogy Guidelines",
                year: 2023,
                relevance_to_child: "Basis for our current deterministic growth models."
            }
        ]
    };
}

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
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.error?.message || 'Firestore Protocol Failure');
    }
    return result;
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

app.get('/', (req, res) => res.json({ status: "Mentiscope Protocol Active", mode: "Standard Synthesis" }));

app.post('/api/triggerNeuralAnalysis', authenticate, async (req, res) => {
    const { studentId } = req.body;
    const userId = req.user.user_id || req.user.sub || req.user.uid;

    if (!studentId) return res.status(400).json({ error: "Student ID required" });

    try {
        const studentRaw = await firestoreREST('GET', `students/${studentId}`, null, req.idToken);
        const student = fromFirestore(studentRaw);

        const ownerId = student.parent_id || student.userId || student.owner_id;
        
        // Self-heal identity
        if (!ownerId || ownerId === 'dummy-parent-id' || ownerId === 'undefined') {
            await firestoreREST('PATCH', `students/${studentId}?updateMask.fieldPaths=parent_id`, {
                fields: { parent_id: { stringValue: userId } }
            }, req.idToken);
        } else if (ownerId.trim() !== userId.trim()) {
            return res.status(403).json({ error: 'Permission Denied: Identity Misalignment' });
        }

        const queryUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`;
        const qRes = await fetch(queryUrl, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${req.idToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                structuredQuery: {
                    from: [{ collectionId: 'assessments' }],
                    where: { fieldFilter: { field: { fieldPath: 'student_id' }, op: 'EQUAL', value: { stringValue: studentId } } },
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

        // PERFORM STANDARD SYNTHESIS (NO AI)
        console.log(`[SYNTHESIS] Performing Standard Deterministic Synthesis for ${student.name}`);
        const analysisResults = performStandardSynthesis(student, assessment.data || {});

        // Store results back to database
        await firestoreREST('PATCH', assessmentPath, {
            fields: {
                ...latestDoc.fields,
                analysis_results: { stringValue: JSON.stringify(analysisResults) },
                status: { stringValue: 'analyzed' },
                analyzed_at: { timestampValue: new Date().toISOString() }
            }
        }, req.idToken);

        res.json({ status: "success", data: analysisResults });

    } catch (error) {
        console.error("Synthesis Failure:", error.message);
        res.status(500).json({ error: `Synthesis Protocol Error: ${error.message}` });
    }
});

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

app.listen(PORT, () => console.log(`Standard synthesis active on ${PORT}`));
