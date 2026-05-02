import { Link, useLocation } from "wouter";
import { Search, Grid, Wrench, LogIn, LogOut, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Show, useUser, useClerk } from "@clerk/react";

export function Nav() {
  const [location] = useLocation();
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center px-4">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Wrench className="h-5 w-5 text-primary" />
          <span className="hidden font-bold sm:inline-block tracking-tight">
            AITools
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-1">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={cn("h-9", location === "/browse" && "bg-muted")}
          >
            <Link href="/browse">
              <Grid className="h-4 w-4 mr-1.5" />
              Browse
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={cn("h-9", location === "/search" && "bg-muted")}
          >
            <Link href="/search">
              <Search className="h-4 w-4 mr-1.5" />
              AI Search
            </Link>
          </Button>

          <Show when="signed-in">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className={cn("h-9", location === "/toolbox" && "bg-muted text-primary")}
            >
              <Link href="/toolbox">
                <Wrench className="h-4 w-4 mr-1.5" />
                My Toolbox
              </Link>
            </Button>
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border/40">
              <span className="hidden md:block text-xs text-muted-foreground truncate max-w-[120px]">
                {user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 text-muted-foreground hover:text-foreground"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Sign out</span>
              </Button>
            </div>
          </Show>

          <Show when="signed-out">
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border/40">
              <Button variant="ghost" size="sm" className="h-9" asChild>
                <Link href="/sign-in">
                  <LogIn className="h-4 w-4 mr-1.5" />
                  Sign in
                </Link>
              </Button>
              <Button size="sm" className="h-9 bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link href="/sign-up">
                  Fill My Toolbox
                </Link>
              </Button>
            </div>
          </Show>
        </div>
      </div>
    </nav>
  );
}
