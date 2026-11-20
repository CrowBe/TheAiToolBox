import { clerkMiddleware } from "@clerk/nextjs/server";
import { type NextFetchEvent, type NextRequest, NextResponse } from "next/server";
import { clerkServerEnabled } from "@/auth/config";

const clerk = clerkMiddleware();

export function proxy(request: NextRequest, event: NextFetchEvent) {
  if (!clerkServerEnabled()) return NextResponse.next();
  return clerk(request, event);
}

export const config = {
  matcher: ["/api/saved", "/api/saved/:path*"],
};
