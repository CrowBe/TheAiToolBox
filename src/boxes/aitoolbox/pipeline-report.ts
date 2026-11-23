export type PipelineRow = {
  field: string;
  value: string;
  source: string;
  quote: string;
};

export type PipelineChange = {
  name: string;
  file: string;
  action: "created" | "updated";
  rows: PipelineRow[];
};

export type PipelineGap = {
  subject: string;
  reason: string;
};

const FIELD_ORDER = [
  "slug",
  "name",
  "tagline",
  "description",
  "url",
  "status",
  "sourceUrl",
  "lastChecked",
  "category",
  "roles",
  "pricingModel",
  "pricingDetails",
  "platforms",
  "tags",
  "launchedYear",
  "accentColor",
];

export function pipelineExitCode(changed: boolean): 0 | 3 {
  return changed ? 0 : 3;
}

export function renderReport(changes: PipelineChange[], gaps: PipelineGap[]): string {
  const lines = [
    `<!-- pipeline-changed: ${changes.length > 0 ? "1" : "0"} -->`,
    "",
    "# Tool data pipeline",
    "",
    "Quoted fields are substrings of the fetched page text. `derived` marks the slug and accent color. Status and last-checked come from the fetch.",
    "",
  ];
  if (changes.length === 0) {
    lines.push("No catalog changes.", "");
  }
  for (const change of changes) {
    lines.push(`## ${change.name}`, "", `\`${change.file}\` ${change.action}.`, "");
    lines.push("| Field | Value | Source | Quote |", "| --- | --- | --- | --- |");
    for (const row of sortRows(change.rows)) {
      lines.push(
        `| ${cell(row.field)} | ${cell(row.value)} | ${cell(row.source)} | ${cell(row.quote)} |`,
      );
    }
    lines.push("");
  }
  lines.push("## Gaps", "");
  if (gaps.length === 0) lines.push("None.", "");
  else {
    for (const gap of gaps) lines.push(`- ${gap.subject}: ${gap.reason}`);
    lines.push("");
  }
  return `${lines.join("\n").trim()}\n`;
}

function sortRows(rows: PipelineRow[]): PipelineRow[] {
  const order = new Map(FIELD_ORDER.map((field, index) => [field, index]));
  return rows
    .map((row, index) => ({ row, index }))
    .sort((left, right) => {
      const delta = (order.get(left.row.field) ?? 99) - (order.get(right.row.field) ?? 99);
      return delta || left.index - right.index;
    })
    .map((item) => item.row);
}

function cell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\r?\n/g, " ").trim();
}
