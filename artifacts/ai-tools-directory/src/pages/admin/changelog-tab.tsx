import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListAdminChangelog, useCreateAdminChangelog, useUpdateAdminChangelog,
  useDeleteAdminChangelog, useBulkImportAdminChangelog, useListAdminTools,
  getListAdminChangelogQueryKey, getListAdminToolsQueryKey,
  type AdminChangelogEntry, type AdminChangelogInput,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { parseCSV, downloadCSVTemplate, CHANGELOG_CSV_HEADERS, CHANGELOG_CSV_EXAMPLE } from "@/lib/csv-parser";
import {
  Plus, Pencil, Trash2, Search, Upload, Download,
  CheckCircle2, AlertCircle, History, Zap, Star, Bug, AlertTriangle,
  ChevronDown, ChevronUp,
} from "lucide-react";

const CHANGELOG_TYPES = ["feature", "improvement", "fix", "breaking"] as const;
type ChangelogType = typeof CHANGELOG_TYPES[number];

const TYPE_CONFIG: Record<ChangelogType, { label: string; color: string; icon: React.ReactNode }> = {
  feature:     { label: "Feature",     color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", icon: <Zap className="w-3 h-3" /> },
  improvement: { label: "Improvement", color: "text-blue-400 bg-blue-400/10 border-blue-400/20",         icon: <Star className="w-3 h-3" /> },
  fix:         { label: "Bug Fix",     color: "text-amber-400 bg-amber-400/10 border-amber-400/20",       icon: <Bug className="w-3 h-3" /> },
  breaking:    { label: "Breaking",    color: "text-red-400 bg-red-400/10 border-red-400/20",             icon: <AlertTriangle className="w-3 h-3" /> },
};

function toDateInput(date?: string | Date) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

function ChangelogFormDialog({
  open, onClose, initial, editId, tools,
}: {
  open: boolean;
  onClose: () => void;
  initial?: AdminChangelogEntry | null;
  editId?: number | null;
  tools: { id: number; name: string; slug: string }[];
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<Partial<AdminChangelogInput>>(
    initial ? {
      toolId: initial.toolId,
      version: initial.version,
      title: initial.title,
      description: initial.description,
      type: initial.type as ChangelogType,
      releaseDate: toDateInput(initial.releaseDate),
    } : {
      toolId: undefined,
      version: "",
      title: "",
      description: "",
      type: "feature",
      releaseDate: toDateInput(new Date()),
    }
  );

  const set = (k: keyof AdminChangelogInput, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const createMutation = useCreateAdminChangelog({
    mutation: { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListAdminChangelogQueryKey() }); onClose(); } },
  });
  const updateMutation = useUpdateAdminChangelog({
    mutation: { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListAdminChangelogQueryKey() }); onClose(); } },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  function handleSubmit() {
    const data: AdminChangelogInput = {
      toolId: Number(form.toolId),
      version: form.version!,
      title: form.title!,
      description: form.description!,
      type: form.type!,
      releaseDate: form.releaseDate!,
    };
    if (editId) {
      updateMutation.mutate({ id: editId, data });
    } else {
      createMutation.mutate({ data });
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editId ? "Edit Changelog Entry" : "Add Changelog Entry"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Tool <span className="text-destructive">*</span></Label>
            <Select value={String(form.toolId ?? "")} onValueChange={(v) => set("toolId", Number(v))}>
              <SelectTrigger><SelectValue placeholder="Select tool…" /></SelectTrigger>
              <SelectContent>
                {tools.map((t) => (
                  <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Version <span className="text-destructive">*</span></Label>
              <Input value={form.version ?? ""} onChange={(e) => set("version", e.target.value)} placeholder="2.5.0" />
            </div>
            <div className="space-y-1.5">
              <Label>Release Date <span className="text-destructive">*</span></Label>
              <Input type="date" value={form.releaseDate ?? ""} onChange={(e) => set("releaseDate", e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Type <span className="text-destructive">*</span></Label>
            <Select value={form.type ?? "feature"} onValueChange={(v) => set("type", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CHANGELOG_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{TYPE_CONFIG[t].label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Title <span className="text-destructive">*</span></Label>
            <Input value={form.title ?? ""} onChange={(e) => set("title", e.target.value)} placeholder="New AI model with 2× better accuracy" />
          </div>
          <div className="space-y-1.5">
            <Label>Description <span className="text-destructive">*</span></Label>
            <Textarea rows={3} value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} placeholder="Detailed description of what changed and why it matters…" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isPending}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Saving…" : editId ? "Save Changes" : "Create Entry"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ChangelogCSVSection({ tools }: { tools: { id: number; slug: string }[] }) {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<Record<string, string>[] | null>(null);
  const [result, setResult] = useState<{ imported: number; errors: string[] } | null>(null);

  const bulkMutation = useBulkImportAdminChangelog({
    mutation: {
      onSuccess: (data) => {
        setResult(data);
        queryClient.invalidateQueries({ queryKey: getListAdminChangelogQueryKey() });
      },
    },
  });

  const slugToId = new Map(tools.map((t) => [t.slug, t.id]));

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setRows(parseCSV(ev.target?.result as string)); setResult(null); };
    reader.readAsText(file);
  }

  function handleImport() {
    if (!rows) return;
    const data = rows.map((row) => ({
      toolId: Number(row.toolId) || slugToId.get(row.toolSlug) || 0,
      version: row.version,
      title: row.title,
      description: row.description,
      type: row.type,
      releaseDate: row.releaseDate,
    })) as any;
    bulkMutation.mutate({ data });
  }

  return (
    <div className="border rounded-xl p-5 space-y-4 bg-muted/20">
      <div className="flex items-center justify-between">
        <p className="font-medium text-sm">Bulk Import via CSV</p>
        <Button variant="ghost" size="sm" className="text-muted-foreground text-xs gap-1.5"
          onClick={() => downloadCSVTemplate("changelog-template.csv", CHANGELOG_CSV_HEADERS, CHANGELOG_CSV_EXAMPLE)}>
          <Download className="w-3.5 h-3.5" /> Download Template
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Headers: <code className="bg-muted px-1 rounded">{CHANGELOG_CSV_HEADERS.join(", ")}</code><br />
        Use <code className="bg-muted px-1 rounded">toolSlug</code> (e.g. <code className="bg-muted px-1 rounded">cursor</code>) or <code className="bg-muted px-1 rounded">toolId</code>.
        Type must be one of: <code className="bg-muted px-1 rounded">feature | improvement | fix | breaking</code>.
      </p>
      <div className="flex items-center gap-3">
        <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
        <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
          <Upload className="w-3.5 h-3.5 mr-1.5" /> Choose CSV
        </Button>
        {rows && <span className="text-sm text-muted-foreground">{rows.length} row{rows.length !== 1 ? "s" : ""} ready</span>}
      </div>

      {rows && rows.length > 0 && !result && (
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-lg border">
            <table className="text-xs w-full">
              <thead className="bg-muted/50 border-b">
                <tr>{Object.keys(rows[0]).map((h) => <th key={h} className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {rows.slice(0, 4).map((row, i) => (
                  <tr key={i}>{Object.values(row).map((v, j) => <td key={j} className="px-3 py-2 max-w-[100px] truncate text-muted-foreground">{v || "—"}</td>)}</tr>
                ))}
              </tbody>
            </table>
            {rows.length > 4 && <p className="text-xs text-muted-foreground px-3 py-2 border-t">+ {rows.length - 4} more rows</p>}
          </div>
          <Button size="sm" onClick={handleImport} disabled={bulkMutation.isPending}>
            {bulkMutation.isPending ? "Importing…" : `Import ${rows.length} entr${rows.length !== 1 ? "ies" : "y"}`}
          </Button>
        </div>
      )}

      {result && (
        <div className={`rounded-lg p-4 space-y-2 ${result.errors.length === 0 ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-amber-500/10 border border-amber-500/20"}`}>
          <div className="flex items-center gap-2">
            {result.errors.length === 0 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-amber-400" />}
            <span className="text-sm font-medium">{result.imported} entr{result.imported !== 1 ? "ies" : "y"} imported{result.errors.length > 0 && `, ${result.errors.length} error${result.errors.length !== 1 ? "s" : ""}`}</span>
          </div>
          {result.errors.length > 0 && <ul className="text-xs text-muted-foreground space-y-1 pl-6 list-disc">{result.errors.map((e, i) => <li key={i}>{e}</li>)}</ul>}
          <Button variant="ghost" size="sm" className="text-xs" onClick={() => { setRows(null); setResult(null); if (fileRef.current) fileRef.current.value = ""; }}>Upload another file</Button>
        </div>
      )}
    </div>
  );
}

export function ChangelogTab() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterTool, setFilterTool] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<AdminChangelogEntry | null>(null);
  const [csvOpen, setCsvOpen] = useState(false);

  const { data: entries, isLoading } = useListAdminChangelog({
    query: { queryKey: getListAdminChangelogQueryKey() },
  });
  const { data: tools } = useListAdminTools({
    query: { queryKey: getListAdminToolsQueryKey() },
  });

  const deleteMutation = useDeleteAdminChangelog({
    mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListAdminChangelogQueryKey() }) },
  });

  const toolsList = (tools ?? []).map((t) => ({ id: t.id, name: t.name, slug: t.slug }));

  const filtered = (entries ?? []).filter((e) => {
    if (filterTool !== "all" && String(e.toolId) !== filterTool) return false;
    if (search) {
      const q = search.toLowerCase();
      return e.title.toLowerCase().includes(q) || (e.toolName ?? "").toLowerCase().includes(q);
    }
    return true;
  });

  function openAdd() { setEditEntry(null); setDialogOpen(true); }
  function openEdit(e: AdminChangelogEntry) { setEditEntry(e); setDialogOpen(true); }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search entries…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterTool} onValueChange={setFilterTool}>
          <SelectTrigger className="w-44"><SelectValue placeholder="All tools" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tools</SelectItem>
            {toolsList.map((t) => <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground mr-auto">{filtered.length} entr{filtered.length !== 1 ? "ies" : "y"}</span>
        <Button variant="outline" size="sm" onClick={() => setCsvOpen((v) => !v)} className="gap-1.5">
          <Upload className="w-3.5 h-3.5" /> CSV Import
          {csvOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </Button>
        <Button size="sm" onClick={openAdd} className="gap-1.5">
          <Plus className="w-4 h-4" /> Add Entry
        </Button>
      </div>

      {csvOpen && <ChangelogCSVSection tools={toolsList} />}

      {isLoading ? (
        <div className="space-y-2">{[1,2,3,4].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <History className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>{search ? "No entries match your search." : "No changelog entries yet."}</p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Tool</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Version</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((entry) => {
                const cfg = TYPE_CONFIG[entry.type as ChangelogType] ?? TYPE_CONFIG.feature;
                return (
                  <tr key={entry.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium">{entry.toolName ?? `#${entry.toolId}`}</td>
                    <td className="px-4 py-3"><code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">v{entry.version}</code></td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded border ${cfg.color}`}>
                        {cfg.icon}{cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="truncate">{entry.title}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(entry.releaseDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEdit(entry)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => {
                            if (confirm("Delete this changelog entry?")) {
                              deleteMutation.mutate({ id: entry.id });
                            }
                          }}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ChangelogFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        initial={editEntry}
        editId={editEntry?.id}
        tools={toolsList}
      />
    </div>
  );
}
