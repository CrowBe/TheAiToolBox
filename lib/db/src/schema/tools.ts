import { pgTable, serial, text, boolean, integer, real, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { categoriesTable } from "./categories";

export const pricingModelEnum = pgEnum("pricing_model", ["free", "freemium", "paid", "enterprise", "open_source"]);

export const toolsTable = pgTable("tools", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  websiteUrl: text("website_url").notNull(),
  logoUrl: text("logo_url").notNull(),
  categoryId: integer("category_id").notNull().references(() => categoriesTable.id),
  hasFree: boolean("has_free").notNull().default(false),
  pricingModel: pricingModelEnum("pricing_model").notNull().default("paid"),
  pricingDetails: text("pricing_details").notNull().default(""),
  launchedYear: integer("launched_year").notNull(),
  roles: text("roles").array().notNull().default([]),
  tags: text("tags").array().notNull().default([]),
  accentColor: text("accent_color").notNull().default("#6366f1"),
  securityAnalysis: text("security_analysis").notNull().default(""),
  securityScore: integer("security_score").notNull().default(50),
  dataPrivacyNotes: text("data_privacy_notes").notNull().default(""),
  complianceBadges: text("compliance_badges").array().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertToolSchema = createInsertSchema(toolsTable).omit({ id: true, createdAt: true });
export type InsertTool = z.infer<typeof insertToolSchema>;
export type Tool = typeof toolsTable.$inferSelect;
