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
 * Apps Script flow: POST /exec runs doPost, then returns 302 to a result URL.
 * Fetch must follow that redirect as GET (default) — re-POSTing the Location causes 405.
 */
export async function appendLeadToGoogleSheet(row: LeadSheetRow): Promise<void> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();

  // #region agent log
  fetch("http://127.0.0.1:7536/ingest/f1d1b59d-dd24-43d5-8599-1dfaa67eee90", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "091a6d",
    },
    body: JSON.stringify({
      sessionId: "091a6d",
      runId: "post-fix",
      hypothesisId: "A",
      location: "google-sheets.ts:appendLeadToGoogleSheet:entry",
      message: "Webhook env check",
      data: {
        hasUrl: Boolean(webhookUrl),
        urlLen: webhookUrl?.length ?? 0,
        source: row.source,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

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

  // #region agent log
  fetch("http://127.0.0.1:7536/ingest/f1d1b59d-dd24-43d5-8599-1dfaa67eee90", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "091a6d",
    },
    body: JSON.stringify({
      sessionId: "091a6d",
      runId: "post-fix",
      hypothesisId: "D",
      location: "google-sheets.ts:appendLeadToGoogleSheet:response",
      message: "Apps Script follow-redirect response",
      data: {
        status: response.status,
        ok: response.ok,
        redirected: response.redirected,
        bodySnippet: text.slice(0, 180),
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  if (!response.ok) {
    throw new Error(
      `Google Sheets webhook failed (${response.status})${text ? `: ${text.slice(0, 200)}` : ""}`,
    );
  }

  if (!text) return;

  try {
    const json = JSON.parse(text) as { ok?: boolean; error?: string };
    // #region agent log
    fetch("http://127.0.0.1:7536/ingest/f1d1b59d-dd24-43d5-8599-1dfaa67eee90", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "091a6d",
      },
      body: JSON.stringify({
        sessionId: "091a6d",
        runId: "post-fix",
        hypothesisId: "C",
        location: "google-sheets.ts:appendLeadToGoogleSheet:json",
        message: "Parsed Apps Script JSON",
        data: { ok: json.ok === true, hasError: Boolean(json.error) },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    if (json.ok === false) {
      throw new Error(json.error || "Google Sheets reported failure.");
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      // Non-JSON success body (should not happen for our script)
      return;
    }
    throw error;
  }
}
