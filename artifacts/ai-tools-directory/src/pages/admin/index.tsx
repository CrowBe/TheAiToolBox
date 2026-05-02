import { useUser, useClerk } from "@clerk/react";
import { useGetAdminMe, getGetAdminMeQueryKey } from "@workspace/api-client-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldX, Wrench, History, MessageSquare, Copy, Check } from "lucide-react";
import { ToolsTab } from "./tools-tab";
import { ChangelogTab } from "./changelog-tab";
import { CommentsTab } from "./comments-tab";
import { useState } from "react";

function CopyableId({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-2 font-mono text-sm bg-muted px-3 py-1.5 rounded-lg border hover:bg-muted/80 transition-colors"
    >
      <span>{id}</span>
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
    </button>
  );
}

export function AdminPanel() {
  const { isSignedIn, isLoaded: userLoaded, user } = useUser();
  const { openSignIn } = useClerk();

  const { data: adminData, isLoading: checkingAdmin } = useGetAdminMe({
    query: { queryKey: getGetAdminMeQueryKey() },
  });

  if (!userLoaded || checkingAdmin) {
    return (
      <div className="container mx-auto max-w-screen-xl px-4 py-12 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="container mx-auto max-w-screen-xl px-4 py-24 flex flex-col items-center gap-6 text-center">
        <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
          <ShieldX className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Sign in required</h1>
          <p className="text-muted-foreground">You must be signed in with an admin account to access this panel.</p>
        </div>
        <Button onClick={() => openSignIn()}>
          <Wrench className="w-4 h-4 mr-2" /> Sign in
        </Button>
      </div>
    );
  }

  if (!adminData?.isAdmin) {
    const userId = adminData?.userId ?? user?.id ?? "unknown";
    return (
      <div className="container mx-auto max-w-screen-xl px-4 py-24 flex flex-col items-center gap-6 text-center">
        <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <ShieldX className="w-8 h-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground max-w-md">
            Your account is not in the admin allowlist. To grant yourself access, add your user ID to the{" "}
            <code className="bg-muted px-1 rounded text-sm">ADMIN_USER_IDS</code> environment variable and restart the server.
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Your Clerk user ID:</p>
          <CopyableId id={userId} />
        </div>
        <div className="bg-card border rounded-xl p-5 text-left max-w-md text-sm space-y-3 text-muted-foreground">
          <p className="font-medium text-foreground">How to grant admin access:</p>
          <ol className="list-decimal pl-4 space-y-1.5">
            <li>Copy your user ID above</li>
            <li>Open the <strong>Secrets</strong> tab in your Replit project</li>
            <li>Set <code className="bg-muted px-1 rounded">ADMIN_USER_IDS</code> to your user ID</li>
            <li>The API server will automatically pick it up on next restart</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-8 pb-24">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-muted-foreground mt-1">
            Manage tools, changelog entries, and user comments
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Signed in as</p>
          <p className="text-sm font-medium">{user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress}</p>
          <p className="text-xs text-muted-foreground font-mono">{user?.id}</p>
        </div>
      </div>

      <Tabs defaultValue="tools">
        <TabsList className="mb-8 w-full justify-start flex-wrap h-auto gap-1 bg-transparent border-b border-border rounded-none px-0 pb-0">
          <TabsTrigger value="tools" className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
            <Wrench className="w-3.5 h-3.5" /> Tools
          </TabsTrigger>
          <TabsTrigger value="changelog" className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
            <History className="w-3.5 h-3.5" /> Changelog
          </TabsTrigger>
          <TabsTrigger value="comments" className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
            <MessageSquare className="w-3.5 h-3.5" /> Comments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tools" className="mt-0"><ToolsTab /></TabsContent>
        <TabsContent value="changelog" className="mt-0"><ChangelogTab /></TabsContent>
        <TabsContent value="comments" className="mt-0"><CommentsTab /></TabsContent>
      </Tabs>
    </div>
  );
}
