import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    // Mock checkout URL for now
    const mock_checkout_url = "https://app.dodopayments.com/checkout/mock_123";
    
    return NextResponse.json({ checkout_url: mock_checkout_url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
