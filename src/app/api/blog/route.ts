import { NextResponse } from "next/server";
import { z } from "zod";

import { isAllowedAdminEmail } from "@/lib/admin-access";
import {
  makeExcerpt,
  slugifyTitle,
  toPublicBlogPost,
  type BlogPostRecord,
} from "@/lib/blog";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const publishSchema = z.object({
  title: z.string().trim().min(3).max(160),
  excerpt: z.string().trim().max(400).optional(),
  body: z.string().trim().min(20).max(20000),
  imagePath: z.string().trim().min(1).max(500),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = Number(searchParams.get("limit") || "0");
    const limit =
      Number.isFinite(limitParam) && limitParam > 0
        ? Math.min(limitParam, 100)
        : undefined;

    const supabase = await createSupabaseServerClient();
    let query = supabase
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error("blog GET error", error);
      return NextResponse.json(
        { error: "Unable to load blog posts." },
        { status: 500 },
      );
    }

    const posts = ((data ?? []) as BlogPostRecord[]).map(toPublicBlogPost);
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("blog GET unexpected", error);
    return NextResponse.json(
      { error: "Blog is not configured." },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !isAllowedAdminEmail(user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const parsed = publishSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid blog post payload." },
        { status: 400 },
      );
    }

    const { title, body, imagePath } = parsed.data;
    const excerpt = parsed.data.excerpt?.trim() || makeExcerpt(body);
    const baseSlug = slugifyTitle(title);
    const slug = `${baseSlug}-${Date.now().toString(36)}`;
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("blog_posts")
      .insert({
        slug,
        title,
        excerpt,
        body,
        image_path: imagePath,
        status: "published",
        published_at: now,
      })
      .select("*")
      .single();

    if (error || !data) {
      console.error("blog POST error", error);
      return NextResponse.json(
        { error: "Unable to publish blog post." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      post: toPublicBlogPost(data as BlogPostRecord),
    });
  } catch (error) {
    console.error("blog POST unexpected", error);
    return NextResponse.json(
      { error: "Blog is not configured." },
      { status: 503 },
    );
  }
}
