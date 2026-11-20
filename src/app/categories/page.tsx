import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { box } from "@/boxes/aitoolbox/config";
import { loadItems } from "@/boxes/aitoolbox/load";
import { CollectionIndex } from "@/engine/ui/collection";

export const dynamic = "force-static";

const collection = box.collections.find((item) => item.path === "/categories");

export const metadata: Metadata = {
  title: collection?.label ?? "Categories",
  description: collection
    ? `Browse ${box.site.shortName} by ${collection.label.toLowerCase()}.`
    : box.site.description,
};

export default function CategoriesPage() {
  if (!collection) notFound();
  return <CollectionIndex box={box} items={loadItems()} collection={collection} />;
}
