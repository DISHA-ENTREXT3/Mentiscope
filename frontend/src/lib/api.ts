import { db } from "./firebase";
import { collection, addDoc, doc, getDoc, updateDoc, setDoc, query, where, getDocs, Timestamp } from "firebase/firestore";
import { Student } from "@/types";

export async function createStudent(data: { name: string, grade_level: string, parent_id: string, school_type?: string }): Promise<Student> {
  const studentsRef = collection(db, "students");
  const docRef = await addDoc(studentsRef, {
    ...data,
    created_at: Timestamp.now()
  });
  
  return {
    id: docRef.id,
    ...data,
    created_at: new Date().toISOString()
  } as unknown as Student;
}

export async function submitAssessment(studentId: string, type: string, data: Record<string, unknown>) {
  const assessmentsRef = collection(db, "assessments");
  const docRef = await addDoc(assessmentsRef, {
    student_id: studentId,
    type,
    data,
    created_at: Timestamp.now()
  });
  
  return {
    id: docRef.id,
    success: true
  };
}

export async function createCheckoutSession(userId: string) {
  // For now, return a dummy link or mock functionality as Stripe requires backend
  console.log("Stripe integration requires a backend function. Skipping for Firebase-only client.");
  return { url: "#" };
}

const MOCK_ANALYSIS_RESULTS = {
  dashboard_summary: "Baseline established. High potential in creative problem solving detected.",
  overall_growth_summary: "Student shows strong aptitude for abstract thinking but requires structural support in routine management.",
  confidence_level: 85,
  perception_gap: {
    gap_score: 12,
    misalignment: "Parent perceives higher anxiety than student reports.",
    synergy_tip: "Focus on celebrating small wins to build shared confidence."
  },
  trajectory: {
    current: 72,
    projected_30d: 78,
    projected_90d: 85,
    growth_driver: "Structural Consistency"
  },
  dimensions: [
    { name: "Academic Focus", status: "Developing", trend: "up", score: 65 },
    { name: "Emotional Resilience", status: "Strong", trend: "stable", score: 82 },
    { name: "Social Connection", status: "Strong", trend: "up", score: 88 },
    { name: "Routine & Habits", status: "Needs Support", trend: "down", score: 45 }
  ],
  strengths: [
    { title: "Creative Thinking", explanation: "Shows ability to connect unrelated concepts." },
    { title: "Empathy", explanation: "Highly attuned to peer emotions." }
  ],
  support_areas: [
    { title: "Time Management", explanation: "Struggles with estimating task duration." },
    { title: "Task Initiation", explanation: "Hesitation observed when starting new complex tasks." }
  ],
  risks: [
    { name: "Avoidance Patterning", observations: "Procrastination on diffcult tasks.", why_it_matters: "Can lead to compound stress.", urgency: "Watch" }
  ],
  action_plan: {
    student_actions: [
      { task: "Use the '5-minute rule' for starting homework.", type: "Immediate" },
      { task: "Prepare school bag the night before.", type: "Habit" }
    ],
    parent_actions: [ 
      { task: "Model 'loud planning' of your own day.", type: "Habit" },
      { task: "Create a visual checklist for morning routine.", type: "Immediate" }
    ],
    environment_adjustments: ["Remove phone from room during study hours.", "Use warm lighting for reading."]
  },
  communication_guidance: {
    recommended_tone: "Collaborative & inquisitive",
    to_encourage: ["Effort over outcome", "Specific strategies used"],
    to_avoid: ["Character-based praise", "Direct commands without context"],
    frequency: "Weekly Sunday check-in"
  },
  explainability: [
    { 
      insight: "Routine struggles correlate with anxiety.", 
      inputs_matter: ["Parent Survey", "Student Self-Report"], 
      observation: "High anxiety scores match low routine completion.", 
      why_it_matters: "Anxiety is likely the blocker, not laziness.", 
      expected_impact: "Reducing anxiety will naturally improve routine adherence." 
    }
  ]
};

export async function getStudentDashboard(studentId: string): Promise<Student> {
  const studentRef = doc(db, "students", studentId);
  const studentSnap = await getDoc(studentRef);

  if (!studentSnap.exists()) {
    throw new Error("Student not found");
  }

  const studentData = { id: studentSnap.id, ...studentSnap.data() } as Student;
  
  // Fetch latest assessment
  const assessmentsQuery = query(
    collection(db, "assessments"), 
    where("student_id", "==", studentId)
  );
  
  const assessmentDocs = await getDocs(assessmentsQuery);
  const assessments = assessmentDocs.docs.map(d => ({ id: d.id, ...d.data() }));

  // Attach assessments to student object manually since Firestore is NoSQL
  return { ...studentData, assessments } as unknown as Student;
}

export async function triggerAnalysis(studentId: string): Promise<{ status: string, message: string }> {
  console.log(`Analyzing student ${studentId}...`);
  
  // 1. Find the latest assessment for this student
  const assessmentsQuery = query(
    collection(db, "assessments"), 
    where("student_id", "==", studentId)
  );
  const snapshot = await getDocs(assessmentsQuery);
  
  if (snapshot.empty) {
    throw new Error("No assessments found to analyze");
  }

  // 2. Pick the first assessment found (simplified for MVP)
  const assessmentDoc = snapshot.docs[0];
  
  // 3. Simulate "Analysis" by writing the Mock Results to this assessment document
  const assessmentRef = doc(db, "assessments", assessmentDoc.id);
  await updateDoc(assessmentRef, {
    analysis_results: MOCK_ANALYSIS_RESULTS,
    analyzed_at: Timestamp.now()
  });

  return { status: "success", message: "Analysis complete. Data updated." };
}
