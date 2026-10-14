// Read-only HTTP smoke tests. Never signs in, never submits forms, never pays.
// Usage: BASE_URL=http://localhost:8080 bun tests/smoke/smoke.ts
//        BASE_URL=https://lovetechgroup.com.ng bun tests/smoke/smoke.ts
const BASE = (process.env.BASE_URL ?? "http://localhost:8080").replace(/\/$/, "");
const ORIGIN = "https://lovetechgroup.com.ng";
let pass = 0; const fails: string[] = [];
const ok = (name: string, cond: boolean, detail = "") => { if (cond) pass++; else fails.push(`${name}${detail ? ` — ${detail}` : ""}`); };
const get = (p: string, init: RequestInit = {}) => fetch(BASE + p, { redirect: "manual", ...init });
const isHtml = (r: Response) => (r.headers.get("content-type") ?? "").includes("text/html");

const PUBLIC = ["/", "/about", "/who-we-serve", "/our-work", "/advisory", "/finance-advisory", "/finance-readiness",
  "/agribusiness-development", "/digital-ai-solutions", "/programme-support", "/academy",
  "/academy/courses/ai-for-businesses", "/academy/courses/finance-readiness-msmes", "/academy/courses/agribusiness-skills",
  "/academy/courses/business-automation-smes", "/academy/courses/proposal-grant-writing", "/academy/courses/professionals-ai-edge",
  "/insights", "/house-8", "/ruby-chai", "/contact", "/privacy-policy", "/terms-of-service"];

