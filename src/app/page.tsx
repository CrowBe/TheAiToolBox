import { box } from "@/boxes/aitoolbox/config";
import { loadItems } from "@/boxes/aitoolbox/load";
import { CatalogHome } from "@/engine/ui/home";

export const dynamic = "force-static";

export default function HomePage() {
  return <CatalogHome box={box} items={loadItems()} />;
}
