import { NextResponse } from "next/server";

import { isAllowedAdminEmail } from "@/lib/admin-access";
import {
  makeExcerpt,
  toPublicBlogPost,
  type BlogPostRecord,
} from "@/lib/blog";
import { formatZodError, updateBlogSchema } from "@/lib/blog-validation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function requireAdminClient() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAllowedAdminEmail(user.email)) {
    return { supabase, unauthorized: true as const };
  }

  return { supabase, unauthorized: false as const };
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { supabase, unauthorized } = await requireAdminClient();

    if (unauthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id?.trim()) {
      return NextResponse.json({ error: "Post id is required." }, { status: 400 });
    }

    const json = await request.json();
    const parsed = updateBlogSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: formatZodError(parsed.error) },
        { status: 400 },
      );
    }

    const { title, body, imagePath } = parsed.data;
    const excerpt = parsed.data.excerpt?.trim() || makeExcerpt(body);

    const updates: Record<string, string> = {
      title,
      excerpt,
      body,
      updated_at: new Date().toISOString(),
    };

    if (imagePath) {
      updates.image_path = imagePath;
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error || !data) {
      console.error("blog PATCH error", error);
      return NextResponse.json(
        {
          error:
            error?.message ||
            "Unable to update blog post. Check Supabase blog_posts table and RLS.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      post: toPublicBlogPost(data as BlogPostRecord),
    });
  } catch (error) {
    console.error("blog PATCH unexpected", error);
    return NextResponse.json(
      { error: "Blog is not configured." },
      { status: 503 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { supabase, unauthorized } = await requireAdminClient();

    if (unauthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id?.trim()) {
      return NextResponse.json({ error: "Post id is required." }, { status: 400 });
    }

    const { data: existing, error: fetchError } = await supabase
      .from("blog_posts")
      .select("id, image_path")
      .eq("id", id)
      .maybeSingle();

    if (fetchError) {
      console.error("blog DELETE fetch error", fetchError);
      return NextResponse.json(
        { error: "Unable to delete blog post." },
        { status: 500 },
      );
    }

    if (!existing) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) {
      console.error("blog DELETE error", error);
      return NextResponse.json(
        { error: error.message || "Unable to delete blog post." },
        { status: 500 },
      );
    }

    const imagePath = (existing as { image_path?: string }).image_path;
    if (
      imagePath &&
      !imagePath.startsWith("http://") &&
      !imagePath.startsWith("https://")
    ) {
      const { error: storageError } = await supabase.storage
        .from("blog")
        .remove([imagePath]);

      if (storageError) {
        console.error("blog DELETE storage cleanup error", storageError);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("blog DELETE unexpected", error);
    return NextResponse.json(
      { error: "Blog is not configured." },
      { status: 503 },
    );
  }
}
