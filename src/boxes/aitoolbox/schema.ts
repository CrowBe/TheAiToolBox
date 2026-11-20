import { z } from "zod";

const id = z
  .string()
  .regex(/^[a-z0-9]+(?:[_-][a-z0-9]+)*$/, "Use lowercase words separated by hyphens");

function uniqueIds(min: number) {
  return z
    .array(id)
    .min(min)
    .refine((values) => new Set(values).size === values.length, "Values must be unique");
}

const httpsUrl = z.string().refine((value) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.includes(".");
  } catch {
    return false;
  }
}, "Must be an https URL");

export const itemSchema = z
  .object({
    slug: id,
    name: z.string().trim().min(1),
    tagline: z.string().trim().min(1).max(180),
    description: z.string().trim().min(1),
    url: httpsUrl,
    category: id,
    roles: uniqueIds(1),
    pricingModel: id,
    pricingDetails: z.string().trim().min(1),
    platforms: uniqueIds(1),
    tags: uniqueIds(1),
    launchedYear: z.number().int().gte(1990).lte(2100),
    accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Use a #RRGGBB color"),
  })
  .strict();

export type ToolRecord = z.infer<typeof itemSchema>;

export const vocabularySchema = z
  .object({
    slug: id,
    name: z.string().trim().min(1),
    description: z.string().trim().min(1),
    featured: z.boolean().optional(),
    sortOrder: z.number().int().optional(),
  })
  .strict();

export const vocabularyFileSchema = z.array(vocabularySchema).min(1);
