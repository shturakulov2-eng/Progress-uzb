import { NextResponse } from "next/server";

import { isAllowedAdminEmail } from "@/lib/admin-access";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAllowedAdminEmail(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { error } = await supabase.from("Lead").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Unable to delete lead." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
