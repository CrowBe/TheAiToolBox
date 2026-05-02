import { pgTable, serial, integer, text, timestamp, unique } from "drizzle-orm/pg-core";
import { toolsTable } from "./tools";

export const toolboxItemsTable = pgTable("toolbox_items", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  toolId: integer("tool_id").notNull().references(() => toolsTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userToolUnique: unique("toolbox_user_tool_unique").on(table.userId, table.toolId),
}));

export type ToolboxItem = typeof toolboxItemsTable.$inferSelect;
