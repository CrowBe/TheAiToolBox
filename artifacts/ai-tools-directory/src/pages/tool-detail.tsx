import { useRoute } from "wouter";
import { useGetTool, useGetToolRatings, getGetToolQueryKey, getGetToolRatingsQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, CheckCircle2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { getLogoUrl } from "@/lib/utils";
import { RatingStars } from "@/components/ui/rating-stars";
import { SecurityBadge } from "@/components/ui/security-badge";
import { RatingForm } from "@/components/ui/rating-form";
import { ToolCard } from "@/components/ui/tool-card";

export function ToolDetail() {
  const [, params] = useRoute("/tool/:slug");
  const slug = params?.slug || "";

  const { data: tool, isLoading: isLoadingTool } = useGetTool(slug, {
    query: { enabled: !!slug, queryKey: getGetToolQueryKey(slug) }
  });

  const toolId = tool?.id;

  const { data: ratings, isLoading: isLoadingRatings } = useGetToolRatings(toolId || 0, {
    query: { enabled: !!toolId, queryKey: getGetToolRatingsQueryKey(toolId || 0) }
  });

  if (isLoadingTool) {
    return (
      <div className="container mx-auto max-w-screen-lg px-4 py-8 space-y-8">
        <Skeleton className="h-10 w-24" />
        <div className="flex gap-6">
          <Skeleton className="h-24 w-24 rounded-xl" />
          <div className="space-y-4 flex-1">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Tool not found</h2>
        <Button asChild><Link href="/">Go back home</Link></Button>
      </div>
    );
  }

  const accentStyle = tool.accentColor
    ? { borderColor: tool.accentColor }
    : {};

  return (
    <div className="container mx-auto max-w-screen-lg px-4 py-8 pb-24">
      <Button variant="ghost" size="sm" asChild className="mb-8 -ml-3 text-muted-foreground">
        <Link href="/browse"><ArrowLeft className="w-4 h-4 mr-2" /> Back to directory</Link>
      </Button>

      {/* Header */}
      <header className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-12">
        <div 
          className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border-2 bg-background p-2 shadow-lg"
          style={accentStyle}
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
        
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{tool.name}</h1>
            <Badge variant="secondary" className="text-sm font-normal">{tool.pricingModel.replace("_", " ")}</Badge>
            <Badge variant="outline" className="text-sm font-normal bg-background">{tool.categoryName}</Badge>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl">{tool.tagline}</p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm pt-2">
            <RatingStars rating={tool.averageRating} count={tool.ratingCount} size="lg" />
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">Launched {tool.launchedYear}</span>
            <span className="text-muted-foreground">•</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-primary" asChild>
              <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer">
                Visit Website <ExternalLink className="ml-1 w-3 h-3" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed">
              <p>{tool.description}</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Pricing Details</h2>
            <div className="bg-card border rounded-xl p-6">
              <p className="text-muted-foreground">{tool.pricingDetails}</p>
            </div>
          </section>

          {/* Reviews Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Community Reviews</h2>
            </div>
            
            <div className="space-y-8">
              <RatingForm toolId={tool.id} />
              
              {isLoadingRatings ? (
                <Skeleton className="h-32 w-full" />
              ) : ratings?.recentReviews && ratings.recentReviews.length > 0 ? (
                <div className="space-y-4">
                  {ratings.recentReviews.map((review) => (
                    <div key={review.id} className="border-b border-border/50 pb-6 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <RatingStars rating={review.score} size="sm" />
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.review && (
                        <p className="text-muted-foreground text-sm mt-2">{review.review}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">No written reviews yet. Be the first!</p>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <section className="bg-card border rounded-xl p-6 space-y-6">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-3">Security & Privacy</h3>
              <div className="space-y-4">
                <SecurityBadge score={tool.securityScore} className="w-full justify-center py-2 text-sm" />
                <p className="text-sm text-muted-foreground">{tool.securityAnalysis}</p>
                <div className="pt-2 border-t border-border/50">
                  <p className="text-sm font-medium mb-2">Privacy Notes</p>
                  <p className="text-sm text-muted-foreground">{tool.dataPrivacyNotes}</p>
                </div>
              </div>
            </div>

            {tool.complianceBadges && tool.complianceBadges.length > 0 && (
              <div>
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-3">Compliance</h3>
                <div className="flex flex-wrap gap-2">
                  {tool.complianceBadges.map((badge) => (
                    <Badge key={badge} variant="outline" className="bg-background">
                      <CheckCircle2 className="w-3 h-3 mr-1.5 text-emerald-500" />
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {tool.roles && tool.roles.length > 0 && (
              <div>
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-3">Best for Roles</h3>
                <div className="flex flex-wrap gap-2">
                  {tool.roles.map((role) => (
                    <Badge key={role} variant="secondary">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Alternatives */}
          {tool.alternativeTools && tool.alternativeTools.length > 0 && (
            <section>
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-4">Alternatives</h3>
              <div className="space-y-4">
                {tool.alternativeTools.map((alt) => (
                  <Link key={alt.id} href={`/tool/${alt.slug}`}>
                    <div className="group flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 cursor-pointer transition-colors">
                      <div className="h-8 w-8 shrink-0 overflow-hidden rounded bg-background p-1">
                        <img
                          src={getLogoUrl(alt)}
                          alt={`${alt.name} logo`}
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://logo.clearbit.com/${new URL(alt.websiteUrl).hostname}`;
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{alt.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{alt.tagline}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
