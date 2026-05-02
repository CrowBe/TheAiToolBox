import { Link } from "wouter";
import { Tool } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "./rating-stars";
import { getLogoUrl } from "@/lib/utils";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const accentStyle = tool.accentColor
    ? { borderLeftColor: tool.accentColor, borderLeftWidth: "4px" }
    : {};

  return (
    <Link href={`/tool/${tool.slug}`}>
      <Card 
        className="group h-full cursor-pointer transition-all hover:bg-muted/50 hover-elevate overflow-hidden border-border/50"
        style={accentStyle}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between space-x-4">
            <div className="flex items-center space-x-3">
              <div 
                className="h-10 w-10 shrink-0 overflow-hidden rounded-md border bg-background p-1 shadow-sm"
                style={tool.accentColor ? { borderColor: tool.accentColor } : {}}
              >
                <img
                  src={getLogoUrl(tool)}
                  alt={`${tool.name} logo`}
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://logo.clearbit.com/${new URL(tool.websiteUrl).hostname}`;
                  }}
                />
              </div>
              <div>
                <CardTitle className="text-base">{tool.name}</CardTitle>
                <div className="mt-1 flex items-center space-x-2 text-sm text-muted-foreground">
                  <RatingStars rating={tool.averageRating} count={tool.ratingCount} size="sm" />
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="font-normal">
              {tool.pricingModel.replace("_", " ")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-2 mb-4 text-sm text-foreground/70">
            {tool.tagline || tool.description}
          </CardDescription>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-background">
              {tool.categoryName}
            </Badge>
            {tool.hasFree && (
              <Badge variant="outline" className="bg-background">
                Free Tier
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
