import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/layout";
import { Home } from "@/pages/home";
import { Browse } from "@/pages/browse";
import { Search } from "@/pages/search";
import { ToolDetail } from "@/pages/tool-detail";
import { Category } from "@/pages/category";
import { Role } from "@/pages/role";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/browse" component={Browse} />
        <Route path="/search" component={Search} />
        <Route path="/tool/:slug" component={ToolDetail} />
        <Route path="/category/:slug" component={Category} />
        <Route path="/role/:slug" component={Role} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
