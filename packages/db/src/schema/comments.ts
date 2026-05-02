import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { toolsTable } from "./tools";

export const toolCommentsTable = pgTable("tool_comments", {
  id: serial("id").primaryKey(),
  toolId: integer("tool_id").notNull().references(() => toolsTable.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  userDisplayName: text("user_display_name").notNull().default("Anonymous"),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ToolComment = typeof toolCommentsTable.$inferSelect;
