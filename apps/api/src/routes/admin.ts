import { Router } from "express";
import { db } from "@workspace/db";
import {
  toolsTable, categoriesTable, toolChangelogsTable, toolCommentsTable,
} from "@workspace/db";
import { eq, desc, asc } from "drizzle-orm";
import { requireAdmin, isAdminUser } from "../middlewares/requireAdmin";
import { getAuth } from "@clerk/express";
import type { Logger } from "pino";

const router = Router();

// ── GET /admin/me ────────────────────────────────────────────────────────────
// Public-ish: returns whether the current JWT belongs to an admin.
// Used by the frontend to gate the admin UI without exposing the allowlist.
router.get("/admin/me", (req, res) => {
  const auth = getAuth(req);
  const userId = auth?.userId ?? null;
  return res.json({ isAdmin: userId ? isAdminUser(userId) : false, userId });
});

// ── TOOLS ────────────────────────────────────────────────────────────────────

router.post("/admin/tools/bulk", requireAdmin, async (req: any, res) => {
  const log: Logger = req.log;
  const rows = req.body;
  if (!Array.isArray(rows)) return res.status(400).json({ error: "Expected array of tool objects" });

  let imported = 0;
  const errors: string[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    try {
      const required = ["slug", "name", "tagline", "description", "websiteUrl", "categoryId", "pricingModel", "launchedYear"];
      const missing = required.filter((f) => !row[f] && row[f] !== 0);
      if (missing.length > 0) throw new Error(`Missing: ${missing.join(", ")}`);

      await db.insert(toolsTable).values({
        slug: String(row.slug),
        name: String(row.name),
        tagline: String(row.tagline),
        description: String(row.description),
        websiteUrl: String(row.websiteUrl),
        logoUrl: String(row.logoUrl ?? ""),
        categoryId: Number(row.categoryId),
        hasFree: Boolean(row.hasFree === true || row.hasFree === "true" || row.hasFree === "1"),
        pricingModel: row.pricingModel,
        pricingDetails: String(row.pricingDetails ?? ""),
        launchedYear: Number(row.launchedYear),
        roles: Array.isArray(row.roles) ? row.roles : String(row.roles ?? "").split("|").map((s: string) => s.trim()).filter(Boolean),
        tags: Array.isArray(row.tags) ? row.tags : String(row.tags ?? "").split("|").map((s: string) => s.trim()).filter(Boolean),
        accentColor: String(row.accentColor ?? "#6366f1"),
        securityAnalysis: String(row.securityAnalysis ?? ""),
        securityScore: Number(row.securityScore ?? 50),
        dataPrivacyNotes: String(row.dataPrivacyNotes ?? ""),
        complianceBadges: Array.isArray(row.complianceBadges) ? row.complianceBadges : String(row.complianceBadges ?? "").split("|").map((s: string) => s.trim()).filter(Boolean),
      }).onConflictDoUpdate({
        target: toolsTable.slug,
        set: {
          name: String(row.name),
          tagline: String(row.tagline),
          description: String(row.description),
          websiteUrl: String(row.websiteUrl),
        },
      });
      imported++;
    } catch (e: any) {
      errors.push(`Row ${i + 1} (${row.slug ?? "?"}): ${e.message}`);
    }
  }

  log.info({ adminAction: "bulk_import_tools", imported, errorCount: errors.length, by: req.userId });
  return res.json({ imported, errors });
});

router.get("/admin/tools", requireAdmin, async (_req, res) => {
  const tools = await db
    .select()
    .from(toolsTable)
    .orderBy(asc(toolsTable.name));
  const categories = await db.select().from(categoriesTable);
  const catMap = new Map(categories.map((c) => [c.id, c]));

  return res.json(
    tools.map((t) => ({
      ...t,
      categoryName: catMap.get(t.categoryId)?.name ?? "",
    }))
  );
});

router.post("/admin/tools", requireAdmin, async (req: any, res) => {
  const log: Logger = req.log;
  const body = req.body;

  const required = ["slug", "name", "tagline", "description", "websiteUrl", "logoUrl", "categoryId", "launchedYear", "pricingModel"];
  for (const field of required) {
    if (body[field] === undefined || body[field] === "") {
      return res.status(400).json({ error: `Missing required field: ${field}` });
    }
  }

  const [tool] = await db.insert(toolsTable).values({
    slug: body.slug,
    name: body.name,
    tagline: body.tagline,
    description: body.description,
    websiteUrl: body.websiteUrl,
    logoUrl: body.logoUrl ?? "",
    categoryId: Number(body.categoryId),
    hasFree: Boolean(body.hasFree),
    pricingModel: body.pricingModel,
    pricingDetails: body.pricingDetails ?? "",
    launchedYear: Number(body.launchedYear),
    roles: Array.isArray(body.roles) ? body.roles : [],
    tags: Array.isArray(body.tags) ? body.tags : [],
    accentColor: body.accentColor ?? "#6366f1",
    securityAnalysis: body.securityAnalysis ?? "",
    securityScore: Number(body.securityScore ?? 50),
    dataPrivacyNotes: body.dataPrivacyNotes ?? "",
    complianceBadges: Array.isArray(body.complianceBadges) ? body.complianceBadges : [],
  }).returning();

  log.info({ adminAction: "create_tool", toolId: tool.id, toolSlug: tool.slug, by: req.userId });
  return res.status(201).json(tool);
});

