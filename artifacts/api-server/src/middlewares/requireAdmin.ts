import { getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";

export function getAdminUserIds(): Set<string> {
  const raw = process.env.ADMIN_USER_IDS ?? "";
  return new Set(
    raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );
}

export function isAdminUser(userId: string): boolean {
  const admins = getAdminUserIds();
  if (admins.size === 0) return false;
  return admins.has(userId);
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!isAdminUser(userId)) {
    return res.status(403).json({ error: "Forbidden: admin access required" });
  }
  (req as any).userId = userId;
  next();
}
