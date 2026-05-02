import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListAdminTools, useCreateAdminTool, useUpdateAdminTool, useDeleteAdminTool,
  useBulkImportAdminTools, useListCategories,
  getListAdminToolsQueryKey, getListCategoriesQueryKey,
  type AdminTool, type AdminToolInput,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { parseCSV, downloadCSVTemplate, TOOLS_CSV_HEADERS, TOOLS_CSV_EXAMPLE } from "@/lib/csv-parser";
import {
  Plus, Pencil, Trash2, Search, Upload, Download,
  CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Wrench,
} from "lucide-react";

const PRICING_MODELS = ["free", "freemium", "paid", "enterprise", "open_source"];
const EMPTY_FORM: Partial<AdminToolInput> = {
  slug: "", name: "", tagline: "", description: "", websiteUrl: "", logoUrl: "",
  categoryId: undefined, hasFree: false, pricingModel: "freemium", pricingDetails: "",
  launchedYear: new Date().getFullYear(), roles: [], tags: [], accentColor: "#6366f1",
  securityScore: 70, securityAnalysis: "", dataPrivacyNotes: "", complianceBadges: [],
};

function arrToStr(arr?: string[]) { return (arr ?? []).join(" | "); }
function strToArr(s: string) { return s.split(/[|,]/).map((x) => x.trim()).filter(Boolean); }

