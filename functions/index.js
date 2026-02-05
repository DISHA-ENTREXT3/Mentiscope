const functions = require("firebase-functions");
const admin = require("firebase-admin");
const OpenAI = require("openai");

admin.initializeApp();
const db = admin.firestore();

// Initialize OpenAI client
// Note: We access the key via Firebase config functions.config().openai.key
// Deployment command: firebase functions:config:set openai.key="YOUR_KEY"
const getOpenAIClient = () => {
    const apiKey = process.env.OPENAI_API_KEY || functions.config().openai?.key;
    if (!apiKey) {
        throw new functions.https.HttpsError('failed-precondition', 'OpenAI API key not configured.');
    }
    return new OpenAI({ apiKey });
};

exports.triggerNeuralAnalysis = functions.https.onCall(async (data, context) => {
    // 1. Authentication Check
    // if (!context.auth) {
    //     throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    // }
    
    const { studentId, assessmentId } = data;
    
    if (!studentId) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a "studentId".');
    }

    try {
        // 2. Fetch Student Data
        const studentRef = db.collection('students').doc(studentId);
        const studentSnap = await studentRef.get();
        if (!studentSnap.exists) {
            throw new functions.https.HttpsError('not-found', 'Student not found.');
        }
        const studentData = studentSnap.data();

        // 3. Fetch Assessment Data (Latest or Specific)
        let assessmentRef;
        let assessmentData;

        if (assessmentId) {
            assessmentRef = db.collection('assessments').doc(assessmentId);
            const assessmentSnap = await assessmentRef.get();
            if (!assessmentSnap.exists) throw new functions.https.HttpsError('not-found', 'Assessment not found.');
            assessmentData = assessmentSnap.data();
        } else {
            // Get latest
            const assessmentsQuery = await db.collection('assessments')
                .where('student_id', '==', studentId)
                .orderBy('created_at', 'desc')
                .limit(1)
                .get();
            
            if (assessmentsQuery.empty) {
                throw new functions.https.HttpsError('failed-precondition', 'No assessments found to analyze.');
            }
            assessmentRef = assessmentsQuery.docs[0].ref;
            assessmentData = assessmentsQuery.docs[0].data();
        }

        // 4. Construct Prompt for OpenAI
        const prompt = `
        You are Mentiscope's Neural Engine, an advanced AI for student growth analysis.
        
        Analyze the following student profile and assessment data to generate a "Whole-Child Growth Map".
        Return ONLY valid JSON matching the exact structure requested below. Do not include markdown formatting like \`\`\`json.
        
        Student Profile:
        - Name: ${studentData.name}
        - Grade: ${studentData.grade_level}
        - School Type: ${studentData.school_type || "Not specified"}
        
        Assessment Data:
        ${JSON.stringify(assessmentData.data)}
        
        REQUIRED JSON STRUCTURE:
        {
            "dashboard_summary": "A 1-sentence strategic high-level summary of the child's current state.",
            "overall_growth_summary": "A 2-sentence detailed explanation of their growth patterns and potential.",
            "confidence_level": 85 (integer 0-100 indicating analysis confidence),
            "perception_gap": {
                "gap_score": 15 (integer 0-100),
                "misalignment": "Brief description of where parent and student views diverge.",
                "synergy_tip": "Specific advice to bridge this gap."
            },
            "trajectory": {
                "current": 75 (integer 0-100 general score),
                "projected_30d": 80,
                "projected_90d": 90,
                "growth_driver": "Key factor driving this growth (e.g. 'Routine Consistency')"
            },
            "dimensions": [
                { "name": "Academic Focus", "status": "Strong" | "Developing" | "Needs Support", "trend": "up" | "down" | "stable", "score": 75 },
                { "name": "Emotional Resilience", "status": "Strong" | "Developing" | "Needs Support", "trend": "up" | "down" | "stable", "score": 75 },
                { "name": "Social Connection", "status": "Strong" | "Developing" | "Needs Support", "trend": "up" | "down" | "stable", "score": 75 },
                { "name": "Routine & Habits", "status": "Strong" | "Developing" | "Needs Support", "trend": "up" | "down" | "stable", "score": 75 }
                // Include 4-6 relevant dimensions based on data
            ],
            "strengths": [
                { "title": "Strength Name", "explanation": "Why this is a strength." }
                // 2-3 items
            ],
            "support_areas": [
                { "title": "Area Name", "explanation": "Why this needs support." }
                // 2-3 items
            ],
            "risks": [
                { "name": "Risk Name", "observations": "What was seen.", "why_it_matters": "Implication.", "urgency": "Low" | "Watch" | "Focus" }
                // 0-2 items. If none, return empty array.
            ],
            "action_plan": {
                "student_actions": [
                    { "task": "Specific task", "type": "Immediate" | "Habit" }
                ],
                "parent_actions": [
                    { "task": "Specific task", "type": "Immediate" | "Habit" }
                ],
                "environment_adjustments": ["Suggestion 1", "Suggestion 2"]
            },
            "communication_guidance": {
                "recommended_tone": "e.g. 'Supportive but firm'",
                "to_encourage": ["Phrase 1", "Phrase 2"],
                "to_avoid": ["Phrase 1", "Phrase 2"],
                "frequency": "Recommended check-in frequency"
            },
            "explainability": [
                { 
                    "insight": "Core insight title", 
                    "inputs_matter": ["Data Point 1", "Data Point 2"], 
                    "observation": "What the AI saw.", 
                    "why_it_matters": "Why it is important.", 
                    "expected_impact": "Positive outcome if addressed." 
                }
            ]
        }
        `;

        // 5. Call OpenAI
        const openai = getOpenAIClient();
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4-turbo-preview", // Use a smart model for complex JSON
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        const analysisResult = JSON.parse(completion.choices[0].message.content);

        // 6. Save data back to Firestore
        await assessmentRef.update({
            analysis_results: analysisResult,
            analyzed_at: admin.firestore.FieldValue.serverTimestamp(),
            status: 'analyzed'
        });

        return { 
            status: "success", 
            message: "Neural Analysis Synthesis Complete.",
            data: analysisResult 
        };

    } catch (error) {
        console.error("Neural Analysis Failed:", error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});
