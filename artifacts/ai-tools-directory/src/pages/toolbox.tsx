import { useGetToolbox, useRemoveFromToolbox } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Wrench, ExternalLink, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getLogoUrl } from "@/lib/utils";
import { useUser } from "@clerk/react";

export function Toolbox() {
  const { user } = useUser();
  const { data: items, isLoading, refetch } = useGetToolbox();
  const removeFromToolbox = useRemoveFromToolbox();
  const { toast } = useToast();

  async function handleRemove(toolId: number, toolName: string) {
    try {
      await removeFromToolbox.mutateAsync({ toolId });
      toast({ description: `${toolName} removed from your toolbox.` });
      refetch();
    } catch {
      toast({ variant: "destructive", description: "Failed to remove tool." });
    }
  }

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-muted border border-border/50">
            <Wrench className="h-5 w-5 text-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">My Toolbox</h1>
        </div>
        <p className="text-muted-foreground max-w-xl">
          Your personal collection of AI tools.{" "}
          {user?.firstName ? `Keep it sharp, ${user.firstName}.` : "Keep it sharp."}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : !items || items.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-border/50 rounded-xl">
          <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-lg font-semibold mb-2">Your toolbox is empty</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Start browsing and add tools that fit your workflow.
          </p>
          <Button asChild>
            <Link href="/browse">
              <Plus className="h-4 w-4 mr-2" />
              Browse Tools
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-muted-foreground">
              <strong className="text-foreground">{items.length}</strong> tool{items.length !== 1 ? "s" : ""} in your toolbox
            </span>
            <Button variant="outline" size="sm" asChild>
              <Link href="/browse">
                <Plus className="h-4 w-4 mr-1.5" />
                Add more
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card
                key={item.id}
                className="group border-border/50 bg-card hover:bg-muted/30 transition-colors overflow-hidden"
                style={item.tool.accentColor ? { borderLeftColor: item.tool.accentColor, borderLeftWidth: "4px" } : {}}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-9 w-9 shrink-0 overflow-hidden rounded-md border bg-background p-1"
                        style={item.tool.accentColor ? { borderColor: item.tool.accentColor } : {}}
                      >
                        <img
                          src={getLogoUrl(item.tool)}
                          alt={`${item.tool.name} logo`}
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            try {
                              (e.target as HTMLImageElement).src = `https://logo.clearbit.com/${new URL(item.tool.websiteUrl).hostname}`;
                            } catch {}
                          }}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-base leading-snug">{item.tool.name}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.tool.categoryName}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemove(item.toolId, item.tool.name)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-foreground/70 line-clamp-2">{item.tool.tagline}</p>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="secondary" className="text-xs font-normal">
                        {item.tool.pricingModel.replace("_", " ")}
                      </Badge>
                      {item.tool.hasFree && (
                        <Badge variant="outline" className="text-xs font-normal bg-background">
                          Free Tier
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                        <Link href={`/tool/${item.tool.slug}`}>
                          <span className="sr-only">View details</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
