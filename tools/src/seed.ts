import { db, pool } from "@workspace/db";
import { categoriesTable, rolesTable, toolsTable } from "@workspace/db";
import { CATEGORIES } from "./data/categories";
import { ROLES } from "./data/roles";
import { TOOLS } from "./data/tools";

async function seed() {
  console.log("🌱 Starting database seed...\n");

  // 1. Upsert categories
  console.log(`📂 Seeding ${CATEGORIES.length} categories...`);
  const insertedCategories = await db
    .insert(categoriesTable)
    .values(CATEGORIES)
    .onConflictDoUpdate({
      target: categoriesTable.slug,
      set: {
        name: categoriesTable.name,
        description: categoriesTable.description,
        icon: categoriesTable.icon,
      },
    })
    .returning({ id: categoriesTable.id, slug: categoriesTable.slug });

  const categoryIdBySlug = new Map(insertedCategories.map((c) => [c.slug, c.id]));
  console.log(`   ✓ ${insertedCategories.length} categories upserted\n`);

  // 2. Upsert roles
  console.log(`👤 Seeding ${ROLES.length} roles...`);
  const insertedRoles = await db
    .insert(rolesTable)
    .values(ROLES)
    .onConflictDoUpdate({
      target: rolesTable.slug,
      set: {
        name: rolesTable.name,
        description: rolesTable.description,
      },
    })
    .returning({ id: rolesTable.id, slug: rolesTable.slug });
  console.log(`   ✓ ${insertedRoles.length} roles upserted\n`);

  // 3. Upsert tools
  console.log(`🔧 Seeding ${TOOLS.length} tools...`);
  let toolsImported = 0;
  const toolErrors: string[] = [];

  for (const tool of TOOLS) {
    const categoryId = categoryIdBySlug.get(tool.categorySlug);
    if (!categoryId) {
      toolErrors.push(`Tool "${tool.slug}": unknown categorySlug "${tool.categorySlug}"`);
      continue;
    }

    try {
      await db
        .insert(toolsTable)
        .values({
          slug: tool.slug,
          name: tool.name,
          tagline: tool.tagline,
          description: tool.description,
          websiteUrl: tool.websiteUrl,
          logoUrl: tool.logoUrl,
          categoryId,
          hasFree: tool.hasFree,
          pricingModel: tool.pricingModel,
          pricingDetails: tool.pricingDetails,
          launchedYear: tool.launchedYear,
          roles: tool.roles,
          tags: tool.tags,
          accentColor: tool.accentColor,
          securityScore: tool.securityScore,
          securityAnalysis: tool.securityAnalysis,
          dataPrivacyNotes: tool.dataPrivacyNotes,
          complianceBadges: tool.complianceBadges,
        })
        .onConflictDoUpdate({
          target: toolsTable.slug,
          set: {
            name: tool.name,
            tagline: tool.tagline,
            description: tool.description,
            websiteUrl: tool.websiteUrl,
            logoUrl: tool.logoUrl,
            categoryId,
            hasFree: tool.hasFree,
            pricingModel: tool.pricingModel,
            pricingDetails: tool.pricingDetails,
            launchedYear: tool.launchedYear,
            roles: tool.roles,
            tags: tool.tags,
            accentColor: tool.accentColor,
            securityScore: tool.securityScore,
            securityAnalysis: tool.securityAnalysis,
            dataPrivacyNotes: tool.dataPrivacyNotes,
            complianceBadges: tool.complianceBadges,
          },
        });
      toolsImported++;
    } catch (err: any) {
      toolErrors.push(`Tool "${tool.slug}": ${err.message}`);
    }
  }

  console.log(`   ✓ ${toolsImported}/${TOOLS.length} tools upserted`);
  if (toolErrors.length > 0) {
    console.error(`   ✗ ${toolErrors.length} errors:`);
    toolErrors.forEach((e) => console.error(`     - ${e}`));
  }

  console.log("\n✅ Seed complete!");
  console.log(`   Categories: ${insertedCategories.length}`);
  console.log(`   Roles:      ${insertedRoles.length}`);
  console.log(`   Tools:      ${toolsImported}`);
}

seed()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => pool.end());
