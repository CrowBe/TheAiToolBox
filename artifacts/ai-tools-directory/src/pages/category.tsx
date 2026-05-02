import { useRoute } from "wouter";
import { useListCategories, useListTools } from "@workspace/api-client-react";
import { ToolCard } from "@/components/ui/tool-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LayoutGrid } from "lucide-react";

export function Category() {
  const [, params] = useRoute("/category/:slug");
  const slug = params?.slug || "";

  const { data: categories, isLoading: isLoadingCategory } = useListCategories();
  const category = categories?.find(c => c.slug === slug);

  const { data: tools, isLoading: isLoadingTools } = useListTools({ category: slug });

  if (isLoadingCategory) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-6 w-96 mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64" />)}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Category not found</h2>
        <Button asChild><Link href="/">Go back home</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-12">
      <Button variant="ghost" size="sm" asChild className="mb-8 -ml-3 text-muted-foreground">
        <Link href="/browse"><ArrowLeft className="w-4 h-4 mr-2" /> Browse all categories</Link>
      </Button>

      <header className="mb-12 max-w-3xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <LayoutGrid className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">{category.name} AI Tools</h1>
        </div>
        <p className="text-xl text-muted-foreground mb-6">{category.description}</p>
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="bg-muted px-3 py-1 rounded-full">{category.toolCount} tools in directory</span>
        </div>
      </header>

      {isLoadingTools ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64" />)}
        </div>
      ) : tools && tools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No tools found in this category yet.</p>
        </div>
      )}
    </div>
  );
}
