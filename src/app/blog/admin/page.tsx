import { redirect } from "next/navigation";

/** Convenience alias: /blog/admin → /admin/blog */
export default function BlogAdminAliasPage() {
  redirect("/admin/blog");
}
