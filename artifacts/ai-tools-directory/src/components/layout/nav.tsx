import { Link, useLocation } from "wouter";
import { Search, Compass, Grid, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Nav() {
  const [location] = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center px-4">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="hidden font-bold sm:inline-block">
            AI Directory
          </span>
        </Link>
        <div className="flex flex-1 items-center space-x-2 justify-end">
          <nav className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className={cn("h-9", location === "/browse" && "bg-muted")}
            >
              <Link href="/browse">
                <Grid className="h-4 w-4 mr-2" />
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
                <Search className="h-4 w-4 mr-2" />
                AI Search
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </nav>
  );
}
