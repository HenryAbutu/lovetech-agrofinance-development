import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader, SiteFooter, NextStepBand } from "../components/site-chrome";
import { WhatsAppSupportButton } from "../components/whatsapp-support";
import { Toaster } from "../components/ui/sonner";
import { clearSupabaseAuthStorage, supabase } from "../lib/supabase";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl text-vetiver">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-sm bg-vetiver px-4 py-2 text-sm font-medium text-bone hover:opacity-90">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong on our end.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-sm bg-vetiver px-4 py-2 text-sm font-medium text-bone hover:opacity-90"
          >Try again</button>
          <a href="/" className="rounded-sm border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent/10">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LoveTech Agrofinance & Development Ltd" },
      { name: "description", content: "Capital, capacity, and tech-enabled advisory for agribusinesses, MSMEs, and development programmes across Nigeria and West Africa." },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "LoveTech Agrofinance & Development Ltd" },
      { name: "twitter:title", content: "LoveTech Agrofinance & Development Ltd" },
      { property: "og:description", content: "Capital, capacity, and tech-enabled advisory for agribusinesses, MSMEs, and development programmes across Nigeria and West Africa." },
      { name: "twitter:description", content: "Capital, capacity, and tech-enabled advisory for agribusinesses, MSMEs, and development programmes across Nigeria and West Africa." },
      { name: "theme-color", content: "#0F8A5F" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/59ca814c-8eab-4263-9e5f-89ff2fcf5f35/id-preview-4386e8df--c3f7334e-7be8-4b3d-9020-76b04111d033.lovable.app-1780686818950.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/59ca814c-8eab-4263-9e5f-89ff2fcf5f35/id-preview-4386e8df--c3f7334e-7be8-4b3d-9020-76b04111d033.lovable.app-1780686818950.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: "/icon-512.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/icon-512.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function AuthSync() {
  const router = useRouter();
  const qc = useQueryClient();
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        // Hard reset: purge every cached auth artefact and force a fresh
        // navigation to /login so no stale session lingers in memory.
        try {
          void qc.cancelQueries();
          qc.clear();
        } catch { /* noop */ }
        try { clearSupabaseAuthStorage(); } catch { /* noop */ }
        try { window.sessionStorage.removeItem("lovetech_post_auth_redirect"); } catch { /* noop */ }
        if (window.location.pathname !== "/login") {
          window.location.assign("/login");
        }
        return;
      }

      const hasValidSession = Boolean(session?.user);
      const shouldRefreshRouter = hasValidSession || event === "USER_UPDATED";
      if (!shouldRefreshRouter) return;

      window.setTimeout(() => {
        void router.invalidate();
        if (hasValidSession) void qc.invalidateQueries();

        if (hasValidSession && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
          const redirectTo = window.sessionStorage.getItem("lovetech_post_auth_redirect");
          if (redirectTo) {
            window.sessionStorage.removeItem("lovetech_post_auth_redirect");
            void router.navigate({ to: redirectTo as never, replace: true });
          }
        }
      }, 0);
    });
    return () => subscription.unsubscribe();
  }, [router, qc]);
  return null;
}

function ServiceWorkerBoot() {
  useEffect(() => {
    import("../pwa/register").then((m) => m.registerServiceWorker());
  }, []);
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthSync />
      <ServiceWorkerBoot />
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <div className="flex-1">
          <Outlet />
        </div>
        <NextStepBand />
        <SiteFooter />
        <WhatsAppSupportButton />
      </div>
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  );
}
