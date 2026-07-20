import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function AdminPage() {
  const user = await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { data: leads, error } = await supabase
    .from("Lead")
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) {
    throw new Error("Unable to load leads.");
  }

  return (
    <AdminDashboard initialLeads={leads ?? []} adminEmail={user.email ?? ""} />
  );
}
