export type LeadSheetRow = {
  fullName: string;
  phoneNumber: string;
  companyName?: string;
  businessType?: string;
  problem?: string;
  source: string;
};

/**
 * Appends a lead row to Google Sheets via a deployed Apps Script web app.
 * Set GOOGLE_SHEETS_WEBHOOK_URL in the environment (see scripts/google-sheets-apps-script.js).
 */
export async function appendLeadToGoogleSheet(row: LeadSheetRow): Promise<void> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();

  if (!webhookUrl) {
    throw new Error("GOOGLE_SHEETS_WEBHOOK_URL is not configured.");
  }

  const payload = {
    timestamp: new Date().toISOString(),
    fullName: row.fullName,
    phoneNumber: row.phoneNumber,
    companyName: row.companyName ?? "",
    businessType: row.businessType ?? "",
    problem: row.problem ?? "",
    source: row.source,
  };

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Google Sheets webhook failed (${response.status})${detail ? `: ${detail}` : ""}`,
    );
  }
}
