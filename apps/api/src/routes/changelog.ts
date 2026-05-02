import { Router } from "express";
import { db } from "@workspace/db";
import { toolsTable, toolChangelogsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/tools/:slug/changelog", async (req, res) => {
  const { slug } = req.params;

  const [tool] = await db.select().from(toolsTable).where(eq(toolsTable.slug, slug)).limit(1);
  if (!tool) {
    return res.status(404).json({ error: "Tool not found" });
  }

  const entries = await db
    .select()
    .from(toolChangelogsTable)
    .where(eq(toolChangelogsTable.toolId, tool.id))
    .orderBy(desc(toolChangelogsTable.releaseDate));

  return res.json(
    entries.map((e) => ({
      id: e.id,
      toolId: e.toolId,
      version: e.version,
      title: e.title,
      description: e.description,
      type: e.type,
      releaseDate: e.releaseDate,
    }))
  );
});

export default router;
