export function parseCSV(text: string): Record<string, string>[] {
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  if (lines.length < 2) return [];

  const headers = splitCSVLine(lines[0]);
  const results: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = splitCSVLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h.trim()] = (values[idx] ?? "").trim();
    });
    results.push(row);
  }
  return results;
}

function splitCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

export function downloadCSVTemplate(filename: string, headers: string[], exampleRow?: string[]) {
  const lines = [headers.join(",")];
  if (exampleRow) lines.push(exampleRow.map((v) => (v.includes(",") ? `"${v}"` : v)).join(","));
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const TOOLS_CSV_HEADERS = [
  "slug", "name", "tagline", "description", "websiteUrl", "logoUrl",
  "categoryId", "hasFree", "pricingModel", "pricingDetails", "launchedYear",
  "roles", "tags", "accentColor", "securityScore", "securityAnalysis",
  "dataPrivacyNotes", "complianceBadges",
];

export const TOOLS_CSV_EXAMPLE = [
  "my-tool", "My Tool", "The best AI tool", "A comprehensive AI tool for everything.",
  "https://mytool.ai", "", "1", "true", "freemium", "Free: 100 req/mo. Pro: $20/mo",
  "2024", "software-engineer|designer", "ai|productivity", "#6366f1", "80",
  "Strong security practices with SOC 2 compliance.", "Data processed in EU.",
  "SOC 2 Type II|GDPR",
];

export const CHANGELOG_CSV_HEADERS = ["toolSlug", "version", "title", "description", "type", "releaseDate"];
export const CHANGELOG_CSV_EXAMPLE = [
  "my-tool", "2.0", "New AI model", "Upgraded to latest model with 2x better accuracy.", "feature", "2025-03-15",
];
