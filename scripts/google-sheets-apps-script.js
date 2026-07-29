/**
 * Google Apps Script — paste into Extensions → Apps Script on your Sheet,
 * then Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone).
 * Copy the web app URL into GOOGLE_SHEETS_WEBHOOK_URL.
 *
 * Sheet columns (row 1 headers):
 * Timestamp | Full Name | Phone | Company | Business Type | Problem | Source
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leads") ||
      SpreadsheetApp.getActiveSpreadsheet().insertSheet("Leads");

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Full Name",
        "Phone",
        "Company",
        "Business Type",
        "Problem",
        "Source",
      ]);
    }

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.fullName || "",
      data.phoneNumber || "",
      data.companyName || "",
      data.businessType || "",
      data.problem || "",
      data.source || "",
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(error) }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput("Progress.uzb leads webhook OK");
}
