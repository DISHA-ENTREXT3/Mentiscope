import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { generatePassword } from "@/lib/password-server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!db) {
    // Mock response for UI testing when DB is not configured
    console.warn("Firebase DB not initialized - utilizing simulation mode");
    const mockId = "SIM-" + Math.random().toString(36).substring(7).toUpperCase();
    const mockPassword = generatePassword(10);
    return NextResponse.json({
        id: mockId,
        name: (await req.json()).name || "Simulated Student",
        grade_level: "Grade 10",
        parent_id: "sim-parent",
        school_type: "Public",
        created_at: new Date().toISOString(),
        readiness_score: 0,
        temp_password: mockPassword, 
        neural_id: `STUDENT-${mockId}`,
        raw_password: mockPassword
    });
  }
  try {
    const data = await req.json();
    const { name, grade_level, parent_id, school_type } = data;

    if (!name || !grade_level || !parent_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate a secure 10-character password for the student
    const studentPassword = generatePassword(10);

    const studentRef = db!.collection("students").doc();
    const studentData = {
      id: studentRef.id,
      name,
      grade_level,
      parent_id,
      school_type: school_type || "Public",
      created_at: new Date().toISOString(),
      readiness_score: 0,
      password: studentPassword, // Store the plain password (10 characters)
      neural_id: `STUDENT-${studentRef.id.substring(0, 6).toUpperCase()}`, // Friendly login ID
    };

    await studentRef.set(studentData);

    // Return the response, including the password so the parent can give it to the student
    return NextResponse.json({
      ...studentData,
      raw_password: studentPassword, // Return for display purposes
    });
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
