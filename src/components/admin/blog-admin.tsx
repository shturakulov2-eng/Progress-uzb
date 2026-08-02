"use client";

import { LogOut, Newspaper, Pencil, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import type { PublicBlogPost } from "@/lib/blog";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

type BlogAdminProps = {
  adminEmail: string;
  initialPosts: PublicBlogPost[];
};

export function BlogAdmin({ adminEmail, initialPosts }: BlogAdminProps) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  const isEditing = Boolean(editingPostId);

  const canSave = useMemo(() => {
    if (!title.trim() || !body.trim() || isSaving) return false;
    if (isEditing) return true;
    return Boolean(imageFile);
  }, [title, body, imageFile, isSaving, isEditing]);

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  function resetForm() {
    setEditingPostId(null);
    setTitle("");
    setExcerpt("");
    setBody("");
    setImageFile(null);
    setImagePreview("");
  }

  function handleImageChange(file: File | null) {
    setImageFile(file);
    if (!file) {
      if (!isEditing) {
        setImagePreview("");
      }
      return;
    }
    setImagePreview(URL.createObjectURL(file));
  }

  function startEdit(post: PublicBlogPost) {
    setError("");
    setSuccess("");
    setEditingPostId(post.id);
    setTitle(post.title);
    setExcerpt(post.excerpt);
    setBody(post.body);
    setImageFile(null);
    setImagePreview(post.image);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setError("");
    setSuccess("");
    resetForm();
  }

  async function uploadImage(file: File) {
    const uploadData = new FormData();
    uploadData.append("file", file);

    const uploadResponse = await fetch("/api/blog/upload", {
      method: "POST",
      body: uploadData,
    });
    const uploadJson = (await uploadResponse.json()) as {
      path?: string;
      error?: string;
    };

    if (!uploadResponse.ok || !uploadJson.path) {
      throw new Error(uploadJson.error || "Image upload failed.");
    }

    return uploadJson.path;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSave) return;

    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      let imagePath: string | undefined;

      if (imageFile) {
        imagePath = await uploadImage(imageFile);
      }

      if (isEditing && editingPostId) {
        const updateResponse = await fetch(`/api/blog/${editingPostId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            excerpt: excerpt.trim() || undefined,
            body,
            ...(imagePath ? { imagePath } : {}),
          }),
        });
        const updateJson = (await updateResponse.json()) as {
          post?: PublicBlogPost;
          error?: string;
        };

        if (!updateResponse.ok || !updateJson.post) {
          setError(updateJson.error || "Update failed.");
          return;
        }

        setPosts((current) =>
          current.map((post) =>
            post.id === updateJson.post!.id ? updateJson.post! : post,
          ),
        );
        resetForm();
        setSuccess("Updated. Changes are live on /blog and the homepage.");
        router.refresh();
        return;
      }

      if (!imagePath) {
        setError("Cover image is required.");
        return;
      }

      const publishResponse = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          excerpt: excerpt.trim() || undefined,
          body,
          imagePath,
        }),
      });
      const publishJson = (await publishResponse.json()) as {
        post?: PublicBlogPost;
        error?: string;
      };

      if (!publishResponse.ok || !publishJson.post) {
        setError(publishJson.error || "Publish failed.");
        return;
      }

      setPosts((current) => [publishJson.post!, ...current]);
      resetForm();
      setSuccess(
        "Published. It now appears on /blog and the homepage Blog section.",
      );
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Network error while saving.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(post: PublicBlogPost) {
    const confirmed = window.confirm(
      `"${post.title}" postini o‘chirib tashlamoqchimisiz? Bu amalni qaytarib bo‘lmaydi.`,
    );
    if (!confirmed) return;

    setError("");
    setSuccess("");
    setDeletingPostId(post.id);

    try {
      const response = await fetch(`/api/blog/${post.id}`, {
        method: "DELETE",
      });
      const json = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(json.error || "Delete failed.");
        return;
      }

      setPosts((current) => current.filter((item) => item.id !== post.id));

      if (editingPostId === post.id) {
        resetForm();
      }

      setSuccess("Post deleted.");
      router.refresh();
    } catch {
      setError("Network error while deleting.");
    } finally {
      setDeletingPostId(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0C3272]/15 bg-[#0C3272]/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#0C3272]">
            <Newspaper className="size-3.5" />
            Blog CMS
          </div>
          <h1 className="text-2xl font-semibold text-slate-950">
            {isEditing ? "Edit blog post" : "Publish a new blog post"}
          </h1>
          <p className="text-sm text-slate-600">Signed in as {adminEmail}</p>
        </div>
        <Button type="button" variant="secondary" onClick={handleLogout}>
          <LogOut className="mr-2 size-4" />
          Logout
        </Button>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-slate-700">
              Sarlavha
            </label>
            <input
              id="title"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-[#0C3272]"
              placeholder="Post title"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="excerpt" className="text-sm font-medium text-slate-700">
              Qisqa matn (ixtiyoriy)
            </label>
            <textarea
              id="excerpt"
              rows={3}
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0C3272]"
              placeholder="Card preview text. Agar bo‘sh qoldirilsa, matndan avtomatik olinadi."
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="body" className="text-sm font-medium text-slate-700">
              To‘liq matn
            </label>
            <textarea
              id="body"
              required
              rows={12}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#0C3272]"
              placeholder="Full article body"
            />
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="image" className="text-sm font-medium text-slate-700">
              Rasm {isEditing ? "(ixtiyoriy — o‘zgartirish uchun)" : ""}
            </label>
            <label
              htmlFor="image"
              className="flex min-h-56 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-[#0C3272]"
            >
              {imagePreview ? (
                <div className="relative h-48 w-full">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    unoptimized
                    className="rounded-2xl object-cover"
                  />
                </div>
              ) : (
                <>
                  <Upload className="mb-3 size-6 text-[#0C3272]" />
                  <p className="text-sm font-medium text-slate-800">
                    Upload cover image
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    JPEG, PNG, WEBP, GIF — max 5MB
                  </p>
                </>
              )}
            </label>
            <input
              id="image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              onChange={(event) =>
                handleImageChange(event.target.files?.[0] ?? null)
              }
            />
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}
          {success ? (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="submit"
              size="large"
              className="w-full"
              disabled={!canSave}
            >
              {isSaving
                ? isEditing
                  ? "Saving..."
                  : "Publishing..."
                : isEditing
                  ? "Save changes"
                  : "Publish"}
            </Button>
            {isEditing ? (
              <Button
                type="button"
                variant="secondary"
                size="large"
                className="w-full sm:w-auto"
                onClick={cancelEdit}
                disabled={isSaving}
              >
                <X className="mr-2 size-4" />
                Cancel
              </Button>
            ) : null}
          </div>
        </div>
      </form>

      <section className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">
          Published posts ({posts.length})
        </h2>
        {posts.length === 0 ? (
          <p className="text-sm text-slate-600">
            No published posts yet. Publish your first article above.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {posts.map((post) => {
              const isRowEditing = editingPostId === post.id;
              const isDeleting = deletingPostId === post.id;

              return (
                <li
                  key={post.id}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center"
                >
                  <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-900">
                      {post.title}
                      {isRowEditing ? (
                        <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-[#0C3272]">
                          Editing
                        </span>
                      ) : null}
                    </p>
                    <p className="truncate text-sm text-slate-500">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      className="px-4 py-2"
                      onClick={() => startEdit(post)}
                      disabled={isSaving || isDeleting}
                    >
                      <Pencil className="mr-2 size-4" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleDelete(post)}
                      disabled={isSaving || isDeleting}
                    >
                      <Trash2 className="mr-2 size-4" />
                      {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
