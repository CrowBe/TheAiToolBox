import { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import { Switch, Route, useLocation, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/layout";
import { Home } from "@/pages/home";
import { Browse } from "@/pages/browse";
import { Search } from "@/pages/search";
import { ToolDetail } from "@/pages/tool-detail";
import { Category } from "@/pages/category";
import { Role } from "@/pages/role";
import { Toolbox } from "@/pages/toolbox";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "#ffffff",
    colorForeground: "#fafafa",
    colorMutedForeground: "#9ca3af",
    colorDanger: "#ef4444",
    colorBackground: "#0f0f10",
    colorInput: "#18181f",
    colorInputForeground: "#fafafa",
    colorNeutral: "#27272f",
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-[#0f0f10] border border-[#27272f] rounded-2xl w-[440px] max-w-full overflow-hidden shadow-2xl",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-white font-bold text-2xl",
    headerSubtitle: "text-[#9ca3af] text-sm",
    socialButtonsBlockButtonText: "text-white font-medium",
    formFieldLabel: "text-[#d1d5db] text-sm font-medium",
    footerActionLink: "text-white font-semibold hover:text-white/80",
    footerActionText: "text-[#9ca3af]",
    dividerText: "text-[#9ca3af] text-xs",
    identityPreviewEditButton: "text-white",
    formFieldSuccessText: "text-green-400",
    alertText: "text-[#fafafa]",
    logoBox: "flex justify-center py-2",
    logoImage: "h-8 w-auto",
    socialButtonsBlockButton: "border border-[#27272f] bg-[#18181f] hover:bg-[#222229] text-white",
    formButtonPrimary: "bg-white text-black hover:bg-white/90 font-semibold",
    formFieldInput: "bg-[#18181f] border-[#27272f] text-white placeholder-[#6b7280]",
    footerAction: "bg-[#0a0a0f] border-t border-[#27272f]",
    dividerLine: "bg-[#27272f]",
    alert: "bg-[#1a1a20] border border-[#27272f]",
    otpCodeFieldInput: "bg-[#18181f] border-[#27272f] text-white",
    formFieldRow: "gap-4",
    main: "gap-6",
  },
};

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

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
        <Route path="/toolbox">
          <Show when="signed-in">
            <Toolbox />
          </Show>
          <Show when="signed-out">
            <SignInPage />
          </Show>
        </Route>
        <Route path="/sign-in/*?" component={SignInPage} />
        <Route path="/sign-up/*?" component={SignUpPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: "Welcome back",
            subtitle: "Sign in to access your AI toolbox",
          },
        },
        signUp: {
          start: {
            title: "Build your AI toolbox",
            subtitle: "Create an account to start saving tools",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
