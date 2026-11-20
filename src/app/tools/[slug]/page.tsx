import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { box } from "@/boxes/aitoolbox/config";
import { loadItems } from "@/boxes/aitoolbox/load";
import { readValues } from "@/engine/access";
import { DetailView } from "@/engine/ui/detail";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return loadItems().flatMap((item) => {
    const slug = readValues(item, box.item.slugField)[0];
    return slug ? [{ slug }] : [];
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = findItem(slug);
  if (!item) return { title: "Not found" };
  return {
    title: readValues(item, box.detail.titleField)[0] ?? slug,
    description: readValues(item, box.card.subtitleField)[0],
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = findItem(slug);
  if (!item) notFound();
  return <DetailView box={box} item={item} />;
}

function findItem(slug: string) {
  return loadItems().find((item) => readValues(item, box.item.slugField)[0] === slug);
}
