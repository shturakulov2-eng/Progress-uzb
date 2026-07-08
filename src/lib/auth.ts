import { redirect } from "next/navigation";

import { isAllowedAdminEmail } from "@/lib/admin-access";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAllowedAdminEmail(user.email)) {
    redirect("/admin/login");
  }

  return user;
}
