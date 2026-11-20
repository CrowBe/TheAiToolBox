export function clerkEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim());
}

export function clerkServerEnabled(): boolean {
  return clerkEnabled() && Boolean(process.env.CLERK_SECRET_KEY?.trim());
}
