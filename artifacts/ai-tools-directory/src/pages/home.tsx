import { useListRoles, useGetToolsSummary, useListCategories, useGetToolsByCategory } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ToolCard } from "@/components/ui/tool-card";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, LayoutGrid, Users, Zap } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function Home() {
  const { data: summary, isLoading: isLoadingSummary } = useGetToolsSummary();
  const { data: roles, isLoading: isLoadingRoles } = useListRoles();
  const { data: categories, isLoading: isLoadingCategories } = useListCategories();
  const { data: groupedTools, isLoading: isLoadingGrouped } = useGetToolsByCategory({ role: undefined, hasFree: undefined });

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-12">
      {/* Hero Section */}
      <section className="mb-16 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
          The definitive directory of AI tools for professionals.
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          A carefully curated, knowledge-first reference for the tools that actually matter in your workflow.
        </p>
        
        {isLoadingSummary ? (
          <Skeleton className="h-10 w-64" />
        ) : (
          <div className="flex gap-4 text-sm font-medium">
            <span className="text-muted-foreground"><strong className="text-foreground">{summary?.totalTools || 0}</strong> Tools</span>
            <span className="text-muted-foreground"><strong className="text-foreground">{summary?.totalCategories || 0}</strong> Categories</span>
            <span className="text-muted-foreground"><strong className="text-foreground">{summary?.totalFreeTools || 0}</strong> Free Options</span>
          </div>
        )}
      </section>

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
                <Card className="hover:bg-muted/50 cursor-pointer transition-colors border-border/50 hover:border-primary/50 h-full">
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
                <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors py-4">
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
                        <Link href={`/category/${group.categorySlug}`}>View all {group.tools.length} tools in {group.categoryName}</Link>
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
