import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { toolsTable, toolCommentsTable } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";

const router = Router();

function requireAuth(req: any, res: any, next: any) {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  req.userId = userId;
  next();
}

router.get("/tools/:slug/comments", async (req, res) => {
  const { slug } = req.params;

  const [tool] = await db.select().from(toolsTable).where(eq(toolsTable.slug, slug)).limit(1);
  if (!tool) return res.status(404).json({ error: "Tool not found" });

  const comments = await db
    .select()
    .from(toolCommentsTable)
    .where(eq(toolCommentsTable.toolId, tool.id))
    .orderBy(desc(toolCommentsTable.createdAt));

  return res.json(
    comments.map((c) => ({
      id: c.id,
      toolId: c.toolId,
      userId: c.userId,
      userDisplayName: c.userDisplayName,
      content: c.content,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }))
  );
});

router.post("/tools/:slug/comments", requireAuth, async (req: any, res) => {
  const { slug } = req.params;
  const userId: string = req.userId;

  const [tool] = await db.select().from(toolsTable).where(eq(toolsTable.slug, slug)).limit(1);
  if (!tool) return res.status(404).json({ error: "Tool not found" });

  const content = typeof req.body?.content === "string" ? req.body.content.trim() : "";
  const userDisplayName = typeof req.body?.userDisplayName === "string"
    ? req.body.userDisplayName.trim().slice(0, 100) || "Anonymous"
    : "Anonymous";

  if (!content || content.length > 2000) {
    return res.status(400).json({ error: "content must be 1–2000 characters" });
  }

  const [comment] = await db
    .insert(toolCommentsTable)
    .values({ toolId: tool.id, userId, userDisplayName, content })
    .returning();

  return res.status(201).json({
    id: comment.id,
    toolId: comment.toolId,
    userId: comment.userId,
    userDisplayName: comment.userDisplayName,
    content: comment.content,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  });
});

router.delete("/tools/:slug/comments/:commentId", requireAuth, async (req: any, res) => {
  const { slug, commentId } = req.params;
  const userId: string = req.userId;

  const [tool] = await db.select().from(toolsTable).where(eq(toolsTable.slug, slug)).limit(1);
  if (!tool) return res.status(404).json({ error: "Tool not found" });

  const id = parseInt(commentId, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid comment ID" });

  const [existing] = await db
    .select()
    .from(toolCommentsTable)
    .where(and(eq(toolCommentsTable.id, id), eq(toolCommentsTable.toolId, tool.id)))
    .limit(1);

  if (!existing) return res.status(404).json({ error: "Comment not found" });
  if (existing.userId !== userId) return res.status(403).json({ error: "Forbidden" });

  await db.delete(toolCommentsTable).where(eq(toolCommentsTable.id, id));
  return res.status(204).send();
});

export default router;
