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
 * Set GOOGLE_SHEETS_WEBHOOK_URL in the environment (Vercel + local .env).
 *
 * Apps Script flow: POST /exec runs doPost, then returns 302 to a result URL.
 * Fetch must follow that redirect as GET (default) — re-POSTing the Location causes 405.
 */
export async function appendLeadToGoogleSheet(row: LeadSheetRow): Promise<void> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();

  if (!webhookUrl) {
    throw new Error("GOOGLE_SHEETS_WEBHOOK_URL is not configured.");
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

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: payload,
    redirect: "follow",
    cache: "no-store",
  });

  const text = await response.text().catch(() => "");

  if (!response.ok) {
    throw new Error(
      `Google Sheets webhook failed (${response.status})${text ? `: ${text.slice(0, 200)}` : ""}`,
    );
  }

  if (!text) return;

  try {
    const json = JSON.parse(text) as { ok?: boolean; error?: string };
    if (json.ok === false) {
      throw new Error(json.error || "Google Sheets reported failure.");
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      return;
    }
    throw error;
  }
}
