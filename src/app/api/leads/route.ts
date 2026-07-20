import { NextRequest, NextResponse } from "next/server";

import { isAllowedAdminEmail } from "@/lib/admin-access";
import { consumeRateLimit, getClientIp } from "@/lib/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase-server";
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

  if (parsed.data.website) {
    return NextResponse.json({ success: true });
  }

  if (isServiceInquiry) {
    const inquiry = serviceInquirySchema.parse(body);
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("Lead").insert({
        fullName: inquiry.fullName,
        phoneNumber: inquiry.phoneNumber,
        problem: inquiry.problem,
        source: inquiry.source,
    });

    if (error) {
      return NextResponse.json(
        { error: "Unable to save the request." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  }

  const lead = leadSchema.parse(body);
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("Lead").insert({
      fullName: lead.fullName,
      companyName: lead.companyName,
      businessType: lead.businessType,
      phoneNumber: lead.phoneNumber,
      source: "contact",
  });

  if (error) {
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

export async function GET(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAllowedAdminEmail(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("Lead")
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Unable to load leads." }, { status: 500 });
  }

  const search = request.nextUrl.searchParams.get("q")?.trim().toLowerCase();
  const leads = search
    ? (data ?? []).filter((lead) =>
        [
          lead.fullName,
          lead.companyName,
          lead.businessType,
          lead.phoneNumber,
          lead.problem,
          lead.source,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(search),
      )
    : (data ?? []);

  return NextResponse.json({ leads });
}
