import { Student } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function createStudent(data: { name: string, grade_level: string, parent_id: string, school_type?: string }): Promise<Student> {
  const response = await fetch(`${API_BASE_URL}/students/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create student");
  return response.json();
}

export async function submitAssessment(studentId: string, type: string, data: Record<string, unknown>) {
  const response = await fetch(`${API_BASE_URL}/assessments/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      student_id: studentId,
      assessment_type: type,
      data: data
    }),
  });
  if (!response.ok) throw new Error("Failed to submit assessment");
  return response.json();
}

export async function createCheckoutSession(userId: string) {
  const response = await fetch(`${API_BASE_URL}/payments/create-checkout?user_id=${userId}`, {
    method: "POST"
  });
  if (!response.ok) throw new Error("Failed to create checkout session");
  return response.json();
}

export async function getStudentDashboard(studentId: string): Promise<Student> {
  const response = await fetch(`${API_BASE_URL}/students/${studentId}`);
  if (!response.ok) throw new Error("Failed to fetch dashboard");
  return response.json();
}

export async function triggerAnalysis(studentId: string): Promise<{ status: string, message: string }> {
  const response = await fetch(`${API_BASE_URL}/students/${studentId}/analyze`, {
    method: "POST",
  });
  if (!response.ok) throw new Error("Failed to trigger neural analysis");
  return response.json();
}
