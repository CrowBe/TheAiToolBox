import { Router } from "express";
import { db } from "@workspace/db";
import { rolesTable } from "@workspace/db";

const router = Router();

router.get("/roles", async (req, res) => {
  const roles = await db.select().from(rolesTable);
  return res.json(
    roles.map((r) => ({
      id: r.id,
      slug: r.slug,
      name: r.name,
      description: r.description,
    }))
  );
});

export default router;
