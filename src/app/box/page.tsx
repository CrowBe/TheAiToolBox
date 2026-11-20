import type { Metadata } from "next";
import { box } from "@/boxes/aitoolbox/config";
import { loadItems } from "@/boxes/aitoolbox/load";
import { LibraryView } from "@/engine/ui/library";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: box.library.label,
  description: `Saved ${box.item.noun.other} in ${box.site.shortName}.`,
};

export default function LibraryPage() {
  return <LibraryView box={box} items={loadItems()} />;
}
