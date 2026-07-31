import { NextRequest, NextResponse } from "next/server";

import { appendLeadToGoogleSheet } from "@/lib/google-sheets";
import { consumeRateLimit, getClientIp } from "@/lib/rate-limit";
import { leadSchema, serviceInquirySchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers.get("x-forwarded-for"));
  const rateLimit = consumeRateLimit(`lead:${ip}`);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rateLimit.retryAfterMs ?? 0) / 1000)),
        },
      },
    );
  }

  const body: unknown = await request.json();
  const isServiceInquiry =
    typeof body === "object" &&
    body !== null &&
    "source" in body &&
    body.source === "service-inquiry";
  const parsed = isServiceInquiry
    ? serviceInquirySchema.safeParse(body)
    : leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message || "Invalid form submission.",
      },
      { status: 400 },
    );
  }

  // Honeypot — pretend success for bots
  if (parsed.data.website) {
    return NextResponse.json({ success: true });
  }

  try {
    if (isServiceInquiry) {
      const inquiry = serviceInquirySchema.parse(body);
      await appendLeadToGoogleSheet({
        fullName: inquiry.fullName,
        phoneNumber: inquiry.phoneNumber,
        problem: inquiry.problem,
        source: inquiry.source,
      });
    } else {
      const lead = leadSchema.parse(body);
      await appendLeadToGoogleSheet({
        fullName: lead.fullName,
        phoneNumber: lead.phoneNumber,
        companyName: lead.companyName,
        businessType: lead.businessType,
        source: "contact",
      });
    }
  } catch (error) {
    console.error("[leads] Google Sheets append failed:", error);
    return NextResponse.json(
      { error: "Unable to save the request." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    message: "Thank you! We will contact you shortly.",
  });
}