router.put("/admin/tools/:id", requireAdmin, async (req: any, res) => {
  const log: Logger = req.log;
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid tool ID" });

  const body = req.body;
  const updates: Partial<typeof toolsTable.$inferInsert> = {};

  if (body.name !== undefined)            updates.name = body.name;
  if (body.tagline !== undefined)         updates.tagline = body.tagline;
  if (body.description !== undefined)     updates.description = body.description;
  if (body.websiteUrl !== undefined)      updates.websiteUrl = body.websiteUrl;
  if (body.logoUrl !== undefined)         updates.logoUrl = body.logoUrl;
  if (body.categoryId !== undefined)      updates.categoryId = Number(body.categoryId);
  if (body.hasFree !== undefined)         updates.hasFree = Boolean(body.hasFree);
  if (body.pricingModel !== undefined)    updates.pricingModel = body.pricingModel;
  if (body.pricingDetails !== undefined)  updates.pricingDetails = body.pricingDetails;
  if (body.launchedYear !== undefined)    updates.launchedYear = Number(body.launchedYear);
  if (body.roles !== undefined)           updates.roles = Array.isArray(body.roles) ? body.roles : [];
  if (body.tags !== undefined)            updates.tags = Array.isArray(body.tags) ? body.tags : [];
  if (body.accentColor !== undefined)     updates.accentColor = body.accentColor;
  if (body.securityAnalysis !== undefined) updates.securityAnalysis = body.securityAnalysis;
  if (body.securityScore !== undefined)   updates.securityScore = Number(body.securityScore);
  if (body.dataPrivacyNotes !== undefined) updates.dataPrivacyNotes = body.dataPrivacyNotes;
  if (body.complianceBadges !== undefined) updates.complianceBadges = Array.isArray(body.complianceBadges) ? body.complianceBadges : [];

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  const [tool] = await db.update(toolsTable).set(updates).where(eq(toolsTable.id, id)).returning();
  if (!tool) return res.status(404).json({ error: "Tool not found" });

  log.info({ adminAction: "update_tool", toolId: id, fields: Object.keys(updates), by: req.userId });
  return res.json(tool);
});

router.delete("/admin/tools/:id", requireAdmin, async (req: any, res) => {
  const log: Logger = req.log;
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid tool ID" });

  const [tool] = await db.delete(toolsTable).where(eq(toolsTable.id, id)).returning();
  if (!tool) return res.status(404).json({ error: "Tool not found" });

  log.info({ adminAction: "delete_tool", toolId: id, toolSlug: tool.slug, by: req.userId });
  return res.status(204).send();
});

// ── CHANGELOG ────────────────────────────────────────────────────────────────

router.post("/admin/changelog/bulk", requireAdmin, async (req: any, res) => {
  const log: Logger = req.log;
  const rows = req.body;
  if (!Array.isArray(rows)) return res.status(400).json({ error: "Expected array" });

  let imported = 0;
  const errors: string[] = [];

  // Build slug→id map for resolving toolSlug column
  const tools = await db.select({ id: toolsTable.id, slug: toolsTable.slug }).from(toolsTable);
  const slugToId = new Map(tools.map((t) => [t.slug, t.id]));

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    try {
      let toolId = Number(row.toolId);
      if (!toolId && row.toolSlug) {
        const resolved = slugToId.get(String(row.toolSlug));
        if (!resolved) throw new Error(`Unknown toolSlug: ${row.toolSlug}`);
        toolId = resolved;
      }
      if (!toolId) throw new Error("Missing toolId or toolSlug");

      const required = ["version", "title", "description", "type", "releaseDate"];
      const missing = required.filter((f) => !row[f]);
      if (missing.length > 0) throw new Error(`Missing: ${missing.join(", ")}`);

      const validTypes = ["feature", "improvement", "fix", "breaking"];
      if (!validTypes.includes(row.type)) throw new Error(`Invalid type: ${row.type}. Must be one of: ${validTypes.join(", ")}`);

      await db.insert(toolChangelogsTable).values({
        toolId,
        version: String(row.version),
        title: String(row.title),
        description: String(row.description),
        type: row.type,
        releaseDate: new Date(row.releaseDate),
      });
      imported++;
    } catch (e: any) {
      errors.push(`Row ${i + 1}: ${e.message}`);
    }
  }

  log.info({ adminAction: "bulk_import_changelog", imported, errorCount: errors.length, by: req.userId });
  return res.json({ imported, errors });
});

