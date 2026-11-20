import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { clerkServerEnabled } from "@/auth/config";
import { box } from "@/boxes/aitoolbox/config";
import { loadItems } from "@/boxes/aitoolbox/load";
import { readValues } from "@/engine/access";
import { applySavedChange, readSaveBody, readSavedSlugs } from "@/engine/saved";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const savedBox = { id: box.id, noun: box.item.noun };

function knownSlugs(): Set<string> {
  const slugs = new Set<string>();
  for (const item of loadItems()) {
    const slug = readValues(item, box.item.slugField)[0];
    if (slug) slugs.add(slug);
  }
  return slugs;
}

function signIn() {
  return NextResponse.json({ error: "Sign in to save." }, { status: 401 });
}

export async function GET() {
  if (!clerkServerEnabled()) return signIn();
  try {
    const { userId } = await auth();
    if (!userId) return signIn();
    const user = await (await clerkClient()).users.getUser(userId);
    return NextResponse.json({ slugs: readSavedSlugs(user.privateMetadata, box.id) });
  } catch {
    return NextResponse.json({ error: "Could not load saved records." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!clerkServerEnabled()) return signIn();
  const body = await request.json().catch(() => null);
  const parsed = readSaveBody(body);
  if ("error" in parsed) return NextResponse.json(parsed, { status: 400 });
  try {
    const { userId } = await auth();
    if (!userId) return signIn();
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const next = applySavedChange(user.privateMetadata, savedBox, parsed.slug, parsed.action, knownSlugs());
    if ("error" in next) return NextResponse.json(next, { status: 400 });
    await client.users.replaceUserMetadata(userId, { privateMetadata: next.metadata });
    return NextResponse.json({ slugs: next.slugs });
  } catch {
    return NextResponse.json({ error: "Could not save." }, { status: 500 });
  }
}
