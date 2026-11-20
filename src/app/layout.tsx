import type { Metadata } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import { AccountSlot, AuthBoundary, getViewer } from "@/auth";
import { box } from "@/boxes/aitoolbox/config";
import { loadItems } from "@/boxes/aitoolbox/load";
import { CatalogTools } from "@/engine/ui/agent";
import { SiteFrame } from "@/engine/ui/frame";
import { CatalogPalette } from "@/engine/ui/palette";
import "./globals.css";

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: box.site.name,
    template: `%s · ${box.site.shortName}`,
  },
  description: box.site.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const viewer = getViewer();
  const items = loadItems();
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <AuthBoundary>
          <CatalogTools box={box} items={items} />
          <SiteFrame
            box={box}
            accountSlot={<AccountSlot viewer={viewer} />}
            command={<CatalogPalette box={box} items={items} />}
          >
            {children}
          </SiteFrame>
        </AuthBoundary>
      </body>
    </html>
  );
}
