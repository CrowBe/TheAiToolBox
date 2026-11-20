import type { Metadata } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ClerkSession } from "@/auth/clerk-session";
import { clerkEnabled } from "@/auth/config";
import { box } from "@/boxes/aitoolbox/config";
import { loadItems } from "@/boxes/aitoolbox/load";
import { CatalogTools } from "@/engine/ui/agent";
import { SiteFrame } from "@/engine/ui/frame";
import { CatalogPalette } from "@/engine/ui/palette";
import { AccountSlot, SavedSession } from "@/engine/ui/session";
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

const signInPath = "/sign-in";

export const metadata: Metadata = {
  title: {
    default: box.site.name,
    template: `%s · ${box.site.shortName}`,
  },
  description: box.site.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const items = loadItems();
  const enabled = clerkEnabled();
  const frame = (
    <>
      <CatalogTools box={box} items={items} />
      <SiteFrame
        box={box}
        accountSlot={<AccountSlot />}
        command={<CatalogPalette box={box} items={items} />}
      >
        {children}
      </SiteFrame>
    </>
  );

  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        {enabled ? (
          <ClerkProvider dynamic={false} signInUrl={signInPath} signUpUrl={signInPath}>
            <ClerkSession box={box} items={items} signInPath={signInPath}>
              {frame}
            </ClerkSession>
          </ClerkProvider>
        ) : (
          <SavedSession box={box} items={items} auth="off" signInPath={signInPath}>
            {frame}
          </SavedSession>
        )}
      </body>
    </html>
  );
}
