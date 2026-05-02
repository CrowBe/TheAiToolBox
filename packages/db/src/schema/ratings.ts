import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { toolsTable } from "./tools";

export const ratingsTable = pgTable("ratings", {
  id: serial("id").primaryKey(),
  toolId: integer("tool_id").notNull().references(() => toolsTable.id),
  score: integer("score").notNull(),
  review: text("review"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRatingSchema = createInsertSchema(ratingsTable).omit({ id: true, createdAt: true });
export type InsertRating = z.infer<typeof insertRatingSchema>;
export type Rating = typeof ratingsTable.$inferSelect;
