import { NextResponse } from "next/server";
import { WebhookHandler } from "@/lib/webhooks/handler";

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get("x-hub-signature-256") || "";
    const event = req.headers.get("x-github-event") || "";

    // Ensure you have GITHUB_WEBHOOK_SECRET in your .env.local
    const secret = process.env.GITHUB_WEBHOOK_SECRET;

    if (!secret) {
      console.error("[GitHub Webhook] Missing GITHUB_WEBHOOK_SECRET");
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 },
      );
    }

    const isValid = WebhookHandler.verifySignature(bodyText, signature, secret);

    if (!isValid) {
      console.warn("[GitHub Webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(bodyText);

    // Process the event asynchronously or await it based on requirement
    await WebhookHandler.handleEvent({ event, payload });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[GitHub Webhook] Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