router.get("/admin/changelog", requireAdmin, async (_req, res) => {
  const entries = await db
    .select({
      id: toolChangelogsTable.id,
      toolId: toolChangelogsTable.toolId,
      toolName: toolsTable.name,
      toolSlug: toolsTable.slug,
      version: toolChangelogsTable.version,
      title: toolChangelogsTable.title,
      description: toolChangelogsTable.description,
      type: toolChangelogsTable.type,
      releaseDate: toolChangelogsTable.releaseDate,
      createdAt: toolChangelogsTable.createdAt,
    })
    .from(toolChangelogsTable)
    .leftJoin(toolsTable, eq(toolChangelogsTable.toolId, toolsTable.id))
    .orderBy(desc(toolChangelogsTable.releaseDate));

  return res.json(entries);
});

router.post("/admin/changelog", requireAdmin, async (req: any, res) => {
  const log: Logger = req.log;
  const { toolId, version, title, description, type, releaseDate } = req.body;

  if (!toolId || !version || !title || !description || !type || !releaseDate) {
    return res.status(400).json({ error: "Missing required fields: toolId, version, title, description, type, releaseDate" });
  }

  const [entry] = await db.insert(toolChangelogsTable).values({
    toolId: Number(toolId),
    version,
    title,
    description,
    type,
    releaseDate: new Date(releaseDate),
  }).returning();

  log.info({ adminAction: "create_changelog", entryId: entry.id, toolId: entry.toolId, by: req.userId });
  return res.status(201).json(entry);
});

router.put("/admin/changelog/:id", requireAdmin, async (req: any, res) => {
  const log: Logger = req.log;
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const { version, title, description, type, releaseDate } = req.body;
  const updates: Record<string, unknown> = {};
  if (version !== undefined)     updates.version = version;
  if (title !== undefined)       updates.title = title;
  if (description !== undefined) updates.description = description;
  if (type !== undefined)        updates.type = type;
  if (releaseDate !== undefined) updates.releaseDate = new Date(releaseDate);

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  const [entry] = await db
    .update(toolChangelogsTable)
    .set(updates as any)
    .where(eq(toolChangelogsTable.id, id))
    .returning();
  if (!entry) return res.status(404).json({ error: "Changelog entry not found" });

  log.info({ adminAction: "update_changelog", entryId: id, by: req.userId });
  return res.json(entry);
});

router.delete("/admin/changelog/:id", requireAdmin, async (req: any, res) => {
  const log: Logger = req.log;
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const [entry] = await db
    .delete(toolChangelogsTable)
    .where(eq(toolChangelogsTable.id, id))
    .returning();
  if (!entry) return res.status(404).json({ error: "Changelog entry not found" });

  log.info({ adminAction: "delete_changelog", entryId: id, by: req.userId });
  return res.status(204).send();
});

// ── COMMENTS ─────────────────────────────────────────────────────────────────

router.get("/admin/comments", requireAdmin, async (_req, res) => {
  const comments = await db
    .select({
      id: toolCommentsTable.id,
      toolId: toolCommentsTable.toolId,
      toolName: toolsTable.name,
      toolSlug: toolsTable.slug,
      userId: toolCommentsTable.userId,
      userDisplayName: toolCommentsTable.userDisplayName,
      content: toolCommentsTable.content,
      createdAt: toolCommentsTable.createdAt,
    })
    .from(toolCommentsTable)
    .leftJoin(toolsTable, eq(toolCommentsTable.toolId, toolsTable.id))
    .orderBy(desc(toolCommentsTable.createdAt));

  return res.json(comments);
});

router.delete("/admin/comments/:id", requireAdmin, async (req: any, res) => {
  const log: Logger = req.log;
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const [comment] = await db
    .delete(toolCommentsTable)
    .where(eq(toolCommentsTable.id, id))
    .returning();
  if (!comment) return res.status(404).json({ error: "Comment not found" });

  log.info({ adminAction: "delete_comment", commentId: id, toolId: comment.toolId, by: req.userId });
  return res.status(204).send();
});

export default router;
