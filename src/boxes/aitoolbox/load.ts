import fs from "node:fs";
import path from "node:path";
import { CatalogValidationError, validateCatalog } from "@/engine/validate";
import { box } from "./config";
import { itemSchema, type ToolRecord } from "./schema";

let cache: ToolRecord[] | null = null;

export function loadItems(): ToolRecord[] {
  if (cache) return cache;
  const directory = path.join(process.cwd(), "data", "tools");
  const sources = fs
    .readdirSync(directory)
    .filter((name) => name.endsWith(".json"))
    .sort();
  const items = sources.map((name) => {
    try {
      return JSON.parse(fs.readFileSync(path.join(directory, name), "utf8")) as unknown;
    } catch {
      throw new CatalogValidationError([`${name}: invalid JSON`]);
    }
  });
  const validated = validateCatalog({ items, schema: itemSchema, config: box, sources });
  cache = validated;
  return validated;
}
