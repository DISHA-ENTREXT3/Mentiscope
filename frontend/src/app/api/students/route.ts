import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!db) {
    return NextResponse.json({ error: "Firebase DB not initialized" }, { status: 500 });
  }
  try {
    const data = await req.json();
    const { name, grade_level, parent_id, school_type } = data;

    if (!name || !grade_level || !parent_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const studentRef = db!.collection("students").doc();
    const studentData = {
      id: studentRef.id,
      name,
      grade_level,
      parent_id,
      school_type: school_type || "Public",
      created_at: new Date().toISOString(),
      readiness_score: 0,
    };

    await studentRef.set(studentData);

    return NextResponse.json(studentData);
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
