import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  if (!db) {
    return NextResponse.json({ error: "Firebase DB not initialized" }, { status: 500 });
  }
  try {
    const { studentId } = await params;

    const studentDoc = await db!.collection("students").doc(studentId).get();
    if (!studentDoc.exists) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const studentData = studentDoc.data();
    
    // Fetch assessments
    const assessmentsSnapshot = await db!
      .collection("assessments")
      .where("student_id", "==", studentId)
      .orderBy("created_at", "desc")
      .get();
    
    const assessments = assessmentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Fetch insights
    const insightsSnapshot = await db!
      .collection("insights")
      .where("student_id", "==", studentId)
      .orderBy("created_at", "desc")
      .get();

    const insights = insightsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Fetch action plans
    const actionPlansSnapshot = await db!
      .collection("action_plans")
      .where("student_id", "==", studentId)
      .orderBy("created_at", "desc")
      .get();

    const actionPlans = actionPlansSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      ...studentData,
      assessments,
      insights,
      action_plans: actionPlans
    });
  } catch (error) {
    console.error("Error fetching student dashboard:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
