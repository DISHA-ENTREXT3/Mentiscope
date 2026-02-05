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

export async function getStudentDashboard(studentId: string): Promise<Student> {
  const docRef = doc(db, "students", studentId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error("Student not found");
  }

  return { id: docSnap.id, ...docSnap.data() } as unknown as Student;
}

export async function triggerAnalysis(studentId: string): Promise<{ status: string, message: string }> {
  // In a real app, this would trigger a Cloud Function
  console.log(`Simulating AI analysis for student ${studentId}`);
  
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return { status: "success", message: "Analysis scheduled" };
}
