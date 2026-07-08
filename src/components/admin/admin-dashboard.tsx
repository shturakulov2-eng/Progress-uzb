"use client";

import { useMemo, useState } from "react";
import { Download, LogOut, Search, Trash2, UserRound } from "lucide-react";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { cn, formatDate } from "@/lib/utils";

type Lead = {
  id: string;
  fullName: string;
  companyName: string;
  businessType: string;
  phoneNumber: string;
  createdAt: string;
};

type AdminDashboardProps = {
  initialLeads: Lead[];
  adminEmail: string;
};

export function AdminDashboard({
  initialLeads,
  adminEmail,
}: AdminDashboardProps) {
  const router = useRouter();
  const [now] = useState(() => Date.now());
  const [query, setQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(
    initialLeads[0] ?? null,
  );
  const [leads, setLeads] = useState(initialLeads);
  const [busyLeadId, setBusyLeadId] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const filteredLeads = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    if (!normalized) return leads;

    return leads.filter((lead) =>
      [lead.fullName, lead.companyName, lead.businessType, lead.phoneNumber]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [leads, query]);

  const stats = useMemo(
    () => [
      { label: "Total leads", value: leads.length },
      {
        label: "This week",
        value: leads.filter((lead) => {
          const created = new Date(lead.createdAt).getTime();
          return now - created <= 7 * 24 * 60 * 60 * 1000;
        }).length,
      },
      {
        label: "Latest submission",
        value: leads[0] ? formatDate(leads[0].createdAt) : "No leads yet",
      },
    ],
    [leads, now],
  );

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Delete this lead permanently?");
    if (!confirmed) return;

    setBusyLeadId(id);

    const response = await fetch(`/api/leads/${id}`, {
      method: "DELETE",
    });

    setBusyLeadId(null);

    if (!response.ok) {
      window.alert("Failed to delete the lead.");
      return;
    }

    const nextLeads = leads.filter((lead) => lead.id !== id);
    setLeads(nextLeads);

    if (selectedLead?.id === id) {
      setSelectedLead(nextLeads[0] ?? null);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  function exportCsv() {
    const rows = [
      ["Full Name", "Company Name", "Business Type", "Phone Number", "Date & Time"],
      ...filteredLeads.map((lead) => [
        lead.fullName,
        lead.companyName,
        lead.businessType,
        lead.phoneNumber,
        formatDate(lead.createdAt),
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replaceAll("\"", "\"\"")}"`)
          .join(","),
      )
      .join("\n");

    downloadFile(csv, "progress-leads.csv", "text/csv;charset=utf-8;");
  }

  function exportXlsx() {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredLeads.map((lead) => ({
        "Full Name": lead.fullName,
        "Company Name": lead.companyName,
        "Business Type": lead.businessType,
        "Phone Number": lead.phoneNumber,
        "Date & Time": formatDate(lead.createdAt),
      })),
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    const buffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
    downloadFile(
      buffer,
      "progress-leads.xlsx",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-200/80">
              Protected dashboard
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Lead Management Overview
            </h1>
            <p className="text-sm text-slate-300">
              Signed in as <span className="font-medium text-white">{adminEmail}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={exportCsv}>
              <Download className="mr-2 size-4" />
              Export CSV
            </Button>
            <Button variant="secondary" onClick={exportXlsx}>
              <Download className="mr-2 size-4" />
              Export XLSX
            </Button>
            <Button
              onClick={handleLogout}
              disabled={loggingOut}
              className="bg-white text-slate-950 hover:bg-slate-100"
            >
              <LogOut className="mr-2 size-4" />
              {loggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              <p className="text-sm text-slate-300">{item.label}</p>
              <p className="mt-3 text-2xl font-semibold text-white">{item.value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[32px] border border-white/10 bg-white p-5 text-slate-950 shadow-2xl shadow-black/20">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">All Leads</h2>
                <p className="text-sm text-slate-500">
                  Search, review, and manage all captured consultation requests.
                </p>
              </div>
              <label className="relative block w-full max-w-sm">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search leads"
                  className="h-12 w-full rounded-full border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none ring-0 transition focus:border-[#0C3272]"
                />
              </label>
            </div>

            <div className="grid gap-3">
              {filteredLeads.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-slate-200 px-6 py-10 text-center text-slate-500">
                  No leads match your search.
                </div>
              ) : (
                filteredLeads.map((lead) => {
                  const isSelected = selectedLead?.id === lead.id;

                  return (
                    <button
                      key={lead.id}
                      type="button"
                      onClick={() => setSelectedLead(lead)}
                      className={cn(
                        "rounded-[24px] border px-5 py-4 text-left transition-all",
                        isSelected
                          ? "border-[#0C3272] bg-[#0C3272]/5 shadow-lg shadow-[#0C3272]/10"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
                      )}
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-base font-semibold text-slate-950">
                            {lead.fullName}
                          </p>
                          <p className="text-sm text-slate-600">
                            {lead.companyName} · {lead.businessType}
                          </p>
                        </div>
                        <div className="flex items-center justify-between gap-3 md:justify-end">
                          <p className="text-sm text-slate-500">
                            {formatDate(lead.createdAt)}
                          </p>
                          <Button
                            variant="ghost"
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            disabled={busyLeadId === lead.id}
                            onClick={(event) => {
                              event.stopPropagation();
                              void handleDelete(lead.id);
                            }}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <aside className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold">Lead Details</h2>
            {selectedLead ? (
              <div className="mt-6 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="flex size-14 items-center justify-center rounded-full bg-white/10">
                    <UserRound className="size-6 text-blue-100" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{selectedLead.fullName}</p>
                    <p className="text-sm text-slate-300">
                      Submitted {formatDate(selectedLead.createdAt)}
                    </p>
                  </div>
                </div>
                <DetailItem label="Company Name" value={selectedLead.companyName} />
                <DetailItem label="Business Type" value={selectedLead.businessType} />
                <DetailItem label="Phone Number" value={selectedLead.phoneNumber} />
              </div>
            ) : (
              <div className="mt-6 rounded-[24px] border border-dashed border-white/15 px-6 py-10 text-sm text-slate-300">
                Select a lead from the list to inspect details.
              </div>
            )}
          </aside>
        </section>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-blue-200/80">{label}</p>
      <p className="mt-2 text-base text-white">{value}</p>
    </div>
  );
}

function downloadFile(data: BlobPart, filename: string, type: string) {
  const blob = new Blob([data], { type });
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(href);
}
