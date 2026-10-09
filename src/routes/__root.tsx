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

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
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
      { title: "LoveTech Group — Advisory, Academy, Hospitality & Wellness" },
      { name: "description", content: "LoveTech Group builds structured, fundable, growth-ready enterprises and premium lifestyle experiences through LoveTech Advisory & Academy, House 8 Shortlet Apartments and Ruby Chai Wellness." },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "LoveTech Group — Advisory, Academy, Hospitality & Wellness" },
      { name: "twitter:title", content: "LoveTech Group — Advisory, Academy, Hospitality & Wellness" },
      { property: "og:description", content: "LoveTech Group builds structured, fundable, growth-ready enterprises and premium lifestyle experiences through LoveTech Advisory & Academy, House 8 Shortlet Apartments and Ruby Chai Wellness." },
      { name: "twitter:description", content: "LoveTech Group builds structured, fundable, growth-ready enterprises and premium lifestyle experiences through LoveTech Advisory & Academy, House 8 Shortlet Apartments and Ruby Chai Wellness." },
      { name: "theme-color", content: "#102A43" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: "/icon-512.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/icon-512.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" },
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

      // The OAuth callback page owns the post-sign-in redirect; don't race it.
      if (window.location.pathname.startsWith("/auth/callback")) return;
      if (event !== "SIGNED_IN" && event !== "USER_UPDATED") return;
      const hasValidSession = Boolean(session?.user);

      window.setTimeout(() => {
        void router.invalidate();
        if (hasValidSession) void qc.invalidateQueries();

        if (hasValidSession && event === "SIGNED_IN") {
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
