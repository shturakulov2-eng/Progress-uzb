import { NextRequest, NextResponse } from "next/server";

import { isAllowedAdminEmail } from "@/lib/admin-access";
import { prisma } from "@/lib/prisma";
import { consumeRateLimit, getClientIp } from "@/lib/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { leadSchema } from "@/lib/validators";

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

  const body = await request.json();
  const parsed = leadSchema.safeParse(body);

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

  await prisma.lead.create({
    data: {
      fullName: parsed.data.fullName,
      companyName: parsed.data.companyName,
      businessType: parsed.data.businessType,
      phoneNumber: parsed.data.phoneNumber,
    },
  });

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

  const search = request.nextUrl.searchParams.get("q")?.trim();
  const leads = await prisma.lead.findMany({
    where: search
      ? {
          OR: [
            { fullName: { contains: search, mode: "insensitive" } },
            { companyName: { contains: search, mode: "insensitive" } },
            { businessType: { contains: search, mode: "insensitive" } },
            { phoneNumber: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ leads });
}
