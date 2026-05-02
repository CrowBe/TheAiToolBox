import { Router } from "express";
import { db } from "@workspace/db";
import { toolsTable, categoriesTable, ratingsTable } from "@workspace/db";
import { eq, ilike, and, sql, avg, count, desc } from "drizzle-orm";
import {
  ListToolsQueryParams,
  GetToolParams,
  GetToolsByCategoryQueryParams,
} from "@workspace/api-zod";

const router = Router();

function buildToolResponse(tool: typeof toolsTable.$inferSelect, category: typeof categoriesTable.$inferSelect, avgRating: number, ratingCount: number) {
  return {
    id: tool.id,
    slug: tool.slug,
    name: tool.name,
    tagline: tool.tagline,
    description: tool.description,
    websiteUrl: tool.websiteUrl,
    logoUrl: tool.logoUrl,
    categoryId: tool.categoryId,
    categoryName: category.name,
    categorySlug: category.slug,
    hasFree: tool.hasFree,
    pricingModel: tool.pricingModel,
    launchedYear: tool.launchedYear,
    averageRating: avgRating,
    ratingCount: ratingCount,
    roles: tool.roles,
    tags: tool.tags,
    accentColor: tool.accentColor,
  };
}

router.get("/tools", async (req, res) => {
  const parsed = ListToolsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid query params" });
  }
  const { category, role, hasFree, search, sortBy } = parsed.data;

  const conditions = [];

  if (category) {
    const cat = await db.select().from(categoriesTable).where(eq(categoriesTable.slug, category)).limit(1);
    if (cat.length > 0) {
      conditions.push(eq(toolsTable.categoryId, cat[0].id));
    }
  }

  if (hasFree === true || hasFree === "true" as unknown) {
    conditions.push(eq(toolsTable.hasFree, true));
  }

  if (search) {
    conditions.push(
      sql`(${toolsTable.name} ILIKE ${'%' + search + '%'} OR ${toolsTable.tagline} ILIKE ${'%' + search + '%'} OR ${toolsTable.description} ILIKE ${'%' + search + '%'})`
    );
  }

  const toolsList = await db
    .select()
    .from(toolsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  const categories = await db.select().from(categoriesTable);
  const catMap = new Map(categories.map((c) => [c.id, c]));

  const ratingAggs = await db
    .select({
      toolId: ratingsTable.toolId,
      avg: avg(ratingsTable.score),
      cnt: count(ratingsTable.id),
    })
    .from(ratingsTable)
    .groupBy(ratingsTable.toolId);

  const ratingMap = new Map(ratingAggs.map((r) => [r.toolId, { avg: parseFloat(r.avg ?? "0"), cnt: Number(r.cnt) }]));

  let results = toolsList
    .filter((tool) => {
      if (role && !tool.roles.includes(role)) return false;
      return true;
    })
    .map((tool) => {
      const cat = catMap.get(tool.categoryId)!;
      const rating = ratingMap.get(tool.id) ?? { avg: 0, cnt: 0 };
      return buildToolResponse(tool, cat, rating.avg, rating.cnt);
    });

  if (sortBy === "rating") {
    results.sort((a, b) => b.averageRating - a.averageRating);
  } else if (sortBy === "newest") {
    results.sort((a, b) => b.launchedYear - a.launchedYear);
  } else {
    results.sort((a, b) => a.name.localeCompare(b.name));
  }

  return res.json(results);
});

router.get("/tools/stats/summary", async (req, res) => {
  const tools = await db.select().from(toolsTable);
  const categories = await db.select().from(categoriesTable);
  const catMap = new Map(categories.map((c) => [c.id, c]));

  const ratingAggs = await db
    .select({
      toolId: ratingsTable.toolId,
      avg: avg(ratingsTable.score),
      cnt: count(ratingsTable.id),
    })
    .from(ratingsTable)
    .groupBy(ratingsTable.toolId);
  const ratingMap = new Map(ratingAggs.map((r) => [r.toolId, { avg: parseFloat(r.avg ?? "0"), cnt: Number(r.cnt) }]));

  const totalFreeTools = tools.filter((t) => t.hasFree).length;
  const toolsByPricingModel: Record<string, number> = {};
  for (const t of tools) {
    toolsByPricingModel[t.pricingModel] = (toolsByPricingModel[t.pricingModel] ?? 0) + 1;
  }

  const mapped = tools.map((tool) => {
    const cat = catMap.get(tool.categoryId)!;
    const rating = ratingMap.get(tool.id) ?? { avg: 0, cnt: 0 };
    return buildToolResponse(tool, cat, rating.avg, rating.cnt);
  });

  const newestTools = [...mapped].sort((a, b) => b.launchedYear - a.launchedYear).slice(0, 5);
  const topRatedTools = [...mapped].sort((a, b) => b.averageRating - a.averageRating || b.ratingCount - a.ratingCount).slice(0, 5);

  return res.json({
    totalTools: tools.length,
    totalCategories: categories.length,
    totalFreeTools,
    newestTools,
    topRatedTools,
    toolsByPricingModel,
  });
});

