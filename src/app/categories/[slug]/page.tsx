import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { box } from "@/boxes/aitoolbox/config";
import { loadItems } from "@/boxes/aitoolbox/load";
import { CollectionPage } from "@/engine/ui/collection";

export const dynamic = "force-static";
export const dynamicParams = false;

const collection = box.collections.find((item) => item.path === "/categories");

export function generateStaticParams() {
  if (!collection) return [];
  return (box.vocabularies[collection.vocabulary] ?? []).map((entry) => ({ slug: entry.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = (collection ? (box.vocabularies[collection.vocabulary] ?? []) : []).find(
    (item) => item.id === slug,
  );
  if (!entry) return { title: "Not found" };
  return { title: entry.label, description: entry.description };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!collection) notFound();
  const { slug } = await params;
  const entry = (box.vocabularies[collection.vocabulary] ?? []).find((item) => item.id === slug);
  if (!entry) notFound();
  return <CollectionPage box={box} items={loadItems()} collection={collection} entry={entry} />;
}
