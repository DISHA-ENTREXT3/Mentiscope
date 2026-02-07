import { db, auth } from "./firebase";
import { collection, addDoc, doc, getDoc, query, where, getDocs, Timestamp, updateDoc } from "firebase/firestore";
import { Student } from "@/types";

export async function createStudent(data: { name: string, grade_level: string, parent_id: string, school_type?: string }): Promise<Student> {
  const response = await fetch("/api/students", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create student");
  }

  return await response.json();
}

export async function submitAssessment(studentId: string, type: string, data: Record<string, unknown>) {
  if (!db) {
    throw new Error("Firestore not initialized");
  }
  if (!auth) {
    throw new Error("Firebase not initialized");
  }
  
  const user = auth.currentUser;
  if (!user) {
    throw new Error("You must be logged in to submit assessment");
  }
  
  const assessmentsRef = collection(db, "assessments");
  
  const docRef = await addDoc(assessmentsRef, {
    student_id: studentId,
    parent_id: user.uid, // Use current user's UID
    type,
    data,
    created_at: Timestamp.now(),
    status: "submitted"
  });
  
  return {
    id: docRef.id,
    success: true
  };
}

export async function createCheckoutSession(productId: string, planName: string, price: string) {
  if (!auth) {
    throw new Error("Firebase not initialized");
  }
  const user = auth.currentUser;
  if (!user) {
    throw new Error("You must be logged in to commence checkout.");
  }

  const idToken = await user.getIdToken();
  
  try {
    const response = await fetch(`${API_URL}/api/payments/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({ productId, planName, price })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to initialize payment protocol.");
    }

    const data = await response.json();
    return data; // Should contain { url: '...' }
  } catch (error: unknown) {
    console.error("Payment Initialization Failed:", error);
    const message = error instanceof Error ? error.message : "Failed to initialize payment protocol.";
    throw new Error(message);
  }
}

export async function getStudentDashboard(studentId: string): Promise<Student> {
  if (!db) {
    throw new Error("Firestore not initialized");
  }
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

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL;
const API_URL = rawApiUrl?.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;

if (!API_URL && process.env.NODE_ENV === 'production') {
  console.error("NEXT_PUBLIC_API_URL is not defined in production environment.");
}

export async function triggerAnalysis(studentId: string): Promise<{ status: string, data?: Record<string, unknown>, provisional?: boolean }> {
  console.log(`Triggering Neural Analysis for student ${studentId}...`);
  
  if (!auth) {
    throw new Error("Firebase not initialized");
  }
  const user = auth.currentUser;
  if (!user) {
    throw new Error("You must be logged in to trigger analysis.");
  }

  const idToken = await user.getIdToken();
  
  try {
    const response = await fetch(`${API_URL}/api/triggerNeuralAnalysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({ studentId })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to trigger neural analysis protocol.");
    }

    const data = await response.json();
    
    // If backend returned analysis but couldn't save it (provisional), save it ourselves
    if (data.provisional && data.data && db) {
      console.log("Backend generated analysis but couldn't persist. Attempting frontend save...");
      try {
        const assessmentsQuery = query(
          collection(db, "assessments"), 
          where("student_id", "==", studentId)
        );
        const assessmentDocs = await getDocs(assessmentsQuery);
        
        if (!assessmentDocs.empty) {
          const assessmentDoc = assessmentDocs.docs[0];
          const assessmentRef = doc(db, "assessments", assessmentDoc.id);
          console.log(`[ANALYSIS] Updating assessment ${assessmentDoc.id} with analysis results...`);
          await updateDoc(assessmentRef, {
            analysis_results: data.data,
            status: 'analyzed',
            analyzed_at: Timestamp.now()
          });
          console.log("[ANALYSIS] ✅ Analysis successfully saved from frontend!");
        } else {
          console.warn("[ANALYSIS] ⚠️ No assessment found for student. Analysis not persisted.");
        }
      } catch (saveError: unknown) {
        console.error("[ANALYSIS] ❌ Frontend save failed with error:", {
          code: saveError instanceof Error ? (saveError as { code?: string }).code : 'unknown',
          message: saveError instanceof Error ? saveError.message : 'Unknown error',
          fullError: saveError
        });
        // Don't throw - analysis was generated, just not persisted
      }
    }
    
    return data;
  } catch (error: unknown) {
    console.error("Analysis Trigger Failed:", error);
    const message = error instanceof Error ? error.message : "Failed to trigger neural analysis protocol.";
    throw new Error(message);
  }
}
export async function analyzeWithOpenRouter(prompt: string, studentId?: string): Promise<{ analysis: string, cost: number }> {
  if (!auth) {
    throw new Error("Firebase not initialized");
  }
  const user = auth.currentUser;
  if (!user) {
    throw new Error("You must be logged in to use AI analysis.");
  }

  const idToken = await user.getIdToken();
  
  try {
    const response = await fetch(`${API_URL}/api/students/${studentId || 'analyze'}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({ 
        prompt,
        studentId
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate AI analysis.");
    }

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    console.error("AI Analysis Failed:", error);
    const message = error instanceof Error ? error.message : "Failed to generate AI analysis.";
    throw new Error(message);
  }
}