router.get("/tools/by-category", async (req, res) => {
  const parsed = GetToolsByCategoryQueryParams.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid query params" });
  }
  const { role, hasFree } = parsed.data;

  const categories = await db.select().from(categoriesTable);
  const tools = await db.select().from(toolsTable);

  const ratingAggs = await db
    .select({
      toolId: ratingsTable.toolId,
      avg: avg(ratingsTable.score),
      cnt: count(ratingsTable.id),
    })
    .from(ratingsTable)
    .groupBy(ratingsTable.toolId);
  const ratingMap = new Map(ratingAggs.map((r) => [r.toolId, { avg: parseFloat(r.avg ?? "0"), cnt: Number(r.cnt) }]));

  const catMap = new Map(categories.map((c) => [c.id, c]));

  const result = categories.map((cat) => {
    let catTools = tools.filter((t) => t.categoryId === cat.id);

    if (role) {
      catTools = catTools.filter((t) => t.roles.includes(role));
    }
    if (hasFree === true || (hasFree as unknown) === "true") {
      catTools = catTools.filter((t) => t.hasFree);
    }

    return {
      categoryId: cat.id,
      categoryName: cat.name,
      categorySlug: cat.slug,
      categoryDescription: cat.description,
      tools: catTools.map((tool) => {
        const rating = ratingMap.get(tool.id) ?? { avg: 0, cnt: 0 };
        return buildToolResponse(tool, catMap.get(tool.categoryId)!, rating.avg, rating.cnt);
      }),
    };
  }).filter((g) => g.tools.length > 0);

  return res.json(result);
});

router.get("/tools/:slug", async (req, res) => {
  const parsed = GetToolParams.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid params" });
  }
  const { slug } = parsed.data;

  const [tool] = await db.select().from(toolsTable).where(eq(toolsTable.slug, slug)).limit(1);
  if (!tool) {
    return res.status(404).json({ error: "Tool not found" });
  }

  const [category] = await db.select().from(categoriesTable).where(eq(categoriesTable.id, tool.categoryId)).limit(1);

  const ratingAgg = await db
    .select({ avg: avg(ratingsTable.score), cnt: count(ratingsTable.id) })
    .from(ratingsTable)
    .where(eq(ratingsTable.toolId, tool.id));

  const avgRating = parseFloat(ratingAgg[0]?.avg ?? "0");
  const ratingCount = Number(ratingAgg[0]?.cnt ?? 0);

  const alternativeToolsList = await db
    .select()
    .from(toolsTable)
    .where(and(eq(toolsTable.categoryId, tool.categoryId), sql`${toolsTable.id} != ${tool.id}`))
    .limit(4);

  const altRatingAggs = await db
    .select({ toolId: ratingsTable.toolId, avg: avg(ratingsTable.score), cnt: count(ratingsTable.id) })
    .from(ratingsTable)
    .groupBy(ratingsTable.toolId);
  const altRatingMap = new Map(altRatingAggs.map((r) => [r.toolId, { avg: parseFloat(r.avg ?? "0"), cnt: Number(r.cnt) }]));

  const alternativeTools = alternativeToolsList.map((t) => {
    const r = altRatingMap.get(t.id) ?? { avg: 0, cnt: 0 };
    return buildToolResponse(t, category, r.avg, r.cnt);
  });

  return res.json({
    ...buildToolResponse(tool, category, avgRating, ratingCount),
    pricingDetails: tool.pricingDetails,
    securityAnalysis: tool.securityAnalysis,
    securityScore: tool.securityScore,
    dataPrivacyNotes: tool.dataPrivacyNotes,
    complianceBadges: tool.complianceBadges,
    alternativeTools,
  });
});

export default router;