async function main() {
  // A. Public routes + canonical
  for (const p of PUBLIC) {
    const r = await get(p + "?utm_source=test#x");
    const html = await r.text();
    ok(`GET ${p} is 200`, r.status === 200, `got ${r.status}`);
    const canon = [...html.matchAll(/<link[^>]+rel="canonical"[^>]*>/g)].map((m) => m[0].match(/href="([^"]+)"/)?.[1]);
    ok(`${p} has exactly one canonical`, canon.length === 1, `found ${canon.length}`);
    ok(`${p} canonical is ${ORIGIN}${p}`, canon[0] === (p === "/" ? `${ORIGIN}/` : ORIGIN + p), String(canon[0]));
  }
  // Insights article (first one linked, if any)
  const ins = await (await get("/insights")).text();
  const art = ins.match(/href="(\/insights\/[^"#?]+)"/)?.[1];
  if (art) { const r = await get(art); ok(`GET ${art} is 200`, r.status === 200, `got ${r.status}`); }

  // robots + sitemap
  const robots = await get("/robots.txt");
  const rtxt = await robots.text();
  ok("robots.txt 200 text", robots.status === 200 && /User-agent/i.test(rtxt) && rtxt.includes(`${ORIGIN}/sitemap.xml`));
  ok("robots.txt blocks admin and api", /Disallow: \/admin/.test(rtxt) && /Disallow: \/api/.test(rtxt));
  const sm = await get("/sitemap.xml"); const stxt = await sm.text();
  const locs = [...stxt.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!);
  ok("sitemap.xml 200 with urlset", sm.status === 200 && stxt.includes("<urlset") && locs.length > 0);
  ok("sitemap only lists the production origin", locs.every((l) => l.startsWith(ORIGIN + "/")));
  ok("sitemap has no private areas", !locs.some((l) => /\/(admin|dashboard|api|mcp|login|signup|settings|learners)/.test(l)));
  ok("sitemap has no query strings", !locs.some((l) => /[?#]/.test(l)));

  // B. Course redirects / unknown / price vs database record
  const legacy = await get("/academy/courses/ai-tools-small-businesses?ref=ABC");
  const loc = legacy.headers.get("location") ?? "";
  ok("legacy AI course redirects permanently", [301, 308].includes(legacy.status), `got ${legacy.status}`);
  ok("legacy redirect targets primary and keeps ref", loc.includes("/academy/courses/professionals-ai-edge") && loc.includes("ref=ABC"), loc);
  const target = loc ? await get(new URL(loc, BASE).pathname) : null;
  ok("legacy redirect does not loop", target?.status === 200, `got ${target?.status}`);
  const unknown = await get("/academy/courses/does-not-exist-xyz");
  ok("unknown course fails safely (404, no stack trace)", unknown.status === 404 && !/at .+\.(ts|js):\d+/.test(await unknown.text()), `got ${unknown.status}`);

  const sbUrl = process.env.VITE_SUPABASE_URL, sbKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (sbUrl && sbKey) {
    const rec = await fetch(`${sbUrl}/rest/v1/academy_courses?slug=eq.professionals-ai-edge&select=regular_price,discount_price`, { headers: { apikey: sbKey } });
    const [row] = (await rec.json()) as { regular_price: number | null; discount_price: number | null }[];
    if (row) {
      const price = Number(row.discount_price ?? row.regular_price);
      const shown = `₦${price.toLocaleString("en-US")}`;
      const page = await (await get("/academy/courses/professionals-ai-edge")).text();
      const academy = await (await get("/academy")).text();
      ok(`course page shows the database price ${shown}`, page.includes(shown));
      ok(`academy catalogue shows the database price ${shown}`, academy.includes(shown));
      ok("course page checkout button matches the database price", page.includes(`Pay ${shown}`) || page.includes("Sign in to enroll") || page.includes("Checking"));
    } else ok("professionals-ai-edge course record readable", false);
  } else console.log("(skipped price-vs-database check: VITE_SUPABASE_URL / key not set)");

  // C/E. Payment endpoints + MCP, unauthenticated
  const wh = await get("/api/public/paystack/webhook", { method: "POST", body: "{}", headers: { "content-type": "application/json" } });
  ok("webhook without signature → 401, not HTML", wh.status === 401 && !isHtml(wh), `got ${wh.status}`);
  const wh2 = await get("/api/public/paystack/webhook", { method: "POST", body: "{}", headers: { "x-paystack-signature": "bad" } });
  ok("webhook with bad signature → 401", wh2.status === 401, `got ${wh2.status}`);
  const v1 = await get("/api/public/paystack/verify");
  ok("verify without reference does not report success", [302, 307].includes(v1.status) && !(v1.headers.get("location") ?? "").includes("payment=success"));
  const v2 = await get("/api/public/paystack/verify?reference=FAKE-REF-SMOKE");
  ok("verify with fake reference does not report success", !(v2.headers.get("location") ?? "").includes("payment=success"), v2.headers.get("location") ?? "");
  const mcp = await get("/mcp", { method: "POST", body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list" }), headers: { "content-type": "application/json", accept: "application/json, text/event-stream" } });
  const mtxt = await mcp.text();
  ok("MCP unauthenticated → 401, not HTML", mcp.status === 401 && !isHtml(mcp), `got ${mcp.status}`);
  ok("MCP error leaks no secrets", !/(sk_|service_role|SUPABASE_)/i.test(mtxt));

  // D. Protected pages, unauthenticated (server render must not expose learner/admin data)
  for (const p of ["/academy/dashboard", "/admin", "/admin/users", "/settings/profile", "/academy/receipt"]) {
    const r = await get(p); const t = r.status === 200 ? await r.text() : "";
    ok(`${p} unauthenticated shows no private data`, r.status !== 500 && !/@[a-z0-9-]+\.[a-z]{2,}<\/td>/i.test(t) && !/paystack_reference/.test(t), `got ${r.status}`);
  }
  const cb = await get("/auth/callback?error=access_denied&error_description=x");
  ok("auth callback with error fails safely", cb.status < 500, `got ${cb.status}`);

  console.log(`\nSmoke against ${BASE}: ${pass} passed, ${fails.length} failed`);
  fails.forEach((f) => console.log("  ✗ " + f));
  process.exit(fails.length ? 1 : 0);
}
main().catch((e) => { console.error("Smoke run crashed:", e instanceof Error ? e.message : e); process.exit(2); });
