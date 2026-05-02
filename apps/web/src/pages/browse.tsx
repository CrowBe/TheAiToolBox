import { useListTools, useListCategories, useListRoles } from "@workspace/api-client-react";
import { Link, useSearch } from "wouter";
import { useState, useMemo } from "react";
import { ToolCard } from "@/components/ui/tool-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, Filter, List, Grid } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";

export function Browse() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [pricingFilter, setPricingFilter] = useState<string>("all");
  const [hasFreeFilter, setHasFreeFilter] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: categories } = useListCategories();
  const { data: roles } = useListRoles();
  
  const { data: tools, isLoading } = useListTools({
    category: categoryFilter !== "all" ? categoryFilter : undefined,
    role: roleFilter !== "all" ? roleFilter : undefined,
    hasFree: hasFreeFilter ? true : undefined,
    search: searchTerm || undefined,
  });

  const filteredTools = useMemo(() => {
    if (!tools) return [];
    return tools.filter(tool => {
      if (pricingFilter !== "all" && tool.pricingModel !== pricingFilter) return false;
      return true;
    });
  }, [tools, pricingFilter]);

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0 space-y-8">
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Filter className="w-4 h-4" /> Filters</h3>
            <div className="space-y-6">
              
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tools..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles?.map((role) => (
                      <SelectItem key={role.slug} value={role.slug}>{role.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Pricing Model</Label>
                <Select value={pricingFilter} onValueChange={setPricingFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Pricing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Pricing</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="freemium">Freemium</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="open_source">Open Source</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="has-free" className="cursor-pointer">Has Free Tier</Label>
                <Switch
                  id="has-free"
                  checked={hasFreeFilter}
                  onCheckedChange={setHasFreeFilter}
                />
              </div>

            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Browse Directory</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {filteredTools.length} results
              </span>
              <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as "grid" | "list")}>
                <ToggleGroupItem value="grid" aria-label="Grid view">
                  <Grid className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="List view">
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          {isLoading ? (
            <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className={viewMode === "grid" ? "h-64" : "h-32"} />
              ))}
            </div>
          ) : filteredTools.length === 0 ? (
            <div className="text-center py-24 border border-dashed rounded-lg">
              <SearchIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
              <h3 className="text-lg font-medium text-foreground mb-2">No tools found</h3>
              <p className="text-muted-foreground text-sm">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
