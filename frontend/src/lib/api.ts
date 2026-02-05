import { db, functions } from "./firebase";
import { collection, addDoc, doc, getDoc, updateDoc, setDoc, query, where, getDocs, Timestamp } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
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
  console.log(`Triggering Neural Analysis for student ${studentId}...`);
  
  const triggerNeuralAnalysis = httpsCallable(functions, 'triggerNeuralAnalysis');
  
  try {
    const result = await triggerNeuralAnalysis({ studentId });
    const data = result.data as { status: string, message: string };
    return data;
  } catch (error) {
    console.error("Analysis Trigger Failed:", error);
    throw new Error("Failed to trigger neural analysis protocol.");
  }
}
