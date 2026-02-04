import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { student_id, assessment_type, data: assessmentData } = data;

    if (!student_id || !assessment_type || !assessmentData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const assessmentRef = db.collection("assessments").doc();
    const docData = {
      id: assessmentRef.id,
      student_id,
      type: assessment_type,
      data: assessmentData,
      created_at: new Date().toISOString(),
      analysis_results: {}
    };

    await assessmentRef.set(docData);

    return NextResponse.json({ status: "success", assessment_id: assessmentRef.id });
  } catch (error) {
    console.error("Error submitting assessment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
