import type { LeadSheetRow } from "@/lib/google-sheets";

function getWebhookUrl() {
  return (
    process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL ||
    process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
    ""
  ).trim();
}

/**
 * Sends a lead straight to the Google Apps Script web app.
 * Static hosting has no server proxy, so the browser uses a simple
 * text/plain POST. Apps Script does not expose a readable CORS response.
 */
export async function submitLead(row: LeadSheetRow) {
  const webhookUrl = getWebhookUrl();

  if (!webhookUrl) {
    throw new Error("Lead form is not configured.");
  }

  const payload = JSON.stringify({
    timestamp: new Date().toISOString(),
    fullName: row.fullName,
    phoneNumber: row.phoneNumber,
    companyName: row.companyName ?? "",
    businessType: row.businessType ?? "",
    problem: row.problem ?? "",
    source: row.source,
  });

  await fetch(webhookUrl, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: payload,
  });
}
