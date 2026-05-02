import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListAdminComments, useDeleteAdminComment,
  getListAdminCommentsQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Search, MessageSquare, ExternalLink } from "lucide-react";
import { Link } from "wouter";

export function CommentsTab() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: comments, isLoading } = useListAdminComments({
    query: { queryKey: getListAdminCommentsQueryKey() },
  });

  const deleteMutation = useDeleteAdminComment({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListAdminCommentsQueryKey() }),
    },
  });

  const filtered = (comments ?? []).filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.content.toLowerCase().includes(q) ||
      c.userDisplayName.toLowerCase().includes(q) ||
      (c.toolName ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search comments…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <span className="text-sm text-muted-foreground">
          {filtered.length} comment{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-2">{[1,2,3,4].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>{search ? "No comments match your search." : "No comments yet."}</p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Tool</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">User</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Comment</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((comment) => (
                <tr key={comment.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    {comment.toolSlug ? (
                      <Link href={`/tool/${comment.toolSlug}`}>
                        <span className="text-primary hover:underline flex items-center gap-1">
                          {comment.toolName ?? comment.toolSlug}
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{comment.userDisplayName}</td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="truncate text-muted-foreground">{comment.content}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {new Date(comment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        if (confirm(`Delete this comment by "${comment.userDisplayName}"?`)) {
                          deleteMutation.mutate({ id: comment.id });
                        }
                      }}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
