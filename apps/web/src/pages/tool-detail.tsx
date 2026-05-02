import { useState } from "react";
import { useRoute } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { useUser, useClerk } from "@clerk/react";
import {
  useGetTool, useGetToolRatings, useGetToolChangelog, useGetToolComments,
  useAddToolComment, useDeleteToolComment,
  getGetToolQueryKey, getGetToolRatingsQueryKey,
  getGetToolChangelogQueryKey, getGetToolCommentsQueryKey,
} from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ExternalLink, CheckCircle2, ArrowLeft, ShieldCheck, ShieldAlert,
  ShieldX, Zap, Wrench, DollarSign, Tag, History, MessageSquare,
  Trash2, AlertTriangle, Bug, Star,
} from "lucide-react";
import { Link } from "wouter";
import { getLogoUrl } from "@/lib/utils";
import { RatingStars } from "@/components/ui/rating-stars";
import { SecurityBadge } from "@/components/ui/security-badge";
import { RatingForm } from "@/components/ui/rating-form";
import { AddToToolboxButton } from "@/components/ui/add-to-toolbox-button";

const PRICING_MODEL_LABELS: Record<string, string> = {
  free: "Free",
  freemium: "Freemium",
  paid: "Paid",
  enterprise: "Enterprise",
  open_source: "Open Source",
};

const PRICING_MODEL_DESCRIPTIONS: Record<string, string> = {
  free: "This tool is completely free to use with no paid tiers.",
  freemium: "A free tier is available with premium features behind a paid plan.",
  paid: "This tool requires a paid subscription to use.",
  enterprise: "Pricing is tailored for enterprise teams — contact the vendor for a quote.",
  open_source: "The source code is open and free; self-hosting costs may apply.",
};

