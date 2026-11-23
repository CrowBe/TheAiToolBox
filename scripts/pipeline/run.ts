import path from "node:path";
import { parseArgs } from "node:util";
import { runPipeline } from "../../src/boxes/aitoolbox/pipeline-job.ts";
import { pipelineExitCode } from "../../src/boxes/aitoolbox/pipeline-report.ts";

const HELP = `Usage: pnpm pipeline -- [candidates.json] [options]

Fetch candidate URLs and/or every saved tool URL. No crawling, browser, or model calls.

Options:
  --check-existing     Fetch each saved tool url
  --report <path>      Markdown report (default data/pipeline/report.md)
  --tools <dir>        Tool JSON directory (default data/tools)
  --vocab <dir>        Vocabulary directory (default data/vocabularies)
  --date <YYYY-MM-DD>  Value written to lastChecked (default today, UTC)
  --help

Exit 0 when catalog files change.
Exit 3 when nothing changes. stdout prints pipeline-changed=0.
Exit 1 on a bad file or bad arguments.
The report starts with <!-- pipeline-changed: 0 --> or <!-- pipeline-changed: 1 -->.
`;

function forwardedArgs(argv: string[]): string[] {
  const args = argv.slice(2);
  return args[0] === "--" ? args.slice(1) : args;
}

async function main(): Promise<number> {
  const { values, positionals } = parseArgs({
    args: forwardedArgs(process.argv),
    allowPositionals: true,
    options: {
      "check-existing": { type: "boolean", default: false },
      report: { type: "string" },
      tools: { type: "string" },
      vocab: { type: "string" },
      date: { type: "string" },
      help: { type: "boolean", default: false },
    },
  });
  if (values.help) {
    process.stdout.write(HELP);
    return 0;
  }
  if (positionals.length > 1) throw new Error("Pass at most one candidates file");
  const candidatesPath = positionals[0];
  const checkExisting = values["check-existing"] === true;
  if (!candidatesPath && !checkExisting) {
    throw new Error("Pass a candidates file, --check-existing, or both");
  }
  const result = await runPipeline({
    candidatesPath: candidatesPath ? path.resolve(candidatesPath) : undefined,
    checkExisting,
    toolsDir: path.resolve(values.tools ?? path.join("data", "tools")),
    vocabDir: path.resolve(values.vocab ?? path.join("data", "vocabularies")),
    reportPath: path.resolve(values.report ?? path.join("data", "pipeline", "report.md")),
    date: values.date ?? new Date().toISOString().slice(0, 10),
  });
  process.stdout.write(`pipeline-changed=${result.changed ? "1" : "0"}\n`);
  return pipelineExitCode(result.changed);
}

main()
  .then((code) => {
    process.exit(code);
  })
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Pipeline failed";
    process.stderr.write(`${message}\n`);
    process.exit(1);
  });
