import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { toolboxItemsTable, toolsTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import { categoriesTable } from "@workspace/db/schema";

const router = Router();

function requireAuth(req: any, res: any, next: any) {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.userId = userId;
  next();
}

router.get("/toolbox", requireAuth, async (req: any, res) => {
  try {
    const items = await db
      .select({
        id: toolboxItemsTable.id,
        toolId: toolboxItemsTable.toolId,
        userId: toolboxItemsTable.userId,
        addedAt: toolboxItemsTable.createdAt,
        tool: {
          id: toolsTable.id,
          slug: toolsTable.slug,
          name: toolsTable.name,
          tagline: toolsTable.tagline,
          description: toolsTable.description,
          websiteUrl: toolsTable.websiteUrl,
          logoUrl: toolsTable.logoUrl,
          categoryId: toolsTable.categoryId,
          hasFree: toolsTable.hasFree,
          pricingModel: toolsTable.pricingModel,
          launchedYear: toolsTable.launchedYear,
          roles: toolsTable.roles,
          tags: toolsTable.tags,
          accentColor: toolsTable.accentColor,
          categoryName: categoriesTable.name,
          categorySlug: categoriesTable.slug,
        },
      })
      .from(toolboxItemsTable)
      .innerJoin(toolsTable, eq(toolboxItemsTable.toolId, toolsTable.id))
      .innerJoin(categoriesTable, eq(toolsTable.categoryId, categoriesTable.id))
      .where(eq(toolboxItemsTable.userId, req.userId));

    const result = items.map((item) => ({
      ...item,
      tool: {
        ...item.tool,
        averageRating: 0,
        ratingCount: 0,
      },
    }));

    res.json(result);
  } catch (err) {
    req.log.error(err, "Failed to get toolbox");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/toolbox/:toolId", requireAuth, async (req: any, res) => {
  const toolId = parseInt(req.params.toolId);
  if (isNaN(toolId)) return res.status(400).json({ error: "Invalid tool ID" });

  try {
    const [tool] = await db.select().from(toolsTable).where(eq(toolsTable.id, toolId)).limit(1);
    if (!tool) return res.status(404).json({ error: "Tool not found" });

    const [existing] = await db
      .select()
      .from(toolboxItemsTable)
      .where(and(eq(toolboxItemsTable.userId, req.userId), eq(toolboxItemsTable.toolId, toolId)))
      .limit(1);

    if (existing) return res.status(409).json({ error: "Tool already in toolbox" });

    const [item] = await db
      .insert(toolboxItemsTable)
      .values({ userId: req.userId, toolId })
      .returning();

    const [cat] = await db.select().from(categoriesTable).where(eq(categoriesTable.id, tool.categoryId)).limit(1);

    res.status(201).json({
      id: item.id,
      toolId: item.toolId,
      userId: item.userId,
      addedAt: item.createdAt,
      tool: {
        ...tool,
        categoryName: cat?.name ?? "",
        categorySlug: cat?.slug ?? "",
        averageRating: 0,
        ratingCount: 0,
      },
    });
  } catch (err) {
    req.log.error(err, "Failed to add to toolbox");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/toolbox/:toolId", requireAuth, async (req: any, res) => {
  const toolId = parseInt(req.params.toolId);
  if (isNaN(toolId)) return res.status(400).json({ error: "Invalid tool ID" });

  try {
    const deleted = await db
      .delete(toolboxItemsTable)
      .where(and(eq(toolboxItemsTable.userId, req.userId), eq(toolboxItemsTable.toolId, toolId)))
      .returning();

    if (deleted.length === 0) return res.status(404).json({ error: "Tool not in toolbox" });

    res.status(204).send();
  } catch (err) {
    req.log.error(err, "Failed to remove from toolbox");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
