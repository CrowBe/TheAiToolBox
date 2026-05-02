import { Router } from "express";
import { db } from "@workspace/db";
import { ratingsTable } from "@workspace/db";
import { eq, avg, count, desc } from "drizzle-orm";
import { GetToolRatingsParams, SubmitRatingParams, SubmitRatingBody } from "@workspace/api-zod";

const router = Router();

router.get("/ratings/:toolId", async (req, res) => {
  const parsedParams = GetToolRatingsParams.safeParse(req.params);
  if (!parsedParams.success) {
    return res.status(400).json({ error: "Invalid params" });
  }

  const toolId = Number(parsedParams.data.toolId);

  const [agg] = await db
    .select({ avg: avg(ratingsTable.score), cnt: count(ratingsTable.id) })
    .from(ratingsTable)
    .where(eq(ratingsTable.toolId, toolId));

  const recentReviews = await db
    .select()
    .from(ratingsTable)
    .where(eq(ratingsTable.toolId, toolId))
    .orderBy(desc(ratingsTable.createdAt))
    .limit(10);

  const distribution: Record<string, number> = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
  const allRatings = await db.select().from(ratingsTable).where(eq(ratingsTable.toolId, toolId));
  for (const r of allRatings) {
    distribution[String(r.score)] = (distribution[String(r.score)] ?? 0) + 1;
  }

  return res.json({
    toolId,
    averageRating: parseFloat(agg?.avg ?? "0"),
    totalRatings: Number(agg?.cnt ?? 0),
    distribution,
    recentReviews: recentReviews.map((r) => ({
      id: r.id,
      toolId: r.toolId,
      score: r.score,
      review: r.review,
      createdAt: r.createdAt.toISOString(),
    })),
  });
});

router.post("/ratings/:toolId", async (req, res) => {
  const parsedParams = SubmitRatingParams.safeParse(req.params);
  const parsedBody = SubmitRatingBody.safeParse(req.body);

  if (!parsedParams.success || !parsedBody.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const toolId = Number(parsedParams.data.toolId);
  const { score, review } = parsedBody.data;

  const [rating] = await db
    .insert(ratingsTable)
    .values({ toolId, score, review: review ?? null })
    .returning();

  return res.status(201).json({
    id: rating.id,
    toolId: rating.toolId,
    score: rating.score,
    review: rating.review,
    createdAt: rating.createdAt.toISOString(),
  });
});

export default router;
