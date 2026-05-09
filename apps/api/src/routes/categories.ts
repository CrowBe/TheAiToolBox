import { Router } from "express";
import { db } from "@workspace/db";
import { categoriesTable, toolsTable } from "@workspace/db";
import { asc, count } from "drizzle-orm";

const router = Router();

router.get("/categories", async (req, res) => {
  const categories = await db
    .select()
    .from(categoriesTable)
    .orderBy(asc(categoriesTable.sortOrder), asc(categoriesTable.name));

  const toolCounts = await db
    .select({ categoryId: toolsTable.categoryId, cnt: count(toolsTable.id) })
    .from(toolsTable)
    .groupBy(toolsTable.categoryId);

  const countMap = new Map(toolCounts.map((r) => [r.categoryId, Number(r.cnt)]));

  return res.json(
    categories.map((cat) => ({
      id: cat.id,
      slug: cat.slug,
      name: cat.name,
      description: cat.description,
      toolCount: countMap.get(cat.id) ?? 0,
      icon: cat.icon,
      sortOrder: cat.sortOrder,
      featured: cat.featured,
    }))
  );
});

export default router;
