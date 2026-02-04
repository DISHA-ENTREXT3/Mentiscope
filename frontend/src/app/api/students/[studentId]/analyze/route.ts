import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import OpenAI from "openai";
import { QueryDocumentSnapshot, DocumentData } from "firebase-admin/firestore";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://mentiscope.vercel.app",
    "X-Title": "Mentiscope",
  }
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const { studentId } = await params;

    // 1. Fetch student and latest assessment
    const studentDoc = await db.collection("students").doc(studentId).get();
    if (!studentDoc.exists) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    const student = studentDoc.data();

    const assessmentsSnapshot = await db
      .collection("assessments")
      .where("student_id", "==", studentId)
      .orderBy("created_at", "desc")
      .limit(1)
      .get();

    if (assessmentsSnapshot.empty) {
      return NextResponse.json({ error: "No assessments found" }, { status: 404 });
    }
    const assessmentDoc = assessmentsSnapshot.docs[0];
    const assessment = assessmentDoc.data();

    // 2. Fetch historical context
    const historySnapshot = await db
      .collection("assessments")
      .where("student_id", "==", studentId)
      .orderBy("created_at", "desc")
      .limit(4)
      .get();
    
    const history = historySnapshot.docs
      .filter((doc: QueryDocumentSnapshot<DocumentData>) => doc.id !== assessmentDoc.id)
      .map((doc: QueryDocumentSnapshot<DocumentData>) => doc.data().data);

    // 3. Prepare Prompt
    const prompt = `
    You are an expert Child Development Scientist and Neural Readiness Architect.
    
    ### CORE MISSION:
    Analyze the provided holistic development data across 9 core dimensions to provide a comprehensive growth mapping for the student.
    
    ### THE 9 DIMENSIONS:
    1. Cognitive Development
    2. Academic Progress
    3. Academic Intelligence (Learning Strategies, Study Skills, Academic Mindset, Metacognition)
    4. Neural & Physiological Health
    5. Emotional Regulation
    6. Motivation & Agency
    7. Social & Communication Skills
    8. Empathy & Character
    9. Life Skills & Independence

    ### PHILOSOPHY:
    - **No Labels**: Do not diagnose or label. Use descriptive behavioral patterns.
    - **Clarity & Reassurance**: Use supportive, explainable, and practical language.
    - **Early Signals**: Focus on patterns and trends rather than snapshots.
    - **Age-Appropriate**: Tailor insights and actions to the student's grade level (1-12).

    ### STUDENT CONTEXT:
    - Name: ${student?.name}
    - Grade: ${student?.grade_level}
    
    ### DATA SPECTRUM:
    - Current Assessment: ${JSON.stringify(assessment.data, null, 2)}
    - Historical Context: ${JSON.stringify(history, null, 2)}
    
    ### PROMPT ARCHITECTURE:
    1. **Overall Growth Analysis**: Analyze inputs across 9 dimensions. Focus on patterns.
    2. **Academic Intelligence Deep Dive**: Assess learning strategies, study habits, academic mindset, and metacognition.
    3. **Perception Gap (Synergy Analysis)**: Compare Parent and Student responses. Identify "Blind Spots".
    4. **Risk Signal Detection**: Identify early risk signals ONLY if multiple indicators align.
    5. **Personalized Action Map**: specific, achievable, time-bound. Calm language.
    6. **Predictive Growth Trajectory**: Forecast growth if the action plan is followed.
    7. **Parent Communication Guidance**: Support tone and rhythms.
    8. **Explainability Layer**: For each major insight.
    9. **Dashboard Summary**: Under 120 words. Focus on clarity and reassurance.

    ### JSON OUTPUT FORMAT:
    {
      "readiness_score": int,
      "confidence_level": int,
      "synergy_score": int,
      "dashboard_summary": "string",
      "overall_growth_summary": "string",
      "perception_gap": {
        "gap_score": int,
        "misalignment": "string",
        "synergy_tip": "string"
      },
      "academic_intelligence": {
        "score": int (0-100),
        "learning_style": "Visual" | "Auditory" | "Kinesthetic" | "Mixed",
        "study_effectiveness": "High" | "Moderate" | "Needs Improvement",
        "growth_mindset_level": "Strong" | "Developing" | "Fixed",
        "recommendations": ["string"]
      },
      "trajectory": {
        "current": int,
        "projected_30d": int,
        "projected_90d": int,
        "growth_driver": "string"
      },
      "dimensions": [
        {
          "name": "string",
          "status": "Strong" | "Developing" | "Needs Support",
          "trend": "up" | "down" | "stable",
          "score": int (0-100)
        }
      ],
      "strengths": [
        { "title": "string", "explanation": "string" }
      ],
      "support_areas": [
        { "title": "string", "explanation": "string" }
      ],
      "risks": [
        {
          "name": "string",
          "observations": "string",
          "why_it_matters": "string",
          "urgency": "Low" | "Watch" | "Focus"
        }
      ],
      "action_plan": {
        "student_actions": [{ "task": "string", "type": "Immediate" | "Habit" }],
        "parent_actions": [{ "task": "string", "type": "Immediate" | "Habit" }],
        "environment_adjustments": ["string"]
      },
      "communication_guidance": {
        "to_encourage": ["string"],
        "to_avoid": ["string"],
        "frequency": "string",
        "recommended_tone": "string"
      },
      "explainability": [
        {
          "insight": "string",
          "observation": "string",
          "inputs_matters": ["string"],
          "why_it_matters": "string",
          "expected_impact": "string"
        }
      ]
    }
    `;

    // 4. Call OpenAI
    const response = await client.chat.completions.create({
        model: "google/gemini-2.0-flash-exp:free",
        messages: [
            { role: "system", content: "You are a Neural Architect assistant. Output JSON only." },
            { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(response.choices[0].message.content || "{}");

    // 5. Save Results
    await assessmentDoc.ref.update({ analysis_results: analysis });
    await studentDoc.ref.update({ readiness_score: analysis.readiness_score || student?.readiness_score });

    // Save Insights
    const batch = db.batch();
    
    // Summary
    const summaryRef = db.collection("insights").doc();
    batch.set(summaryRef, {
      student_id: studentId,
      assessment_id: assessmentDoc.id,
      type: "trend",
      title: "Dashboard Summary",
      observation: "Integrated whole-child mapping.",
      interpretation: analysis.dashboard_summary || "",
      confidence_score: 95,
      created_at: new Date().toISOString()
    });

    // Strengths
    analysis.strengths?.forEach((s: { title: string; explanation: string }) => {
      const ref = db.collection("insights").doc();
      batch.set(ref, {
        student_id: studentId,
        assessment_id: assessmentDoc.id,
        type: "strength",
        title: s.title,
        observation: "Area of core proficiency.",
        interpretation: s.explanation,
        confidence_score: 90,
        created_at: new Date().toISOString()
      });
    });

    // Risks
    analysis.risks?.forEach((r: { name: string; observations: string; why_it_matters: string; urgency: string }) => {
      const ref = db.collection("insights").doc();
      batch.set(ref, {
        student_id: studentId,
        assessment_id: assessmentDoc.id,
        type: "risk",
        title: r.name,
        observation: r.observations,
        interpretation: `${r.why_it_matters} (Urgency: ${r.urgency})`,
        confidence_score: 85,
        created_at: new Date().toISOString()
      });
    });

    // Action Items
    analysis.action_plan?.student_actions?.forEach((act: { task?: string } | string) => {
      const ref = db.collection("action_plans").doc();
      const description = typeof act === 'string' ? act : (act.task || "No description");
      batch.set(ref, {
        student_id: studentId,
        title: "Student Action",
        description,
        role_target: "student",
        status: "pending",
        created_at: new Date().toISOString()
      });
    });

    analysis.action_plan?.parent_actions?.forEach((act: { task?: string } | string) => {
      const ref = db.collection("action_plans").doc();
      const description = typeof act === 'string' ? act : (act.task || "No description");
      batch.set(ref, {
        student_id: studentId,
        title: "Parent Action",
        description,
        role_target: "parent",
        status: "pending",
        created_at: new Date().toISOString()
      });
    });

    analysis.action_plan?.environment_adjustments?.forEach((act: { task?: string } | string) => {
      const ref = db.collection("action_plans").doc();
      const description = typeof act === 'string' ? act : (act.task || "No description");
      batch.set(ref, {
        student_id: studentId,
        title: "Environment Adjustment",
        description,
        role_target: "parent",
        status: "pending",
        created_at: new Date().toISOString()
      });
    });

    await batch.commit();

    return NextResponse.json({ status: "success", message: "Neural analysis complete" });
  } catch (error) {
    console.error("Error in AI analysis:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
