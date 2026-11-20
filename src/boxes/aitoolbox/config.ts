import type { BoxConfig, VocabularyEntry } from "@/engine/types";
import categories from "../../../data/vocabularies/categories.json";
import platforms from "../../../data/vocabularies/platforms.json";
import pricingModels from "../../../data/vocabularies/pricing-models.json";
import roles from "../../../data/vocabularies/roles.json";
import { vocabularyFileSchema } from "./schema";

function vocabulary(input: unknown, name: string): VocabularyEntry[] {
  const parsed = vocabularyFileSchema.safeParse(input);
  if (!parsed.success) {
    const detail = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || name}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid vocabulary ${name}: ${detail}`);
  }
  const seen = new Set<string>();
  for (const entry of parsed.data) {
    if (seen.has(entry.slug)) throw new Error(`Duplicate ${name} slug ${entry.slug}`);
    seen.add(entry.slug);
  }
  return parsed.data
    .map((entry) => ({
      id: entry.slug,
      label: entry.name,
      description: entry.description,
      featured: entry.featured ?? false,
      sort: entry.sortOrder ?? 0,
    }))
    .sort((a, b) => a.sort - b.sort || a.label.localeCompare(b.label, "en"));
}

const mark = {
  nameField: "name",
  urlField: "url",
  colorField: "accentColor",
} as const;

const aitoolbox = {
  id: "aitoolbox",
  site: {
    name: "The AI Tool Box",
    shortName: "AI Tool Box",
    tagline: "A labelled catalog of AI tools.",
    description:
      "Search and filter AI tools by category, audience, pricing, platform, tags, and launch year.",
  },
  item: {
    noun: { one: "tool", other: "tools" },
    idField: "slug",
    slugField: "slug",
    sortField: "name",
    path: "/tools",
  },
  search: {
    fields: ["name", "tagline", "description", "tags"],
    placeholder: "Search by name, description, or tag",
  },
  labels: [
    {
      field: "category",
      label: "Category",
      type: "string",
      control: "combobox",
      vocabulary: "categories",
      param: "category",
      showOnCard: true,
    },
    {
      field: "roles",
      label: "Audience",
      type: "string-list",
      control: "combobox",
      vocabulary: "roles",
      param: "audience",
    },
    {
      field: "pricingModel",
      label: "Pricing",
      type: "string",
      control: "combobox",
      vocabulary: "pricingModels",
      param: "pricing",
      showOnCard: true,
    },
    {
      field: "platforms",
      label: "Platform",
      type: "string-list",
      control: "combobox",
      vocabulary: "platforms",
      param: "platform",
    },
    {
      field: "launchedYear",
      label: "Launched",
      type: "number",
      control: "combobox",
      param: "year",
      showOnCard: true,
    },
    {
      field: "tags",
      label: "Tags",
      type: "string-list",
      control: "combobox",
      param: "tag",
    },
  ],
  card: {
    titleField: "name",
    subtitleField: "tagline",
    mark,
  },
  detail: {
    titleField: "name",
    subtitleField: "tagline",
    bodyField: "description",
    linkField: "url",
    linkLabel: "Visit site",
    meta: [{ field: "pricingDetails", label: "Pricing details" }],
    mark,
  },
  collections: [
    {
      field: "category",
      label: "Categories",
      path: "/categories",
      vocabulary: "categories",
    },
  ],
  library: {
    path: "/box",
    label: "My box",
  },
  vocabularies: {
    categories: vocabulary(categories, "categories"),
    roles: vocabulary(roles, "roles"),
    pricingModels: vocabulary(pricingModels, "pricing models"),
    platforms: vocabulary(platforms, "platforms"),
  },
} satisfies BoxConfig;

export const box: BoxConfig = aitoolbox;