const CHANGELOG_TYPE_CONFIG: Record<string, { label: string; color: string; dotColor: string; icon: React.ReactNode }> = {
  feature:     { label: "New Feature",     color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", dotColor: "border-emerald-500", icon: <Zap className="w-3 h-3" /> },
  improvement: { label: "Improvement",     color: "text-blue-400 bg-blue-400/10 border-blue-400/20",         dotColor: "border-blue-500",    icon: <Star className="w-3 h-3" /> },
  fix:         { label: "Bug Fix",         color: "text-amber-400 bg-amber-400/10 border-amber-400/20",       dotColor: "border-amber-500",   icon: <Bug className="w-3 h-3" /> },
  breaking:    { label: "Breaking Change", color: "text-red-400 bg-red-400/10 border-red-400/20",             dotColor: "border-red-500",     icon: <AlertTriangle className="w-3 h-3" /> },
};

function SecurityScoreBar({ score }: { score: number }) {
  const pct = Math.min(100, Math.max(0, score));
  const isStrong   = score >= 80;
  const isModerate = score >= 60 && score < 80;
  const barColor   = isStrong ? "bg-emerald-500" : isModerate ? "bg-amber-500" : "bg-red-500";
  const Icon       = isStrong ? ShieldCheck : isModerate ? ShieldAlert : ShieldX;
  const iconColor  = isStrong ? "text-emerald-400" : isModerate ? "text-amber-400" : "text-red-400";
  const label      = isStrong ? "Strong" : isModerate ? "Moderate" : "Weak";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${iconColor}`} />
          <span className="font-semibold text-lg">{score}/100</span>
          <span className="text-muted-foreground text-sm">— {label}</span>
        </div>
        <SecurityBadge score={score} />
      </div>
      <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function ToolDetail() {
  const [, params] = useRoute("/tool/:slug");
  const slug = params?.slug || "";
  const [commentText, setCommentText] = useState("");
  const queryClient = useQueryClient();
  const { isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();

  const { data: tool, isLoading: isLoadingTool } = useGetTool(slug, {
    query: { enabled: !!slug, queryKey: getGetToolQueryKey(slug) },
  });

  const { data: ratings, isLoading: isLoadingRatings } = useGetToolRatings(tool?.id || 0, {
    query: { enabled: !!tool?.id, queryKey: getGetToolRatingsQueryKey(tool?.id || 0) },
  });

  const { data: changelog, isLoading: isLoadingChangelog } = useGetToolChangelog(slug, {
    query: { enabled: !!slug, queryKey: getGetToolChangelogQueryKey(slug) },
  });

  const { data: comments, isLoading: isLoadingComments } = useGetToolComments(slug, {
    query: { enabled: !!slug, queryKey: getGetToolCommentsQueryKey(slug) },
  });

  const addComment = useAddToolComment({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetToolCommentsQueryKey(slug) });
        setCommentText("");
      },
    },
  });

  const deleteComment = useDeleteToolComment({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetToolCommentsQueryKey(slug) }),
    },
  });

  function handleSubmitComment() {
    if (!commentText.trim()) return;
    const displayName =
      user?.fullName ||
      user?.firstName ||
      user?.emailAddresses?.[0]?.emailAddress ||
      "Anonymous";
    addComment.mutate({ slug, data: { content: commentText.trim(), userDisplayName: displayName } });
  }

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
        <Skeleton className="h-96 w-full" />
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

  const accentStyle = tool.accentColor ? { borderColor: tool.accentColor } : {};

  return (
    <div className="container mx-auto max-w-screen-lg px-4 py-8 pb-24">
      <Button variant="ghost" size="sm" asChild className="mb-8 -ml-3 text-muted-foreground">
        <Link href="/browse"><ArrowLeft className="w-4 h-4 mr-2" /> Back to directory</Link>
      </Button>

      {/* Header */}
      <header className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-10">
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

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{tool.name}</h1>
            <Badge variant="secondary" className="text-sm font-normal">{PRICING_MODEL_LABELS[tool.pricingModel] ?? tool.pricingModel}</Badge>
            <Badge variant="outline" className="text-sm font-normal bg-background">{tool.categoryName}</Badge>
          </div>
          <p className="text-xl text-muted-foreground">{tool.tagline}</p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <RatingStars rating={tool.averageRating} count={tool.ratingCount} size="lg" />
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground text-sm">Launched {tool.launchedYear}</span>
          </div>

          {tool.tags && tool.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <Tag className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              {tool.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs font-normal text-muted-foreground border-border/50">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <AddToToolboxButton toolId={tool.id} />
          <Button asChild>
            <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer">
              Visit Website <ExternalLink className="ml-1.5 w-3.5 h-3.5" />
            </a>
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Tabs — main content */}
        <div className="md:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="mb-8 w-full justify-start flex-wrap h-auto gap-1 bg-transparent border-b border-border rounded-none px-0 pb-0">
              <TabsTrigger value="overview"   className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"><Star className="w-3.5 h-3.5" /> Overview</TabsTrigger>
              <TabsTrigger value="pricing"    className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"><DollarSign className="w-3.5 h-3.5" /> Pricing</TabsTrigger>
              <TabsTrigger value="security"   className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"><ShieldCheck className="w-3.5 h-3.5" /> Security</TabsTrigger>
              <TabsTrigger value="changelog"  className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                <History className="w-3.5 h-3.5" /> Changelog
                {changelog && changelog.length > 0 && <span className="ml-0.5 text-xs bg-muted rounded px-1.5 py-0.5">{changelog.length}</span>}
              </TabsTrigger>
              <TabsTrigger value="discussion" className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                <MessageSquare className="w-3.5 h-3.5" /> Discussion
                {comments && comments.length > 0 && <span className="ml-0.5 text-xs bg-muted rounded px-1.5 py-0.5">{comments.length}</span>}
              </TabsTrigger>
            </TabsList>

            {/* ── OVERVIEW ── */}
            <TabsContent value="overview" className="space-y-10 mt-0">
              <section>
                <h2 className="text-xl font-semibold mb-4">About {tool.name}</h2>
                <p className="text-muted-foreground leading-relaxed">{tool.description}</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-6">Community Reviews</h2>
                <RatingForm toolId={tool.id} />
                {isLoadingRatings ? (
                  <Skeleton className="h-32 w-full mt-6" />
                ) : ratings?.recentReviews && ratings.recentReviews.length > 0 ? (
                  <div className="mt-6 space-y-4">
                    {ratings.recentReviews.map((review) => (
                      <div key={review.id} className="border-b border-border/50 pb-5 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <RatingStars rating={review.score} size="sm" />
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {review.review && <p className="text-muted-foreground text-sm mt-2">{review.review}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic mt-6">No written reviews yet. Be the first!</p>
                )}
              </section>
            </TabsContent>

            {/* ── PRICING ── */}
            <TabsContent value="pricing" className="space-y-6 mt-0">
              <h2 className="text-xl font-semibold">Pricing Information</h2>

              <div className="bg-card border rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{PRICING_MODEL_LABELS[tool.pricingModel] ?? tool.pricingModel}</p>
                    <p className="text-sm text-muted-foreground">{PRICING_MODEL_DESCRIPTIONS[tool.pricingModel]}</p>
                  </div>
                </div>

                {tool.hasFree && (
                  <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-sm text-emerald-400 font-medium">Free tier available — no credit card required to start</span>
                  </div>
                )}
              </div>

              <div className="bg-card border rounded-xl p-6">
                <h3 className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-4">Plan Breakdown</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm">{tool.pricingDetails}</p>
              </div>

              <Button variant="outline" asChild className="w-full">
                <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer">
                  View Current Pricing <ExternalLink className="ml-2 w-3.5 h-3.5" />
                </a>
              </Button>
            </TabsContent>

            {/* ── SECURITY ── */}
            <TabsContent value="security" className="space-y-6 mt-0">
              <h2 className="text-xl font-semibold">Security Evaluation</h2>

              <div className="bg-card border rounded-xl p-6 space-y-6">
                <div>
                  <h3 className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-4">Overall Security Score</h3>
                  <SecurityScoreBar score={tool.securityScore} />
                </div>

                <div className="border-t border-border/50 pt-5">
                  <h3 className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-3">Security Analysis</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{tool.securityAnalysis}</p>
                </div>

                <div className="border-t border-border/50 pt-5">
                  <h3 className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-3">Data Privacy Notes</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{tool.dataPrivacyNotes}</p>
                </div>

                {tool.complianceBadges && tool.complianceBadges.length > 0 && (
                  <div className="border-t border-border/50 pt-5">
                    <h3 className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-4">Compliance Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {tool.complianceBadges.map((badge) => (
                        <div key={badge} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-background text-sm font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          {badge}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* ── CHANGELOG ── */}
            <TabsContent value="changelog" className="space-y-6 mt-0">
              <h2 className="text-xl font-semibold">Release History</h2>

              {isLoadingChangelog ? (
                <div className="space-y-4">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
              ) : changelog && changelog.length > 0 ? (
                <div className="relative pl-6">
                  <div className="absolute left-[7px] top-1 bottom-1 w-px bg-border" />
                  <div className="space-y-6">
                    {changelog.map((entry) => {
                      const cfg = CHANGELOG_TYPE_CONFIG[entry.type] ?? CHANGELOG_TYPE_CONFIG.feature;
                      return (
                        <div key={entry.id} className="relative">
                          <div className={`absolute -left-6 mt-1 w-3.5 h-3.5 rounded-full border-2 bg-background ${cfg.dotColor}`} />
                          <div className="pb-6 border-b border-border/30 last:border-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded border ${cfg.color}`}>
                                {cfg.icon}{cfg.label}
                              </span>
                              <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">v{entry.version}</code>
                              <span className="text-xs text-muted-foreground ml-auto">
                                {new Date(entry.releaseDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                              </span>
                            </div>
                            <h4 className="font-semibold mb-1">{entry.title}</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">{entry.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No changelog entries yet.</p>
                </div>
              )}
            </TabsContent>

            {/* ── DISCUSSION ── */}
            <TabsContent value="discussion" className="space-y-6 mt-0">
              <h2 className="text-xl font-semibold">Discussion</h2>

              {isSignedIn ? (
                <div className="bg-card border rounded-xl p-5 space-y-3">
                  <p className="text-sm font-medium">
                    Comment as <span className="text-primary">{user?.firstName || user?.emailAddresses?.[0]?.emailAddress}</span>
                  </p>
                  <Textarea
                    placeholder="Share your thoughts, tips, or questions about this tool…"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="min-h-[100px] resize-none"
                    maxLength={2000}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{commentText.length}/2000</span>
                    <Button onClick={handleSubmitComment} disabled={!commentText.trim() || addComment.isPending} size="sm">
                      {addComment.isPending ? "Posting…" : "Post Comment"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-card border rounded-xl p-6 text-center space-y-3">
                  <MessageSquare className="w-8 h-8 mx-auto text-muted-foreground opacity-40" />
                  <p className="text-muted-foreground text-sm">Sign in to join the discussion</p>
                  <Button size="sm" onClick={() => openSignIn()}>
                    <Wrench className="w-4 h-4 mr-2" /> Sign in to comment
                  </Button>
                </div>
              )}

              {isLoadingComments ? (
                <div className="space-y-3">{[1, 2].map((i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
              ) : comments && comments.length > 0 ? (
                <div className="space-y-3">
                  {comments.map((comment) => {
                    const isOwn = user?.id === comment.userId;
                    return (
                      <div key={comment.id} className="bg-card border rounded-xl p-5">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <span className="font-medium text-sm">{comment.userDisplayName}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {new Date(comment.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                            </span>
                          </div>
                          {isOwn && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive shrink-0"
                              onClick={() => deleteComment.mutate({ slug, commentId: comment.id })}
                              disabled={deleteComment.isPending}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">{comment.content}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>No comments yet. Start the conversation!</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-card border rounded-xl p-5 space-y-5">
            <div>
              <h3 className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-3">Quick Facts</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Category</dt>
                  <dd className="font-medium text-right">{tool.categoryName}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Launched</dt>
                  <dd className="font-medium">{tool.launchedYear}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Pricing</dt>
                  <dd className="font-medium">{PRICING_MODEL_LABELS[tool.pricingModel]}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Free Tier</dt>
                  <dd className={`font-medium ${tool.hasFree ? "text-emerald-400" : "text-muted-foreground"}`}>
                    {tool.hasFree ? "Yes" : "No"}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Security Score</dt>
                  <dd className={`font-medium ${tool.securityScore >= 80 ? "text-emerald-400" : tool.securityScore >= 60 ? "text-amber-400" : "text-red-400"}`}>
                    {tool.securityScore}/100
                  </dd>
                </div>
              </dl>
            </div>

            {tool.roles && tool.roles.length > 0 && (
              <div className="border-t border-border/50 pt-4">
                <h3 className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-3">Best for Roles</h3>
                <div className="flex flex-wrap gap-1.5">
                  {tool.roles.map((role) => (
                    <Badge key={role} variant="secondary" className="text-xs font-normal">{role}</Badge>
                  ))}
                </div>
              </div>
            )}

            {tool.complianceBadges && tool.complianceBadges.length > 0 && (
              <div className="border-t border-border/50 pt-4">
                <h3 className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-3">Compliance</h3>
                <div className="flex flex-wrap gap-1.5">
                  {tool.complianceBadges.map((badge) => (
                    <Badge key={badge} variant="outline" className="text-xs bg-background">
                      <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" />{badge}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {tool.alternativeTools && tool.alternativeTools.length > 0 && (
            <div className="bg-card border rounded-xl p-5">
              <h3 className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-4">Alternatives</h3>
              <div className="space-y-2">
                {tool.alternativeTools.map((alt) => (
                  <Link key={alt.id} href={`/tool/${alt.slug}`}>
                    <div className="group flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                      <div className="h-8 w-8 shrink-0 overflow-hidden rounded bg-background p-1 border">
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
                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{alt.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{alt.tagline}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
