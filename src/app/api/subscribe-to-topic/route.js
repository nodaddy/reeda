import { messaging } from "@/app/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    console.log("Received request"); // Should print in terminal

    const { token, topic } = await req.json();
    console.log("Token:", token, "Topic:", topic); // Debug request body

    if (!token || !topic) {
      return NextResponse.json({ error: "Token and topic are required" }, { status: 400 });
    }

    // ✅ Wrap token in an array (required by Firebase)
    await messaging.subscribeToTopic([token], topic);

    return NextResponse.json({ message: `Subscribed to topic: ${topic}` }, { status: 200 });
  } catch (error) {
    console.error("Error subscribing to topic:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
