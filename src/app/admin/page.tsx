import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export default async function AdminPage() {
  const user = await requireAdmin();
  const leads = await prisma.lead.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const serializedLeads = leads.map((lead) => ({
    ...lead,
    createdAt: lead.createdAt.toISOString(),
  }));

  return (
    <AdminDashboard initialLeads={serializedLeads} adminEmail={user.email ?? ""} />
  );
}
