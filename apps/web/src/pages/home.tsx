import { useListRoles, useGetToolsSummary, useGetToolsByCategory } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Show } from "@clerk/react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ToolCard } from "@/components/ui/tool-card";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, LayoutGrid, Users, Wrench, Sparkles } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function Home() {
  const { data: summary, isLoading: isLoadingSummary } = useGetToolsSummary();
  const { data: roles, isLoading: isLoadingRoles } = useListRoles();
  const { data: groupedTools, isLoading: isLoadingGrouped } = useGetToolsByCategory({ role: undefined, hasFree: undefined });

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-12">
      {/* Hero Section */}
      <section className="mb-16 max-w-3xl">
        <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground font-medium">
          <Wrench className="h-4 w-4" />
          <span>The AI Tools Directory</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-5 leading-[1.1]">
          Build your AI toolbox.<br />
          <span className="text-muted-foreground font-normal">One curated directory.</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
          Every professional needs the right tools. Browse our curated AI software directory, evaluate pricing and security, and save the tools that actually fit your workflow.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <Button size="lg" asChild>
            <Link href="/browse">Browse All Tools</Link>
          </Button>
          <Show when="signed-out">
            <Button size="lg" variant="outline" asChild>
              <Link href="/sign-up">
                <Wrench className="h-4 w-4 mr-2" />
                Fill My Toolbox
              </Link>
            </Button>
          </Show>
          <Show when="signed-in">
            <Button size="lg" variant="outline" asChild>
              <Link href="/toolbox">
                <Wrench className="h-4 w-4 mr-2" />
                My Toolbox
              </Link>
            </Button>
          </Show>
        </div>

        {isLoadingSummary ? (
          <Skeleton className="h-8 w-72" />
        ) : (
          <div className="flex gap-6 text-sm">
            <span className="text-muted-foreground">
              <strong className="text-foreground text-base">{summary?.totalTools || 0}</strong> Tools
            </span>
            <span className="text-muted-foreground">
              <strong className="text-foreground text-base">{summary?.totalCategories || 0}</strong> Categories
            </span>
            <span className="text-muted-foreground">
              <strong className="text-foreground text-base">{summary?.totalFreeTools || 0}</strong> Free Options
            </span>
          </div>
        )}
      </section>

      {/* Fill My Toolbox CTA — only for signed-out users */}
      <Show when="signed-out">
        <section className="mb-16">
          <div className="rounded-xl border border-border/50 bg-card p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-muted border border-border/50">
                <Wrench className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-1">Fill My Toolbox</h2>
                <p className="text-muted-foreground text-sm max-w-md">
                  Create a free account to save and curate the AI tools that matter to your workflow. Your personal AI arsenal, always at hand.
                </p>
              </div>
            </div>
            <div className="flex gap-3 shrink-0">
              <Button size="sm" variant="outline" asChild>
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/sign-up">Get started — free</Link>
              </Button>
            </div>
          </div>
        </section>
      </Show>

      {/* Role Selector */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Explore by Role
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoadingRoles ? (
            Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
          ) : (
            roles?.map((role) => (
              <Link key={role.id} href={`/role/${role.slug}`}>
                <Card className="hover:bg-muted/50 cursor-pointer transition-colors border-border/50 hover:border-border h-full">
                  <CardContent className="p-4 flex items-center justify-between h-full">
                    <span className="font-medium text-sm">{role.name}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Categories / Directory */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-primary" />
            Directory
          </h2>
          <Button variant="outline" asChild>
            <Link href="/browse">View All</Link>
          </Button>
        </div>

        {isLoadingGrouped ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full space-y-4" defaultValue={groupedTools?.[0]?.categorySlug}>
            {groupedTools?.map((group) => (
              <AccordionItem key={group.categoryId} value={group.categorySlug} className="border rounded-lg px-4 border-border/50 bg-card">
                <AccordionTrigger className="hover:no-underline hover:text-foreground transition-colors py-4">
                  <div className="flex items-center gap-2 text-left">
                    <span className="font-semibold text-lg">{group.categoryName}</span>
                    <span className="text-sm font-normal text-muted-foreground ml-2 px-2 py-0.5 rounded-full bg-muted">
                      {group.tools.length} tools
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-6">
                  <p className="text-muted-foreground mb-6 max-w-3xl">
                    {group.categoryDescription}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.tools.slice(0, 6).map((tool) => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                  {group.tools.length > 6 && (
                    <div className="mt-6 text-center">
                      <Button variant="secondary" asChild>
                        <Link href={`/category/${group.categorySlug}`}>
                          View all {group.tools.length} tools in {group.categoryName}
                        </Link>
                      </Button>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </section>
    </div>
  );
}