function ToolFormDialog({
  open, onClose, initial, editId,
  categories,
}: {
  open: boolean;
  onClose: () => void;
  initial?: AdminTool | null;
  editId?: number | null;
  categories: { id: number; name: string }[];
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<Partial<AdminToolInput>>(
    initial ? {
      ...initial,
      categoryId: initial.categoryId,
    } : EMPTY_FORM
  );
  const [rolesStr, setRolesStr] = useState(arrToStr(initial?.roles));
  const [tagsStr, setTagsStr] = useState(arrToStr(initial?.tags));
  const [badgesStr, setBadgesStr] = useState(arrToStr(initial?.complianceBadges));

  const set = (k: keyof AdminToolInput, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const createMutation = useCreateAdminTool({
    mutation: { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListAdminToolsQueryKey() }); onClose(); } },
  });
  const updateMutation = useUpdateAdminTool({
    mutation: { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListAdminToolsQueryKey() }); onClose(); } },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;

  function handleSubmit() {
    const data: AdminToolInput = {
      slug: form.slug!,
      name: form.name!,
      tagline: form.tagline!,
      description: form.description!,
      websiteUrl: form.websiteUrl!,
      logoUrl: form.logoUrl ?? "",
      categoryId: Number(form.categoryId),
      hasFree: Boolean(form.hasFree),
      pricingModel: form.pricingModel!,
      pricingDetails: form.pricingDetails ?? "",
      launchedYear: Number(form.launchedYear),
      roles: strToArr(rolesStr),
      tags: strToArr(tagsStr),
      accentColor: form.accentColor ?? "#6366f1",
      securityScore: Number(form.securityScore ?? 70),
      securityAnalysis: form.securityAnalysis ?? "",
      dataPrivacyNotes: form.dataPrivacyNotes ?? "",
      complianceBadges: strToArr(badgesStr),
    };
    if (editId) {
      updateMutation.mutate({ id: editId, data });
    } else {
      createMutation.mutate({ data });
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>{editId ? "Edit Tool" : "Add New Tool"}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] px-6">
          <div className="py-4 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Basic Info</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Name <span className="text-destructive">*</span></Label>
                  <Input value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} placeholder="ChatGPT" />
                </div>
                <div className="space-y-1.5">
                  <Label>Slug <span className="text-destructive">*</span></Label>
                  <Input value={form.slug ?? ""} onChange={(e) => set("slug", e.target.value)} placeholder="chatgpt" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Tagline <span className="text-destructive">*</span></Label>
                <Input value={form.tagline ?? ""} onChange={(e) => set("tagline", e.target.value)} placeholder="Short one-liner" />
              </div>
              <div className="space-y-1.5">
                <Label>Description <span className="text-destructive">*</span></Label>
                <Textarea rows={3} value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} placeholder="Full description of the tool…" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Website URL <span className="text-destructive">*</span></Label>
                  <Input value={form.websiteUrl ?? ""} onChange={(e) => set("websiteUrl", e.target.value)} placeholder="https://openai.com/chatgpt" />
                </div>
                <div className="space-y-1.5">
                  <Label>Logo URL</Label>
                  <Input value={form.logoUrl ?? ""} onChange={(e) => set("logoUrl", e.target.value)} placeholder="https://…/logo.png" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>Category <span className="text-destructive">*</span></Label>
                  <Select value={String(form.categoryId ?? "")} onValueChange={(v) => set("categoryId", Number(v))}>
                    <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Pricing Model <span className="text-destructive">*</span></Label>
                  <Select value={form.pricingModel ?? "freemium"} onValueChange={(v) => set("pricingModel", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PRICING_MODELS.map((m) => (
                        <SelectItem key={m} value={m}>{m.replace("_", " ")}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Launch Year <span className="text-destructive">*</span></Label>
                  <Input type="number" value={form.launchedYear ?? ""} onChange={(e) => set("launchedYear", Number(e.target.value))} placeholder="2024" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="flex items-center gap-3">
                  <Switch checked={Boolean(form.hasFree)} onCheckedChange={(v) => set("hasFree", v)} id="hasFree" />
                  <Label htmlFor="hasFree">Has Free Tier</Label>
                </div>
                <div className="space-y-1.5">
                  <Label>Accent Color</Label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.accentColor ?? "#6366f1"} onChange={(e) => set("accentColor", e.target.value)} className="h-9 w-12 rounded border border-input bg-transparent cursor-pointer" />
                    <Input value={form.accentColor ?? ""} onChange={(e) => set("accentColor", e.target.value)} className="font-mono text-sm" placeholder="#6366f1" />
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Pricing Details</Label>
                <Textarea rows={2} value={form.pricingDetails ?? ""} onChange={(e) => set("pricingDetails", e.target.value)} placeholder="Free: 100 requests/mo. Pro: $20/mo unlimited." />
              </div>
            </div>

            {/* Taxonomy */}
            <div className="space-y-4 border-t border-border/50 pt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Taxonomy</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Roles <span className="text-xs text-muted-foreground">(pipe or comma separated)</span></Label>
                  <Input value={rolesStr} onChange={(e) => setRolesStr(e.target.value)} placeholder="software-engineer | designer" />
                </div>
                <div className="space-y-1.5">
                  <Label>Tags <span className="text-xs text-muted-foreground">(pipe or comma separated)</span></Label>
                  <Input value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} placeholder="ai | productivity | code" />
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="space-y-4 border-t border-border/50 pt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Security & Privacy</p>
              <div className="space-y-1.5">
                <Label>Security Score <span className="text-xs text-muted-foreground">(0–100)</span></Label>
                <div className="flex items-center gap-3">
                  <Input type="range" min={0} max={100} value={form.securityScore ?? 70} onChange={(e) => set("securityScore", Number(e.target.value))} className="flex-1" />
                  <span className="text-sm font-mono w-8 text-right">{form.securityScore ?? 70}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Security Analysis</Label>
                <Textarea rows={2} value={form.securityAnalysis ?? ""} onChange={(e) => set("securityAnalysis", e.target.value)} placeholder="Overview of security practices…" />
              </div>
              <div className="space-y-1.5">
                <Label>Data Privacy Notes</Label>
                <Textarea rows={2} value={form.dataPrivacyNotes ?? ""} onChange={(e) => set("dataPrivacyNotes", e.target.value)} placeholder="How user data is handled…" />
              </div>
              <div className="space-y-1.5">
                <Label>Compliance Badges <span className="text-xs text-muted-foreground">(pipe separated)</span></Label>
                <Input value={badgesStr} onChange={(e) => setBadgesStr(e.target.value)} placeholder="SOC 2 Type II | GDPR | HIPAA" />
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="px-6 py-4 border-t flex items-center gap-2">
          {error && <p className="text-xs text-destructive mr-auto">Failed to save. Check required fields.</p>}
          <Button variant="ghost" onClick={onClose} disabled={isPending}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Saving…" : editId ? "Save Changes" : "Create Tool"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CSVUploadSection({ categories }: { categories: { id: number; name: string }[] }) {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<Record<string, string>[] | null>(null);
  const [result, setResult] = useState<{ imported: number; errors: string[] } | null>(null);

  const bulkMutation = useBulkImportAdminTools({
    mutation: {
      onSuccess: (data) => {
        setResult(data);
        queryClient.invalidateQueries({ queryKey: getListAdminToolsQueryKey() });
      },
    },
  });

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setRows(parseCSV(text));
      setResult(null);
    };
    reader.readAsText(file);
  }

  function handleImport() {
    if (!rows) return;
    const catMap = new Map(categories.map((c) => [c.name.toLowerCase(), c.id]));
    const data = rows.map((row) => ({
      slug: row.slug,
      name: row.name,
      tagline: row.tagline,
      description: row.description,
      websiteUrl: row.websiteUrl,
      logoUrl: row.logoUrl ?? "",
      categoryId: Number(row.categoryId) || catMap.get(row.categoryName?.toLowerCase() ?? "") || 1,
      hasFree: row.hasFree === "true" || row.hasFree === "1",
      pricingModel: row.pricingModel || "paid",
      pricingDetails: row.pricingDetails ?? "",
      launchedYear: Number(row.launchedYear) || new Date().getFullYear(),
      roles: row.roles ? row.roles.split("|").map((s: string) => s.trim()).filter(Boolean) : [],
      tags: row.tags ? row.tags.split("|").map((s: string) => s.trim()).filter(Boolean) : [],
      accentColor: row.accentColor ?? "#6366f1",
      securityScore: Number(row.securityScore) || 50,
      securityAnalysis: row.securityAnalysis ?? "",
      dataPrivacyNotes: row.dataPrivacyNotes ?? "",
      complianceBadges: row.complianceBadges ? row.complianceBadges.split("|").map((s: string) => s.trim()).filter(Boolean) : [],
    })) as any;
    bulkMutation.mutate({ data });
  }

  return (
    <div className="border rounded-xl p-5 space-y-4 bg-muted/20">
      <div className="flex items-center justify-between">
        <p className="font-medium text-sm">Bulk Import via CSV</p>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground text-xs gap-1.5"
          onClick={() => downloadCSVTemplate("tools-template.csv", TOOLS_CSV_HEADERS, TOOLS_CSV_EXAMPLE)}
        >
          <Download className="w-3.5 h-3.5" /> Download Template
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Upload a CSV with headers: <code className="bg-muted px-1 rounded text-xs">{TOOLS_CSV_HEADERS.slice(0, 6).join(", ")}…</code><br />
        Use <code className="bg-muted px-1 rounded text-xs">|</code> to separate multiple values in roles, tags, and complianceBadges columns.
        Existing slugs will be updated (upsert).
      </p>

      <div className="flex items-center gap-3">
        <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
        <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
          <Upload className="w-3.5 h-3.5 mr-1.5" /> Choose CSV
        </Button>
        {rows && (
          <span className="text-sm text-muted-foreground">{rows.length} row{rows.length !== 1 ? "s" : ""} ready</span>
        )}
      </div>

      {rows && rows.length > 0 && !result && (
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-lg border">
            <table className="text-xs w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  {Object.keys(rows[0]).map((h) => (
                    <th key={h} className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {rows.slice(0, 5).map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((v, j) => (
                      <td key={j} className="px-3 py-2 max-w-[120px] truncate text-muted-foreground">{v || "—"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length > 5 && (
              <p className="text-xs text-muted-foreground px-3 py-2 border-t">+ {rows.length - 5} more rows</p>
            )}
          </div>
          <Button size="sm" onClick={handleImport} disabled={bulkMutation.isPending}>
            {bulkMutation.isPending ? "Importing…" : `Import ${rows.length} tool${rows.length !== 1 ? "s" : ""}`}
          </Button>
        </div>
      )}

      {result && (
        <div className={`rounded-lg p-4 space-y-2 ${result.errors.length === 0 ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-amber-500/10 border border-amber-500/20"}`}>
          <div className="flex items-center gap-2">
            {result.errors.length === 0 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400" />
            )}
            <span className="text-sm font-medium">
              {result.imported} tool{result.imported !== 1 ? "s" : ""} imported
              {result.errors.length > 0 && `, ${result.errors.length} error${result.errors.length !== 1 ? "s" : ""}`}
            </span>
          </div>
          {result.errors.length > 0 && (
            <ul className="text-xs text-muted-foreground space-y-1 pl-6 list-disc">
              {result.errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          )}
          <Button variant="ghost" size="sm" className="text-xs" onClick={() => { setRows(null); setResult(null); if (fileRef.current) fileRef.current.value = ""; }}>
            Upload another file
          </Button>
        </div>
      )}
    </div>
  );
}

export function ToolsTab() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTool, setEditTool] = useState<AdminTool | null>(null);
  const [csvOpen, setCsvOpen] = useState(false);

  const { data: tools, isLoading } = useListAdminTools({
    query: { queryKey: getListAdminToolsQueryKey() },
  });
  const { data: categories } = useListCategories({
    query: { queryKey: getListCategoriesQueryKey() },
  });

  const deleteMutation = useDeleteAdminTool({
    mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListAdminToolsQueryKey() }) },
  });

  const cats = (categories ?? []).map((c) => ({ id: c.id, name: c.name }));

  const filtered = (tools ?? []).filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return t.name.toLowerCase().includes(q) || t.categoryName.toLowerCase().includes(q) || t.slug.includes(q);
  });

  function openAdd() { setEditTool(null); setDialogOpen(true); }
  function openEdit(t: AdminTool) { setEditTool(t); setDialogOpen(true); }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search tools…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <span className="text-sm text-muted-foreground mr-auto">{(tools ?? []).length} tools</span>
        <Button variant="outline" size="sm" onClick={() => setCsvOpen((v) => !v)} className="gap-1.5">
          <Upload className="w-3.5 h-3.5" /> CSV Import
          {csvOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </Button>
        <Button size="sm" onClick={openAdd} className="gap-1.5">
          <Plus className="w-4 h-4" /> Add Tool
        </Button>
      </div>

      {csvOpen && <CSVUploadSection categories={cats} />}

      {isLoading ? (
        <div className="space-y-2">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Wrench className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>{search ? "No tools match your search." : "No tools yet."}</p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Tool</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Category</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Pricing</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Security</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Free</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((tool) => (
                <tr key={tool.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: tool.accentColor ?? "#6366f1" }} />
                      <div>
                        <p className="font-medium">{tool.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{tool.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{tool.categoryName}</td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className="text-xs font-normal">{tool.pricingModel.replace("_", " ")}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${tool.securityScore >= 80 ? "text-emerald-400" : tool.securityScore >= 60 ? "text-amber-400" : "text-red-400"}`}>
                      {tool.securityScore}/100
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm ${tool.hasFree ? "text-emerald-400" : "text-muted-foreground"}`}>
                      {tool.hasFree ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEdit(tool)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          if (confirm(`Delete "${tool.name}"? This will also remove all its changelog entries and comments.`)) {
                            deleteMutation.mutate({ id: tool.id });
                          }
                        }}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ToolFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        initial={editTool}
        editId={editTool?.id}
        categories={cats}
      />
    </div>
  );
}
