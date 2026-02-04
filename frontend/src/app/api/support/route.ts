import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Minimal frontend validation
    const { product, category, message, user_email } = body;
    if (!product || !category || !message || !user_email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    if (!user_email || !emailRegex.test(user_email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    // Save to Firestore
    const { db } = await import("@/lib/firebase-admin");
    if (!db) {
      return NextResponse.json({ error: "Firebase DB not initialized" }, { status: 500 });
    }
    await db!.collection("support_requests").add({
      product,
      category,
      message,
      user_email,
      created_at: new Date().toISOString()
    });

    return NextResponse.json({ status: "success", message: "Support request submitted." });
  } catch (error) {
    console.error("Support API Error:", error);
    return NextResponse.json(
      { error: "Invalid request or backend connection failure" },
      { status: 400 }
    );
  }
}
