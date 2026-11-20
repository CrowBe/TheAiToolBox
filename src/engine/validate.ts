import { readValues } from "./access";
import type { BoxConfig } from "./types";

type SchemaIssue = { path: PropertyKey[]; message: string };

export type ItemSchema<T extends object> = {
  safeParse: (
    value: unknown,
  ) =>
    | { success: true; data: T }
    | { success: false; error: { issues: readonly SchemaIssue[] } };
};

export class CatalogValidationError extends Error {
  readonly issues: string[];

  constructor(issues: string[]) {
    super(issues.slice(0, 40).join("\n"));
    this.name = "CatalogValidationError";
    this.issues = issues;
  }
}

export function validateCatalog<T extends object>(options: {
  items: readonly unknown[];
  schema: ItemSchema<T>;
  config: BoxConfig;
  sources?: readonly string[];
}): T[] {
  const issues: string[] = [];
  issues.push(...configIssues(options.config));
  if (options.sources && options.sources.length !== options.items.length) {
    issues.push(
      `Expected ${options.items.length} source names, received ${options.sources.length}`,
    );
  }

  const parsed: T[] = [];
  const seen = new Set<string>();
  options.items.forEach((item, index) => {
    const source = options.sources?.[index] ?? `item ${index + 1}`;
    const result = options.schema.safeParse(item);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const path = issue.path.length > 0 ? issue.path.map(String).join(".") : "(root)";
        issues.push(`${source}: ${path}: ${issue.message}`);
      }
      return;
    }
    const record = result.data;
    const id = readValues(record, options.config.item.idField)[0] ?? "";
    const slug = readValues(record, options.config.item.slugField)[0] ?? "";
    if (!id) issues.push(`${source}: missing ${options.config.item.idField}`);
    if (!slug) issues.push(`${source}: missing ${options.config.item.slugField}`);
    if (id && seen.has(id)) issues.push(`${source}: duplicate ${options.config.item.idField} "${id}"`);
    if (id) seen.add(id);
    if (options.sources) {
      const filename = source.split("/").pop();
      if (filename !== `${slug}.json`) issues.push(`${source}: filename should be ${slug}.json`);
    }
    for (const label of options.config.labels) {
      if (!label.vocabulary) continue;
      const allowed = new Set(
        (options.config.vocabularies[label.vocabulary] ?? []).map((entry) => entry.id),
      );
      for (const value of readValues(record, label.field)) {
        if (!allowed.has(value)) {
          issues.push(
            `${source}: ${label.field} "${value}" is not in vocabulary ${label.vocabulary}`,
          );
        }
      }
    }
    parsed.push(record);
  });

  if (issues.length > 0) throw new CatalogValidationError(issues);
  return parsed;
}

function configIssues(config: BoxConfig): string[] {
  const issues: string[] = [];
  if (!config.item.path.startsWith("/")) issues.push("item.path must start with /");
  const fields = new Set<string>();
  for (const label of config.labels) {
    if (fields.has(label.field)) issues.push(`duplicate label field ${label.field}`);
    fields.add(label.field);
    if (label.vocabulary && !config.vocabularies[label.vocabulary]) {
      issues.push(`label ${label.field} references missing vocabulary ${label.vocabulary}`);
    }
  }
  if (config.search.fields.length === 0) issues.push("search.fields must not be empty");
  const paths = new Set<string>();
  for (const collection of config.collections) {
    if (!collection.path.startsWith("/")) issues.push(`collection ${collection.label} path must start with /`);
    if (paths.has(collection.path)) issues.push(`duplicate collection path ${collection.path}`);
    paths.add(collection.path);
    if (!config.labels.some((label) => label.field === collection.field)) {
      issues.push(`collection ${collection.path} field ${collection.field} is not a label`);
    }
    if (!config.vocabularies[collection.vocabulary]) {
      issues.push(`collection ${collection.path} references missing vocabulary ${collection.vocabulary}`);
    }
  }
  for (const [name, entries] of Object.entries(config.vocabularies)) {
    const ids = new Set<string>();
    for (const entry of entries) {
      if (ids.has(entry.id)) issues.push(`vocabulary ${name} has duplicate id ${entry.id}`);
      ids.add(entry.id);
    }
  }
  return issues;
}
