import { useState } from "react";
import { Search as SearchIcon, Sparkles, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useListTools } from "@workspace/api-client-react";
import { ToolCard } from "@/components/ui/tool-card";

export function Search() {
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // In a real app, this would use Transformers.js. 
  // For this mockup, we'll use a simple keyword search via the API
  const { data: tools } = useListTools(
    { search: query },
    { query: { enabled: hasSearched && query.length > 2 } }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    setHasSearched(true);
    // Simulate model inference delay
    setTimeout(() => setIsSearching(false), 800);
  };

  return (
    <div className="container mx-auto max-w-screen-md px-4 py-16">
      <div className="text-center mb-12">
        <Sparkles className="h-12 w-12 text-primary mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">Semantic AI Search</h1>
        <p className="text-xl text-muted-foreground">
          Describe what you need in plain English.
          <br className="hidden md:block" /> Our embedded AI will find the right tools.
        </p>
      </div>

      <form onSubmit={handleSearch} className="relative mb-12">
        <div className="relative flex items-center shadow-lg rounded-xl bg-card border-border/50 border focus-within:ring-2 focus-within:ring-primary focus-within:border-primary overflow-hidden transition-all">
          <SearchIcon className="h-6 w-6 text-muted-foreground ml-4" />
          <Input
            className="border-0 focus-visible:ring-0 text-lg h-16 bg-transparent"
            placeholder="e.g. I need to generate code from Figma designs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button 
            type="submit" 
            size="lg" 
            className="mr-2 h-12 px-8"
            disabled={!query.trim() || isSearching}
          >
            {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : "Search"}
          </Button>
        </div>
      </form>

      {hasSearched && (
        <div className="space-y-6">
          {isSearching ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
              <p className="text-muted-foreground animate-pulse">Running semantic similarity search...</p>
            </div>
          ) : tools && tools.length > 0 ? (
            <div>
              <h2 className="text-xl font-semibold mb-6">Top matches for your intent</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tools.map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No tools found matching your description.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
