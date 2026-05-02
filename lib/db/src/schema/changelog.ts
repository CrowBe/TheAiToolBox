import { pgTable, serial, integer, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { toolsTable } from "./tools";

export const changelogTypeEnum = pgEnum("changelog_type", ["feature", "improvement", "fix", "breaking"]);

export const toolChangelogsTable = pgTable("tool_changelogs", {
  id: serial("id").primaryKey(),
  toolId: integer("tool_id").notNull().references(() => toolsTable.id, { onDelete: "cascade" }),
  version: text("version").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: changelogTypeEnum("type").notNull().default("feature"),
  releaseDate: timestamp("release_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ToolChangelog = typeof toolChangelogsTable.$inferSelect;
