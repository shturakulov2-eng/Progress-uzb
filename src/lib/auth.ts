import { redirect } from "next/navigation";

import { isAllowedAdminEmail } from "@/lib/admin-access";
import { hasSupabaseConfig } from "@/lib/supabase-config";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function requireAdmin() {
  if (!hasSupabaseConfig()) {
    redirect("/admin/login?error=config");
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !isAllowedAdminEmail(user.email)) {
      redirect("/admin/login");
    }

    return user;
  } catch {
    redirect("/admin/login?error=auth");
  }
}
