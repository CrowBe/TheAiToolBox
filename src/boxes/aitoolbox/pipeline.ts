import { z } from "zod";
import { httpsUrl } from "./schema";

const id = z
  .string()
  .regex(/^[a-z0-9]+(?:[_-][a-z0-9]+)*$/, "Use lowercase words separated by hyphens");

/**
 * One post that may name a tool. A later job writes a day's worth of these
 * to data/pipeline/candidates/<date>.json. Keep the shape in step with
 * data/pipeline/candidates.schema.json.
 */
export const candidateSchema = z
  .object({
    toolName: z.string().trim().min(1),
    postUrl: httpsUrl,
    links: z.array(httpsUrl),
    thread: z.array(z.string().trim().min(1)).optional(),
  })
  .strict();

export const candidateFileSchema = z
  .object({
    date: z.iso.date("Use an ISO date (YYYY-MM-DD)"),
    candidates: z.array(candidateSchema),
  })
  .strict();

export type ToolCandidate = z.infer<typeof candidateSchema>;
export type CandidateFile = z.infer<typeof candidateFileSchema>;

export const xQuerySchema = z
  .object({
    id,
    query: z.string().trim().min(1),
    purpose: z.string().trim().min(1),
  })
  .strict();

export const xQueryFileSchema = z
  .array(xQuerySchema)
  .min(1)
  .refine((rows) => new Set(rows.map((row) => row.id)).size === rows.length, "Query ids must be unique");

export type XQuery = z.infer<typeof xQuerySchema>;
