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
 * Set GOOGLE_SHEETS_WEBHOOK_URL in the environment.
 *
 * Notes:
 * - Deploy must be: Execute as Me, Who has access: Anyone
 * - Apps Script returns a 302; following it as GET breaks doPost, so we re-POST.
 * - text/plain body avoids some proxy/CORS quirks with Google.
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

  const response = await postToAppsScript(webhookUrl, payload);

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Google Sheets webhook failed (${response.status})${detail ? `: ${detail.slice(0, 200)}` : ""}`,
    );
  }

  // Some deployments return 200 HTML/empty; if JSON is present, require ok:true
  const text = await response.text().catch(() => "");
  if (text) {
    try {
      const json = JSON.parse(text) as { ok?: boolean; error?: string };
      if (json.ok === false) {
        throw new Error(json.error || "Google Sheets reported failure.");
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        // Non-JSON 200 (rare) — treat as success if HTTP ok
        return;
      }
      throw error;
    }
  }
}

async function postToAppsScript(url: string, payload: string): Promise<Response> {
  const init: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: payload,
    redirect: "manual",
    cache: "no-store",
  };

  let response = await fetch(url, init);

  // Follow one Apps Script redirect with another POST (not GET).
  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get("location");
    if (!location) {
      throw new Error("Apps Script redirect missing Location header.");
    }

    response = await fetch(location, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: payload,
      redirect: "follow",
      cache: "no-store",
    });
  }

  return response;
}
