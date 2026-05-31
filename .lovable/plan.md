# LoveTech Agrofinance & Development — Phase 1 Plan

## What this phase delivers

A complete public marketing site, an Academy preview area with a working enrolment flow (Paystack stubbed until keys arrive), Supabase-backed forms and auth, and a small AI-powered Course Video Script generator usable by signed-in admins. Admin dashboard, full LMS modules/resources/payments verification, and learner content delivery are deferred to a later phase.

## Step 1 — Design directions (before any build)

Capture the brand spec, then call `design--create_directions` to generate 3 rendered homepage concepts. All three are locked to:

- Vetiver Green `#1F4D3C`, Harvest Ochre `#C8941F`, Signal Teal `#2B7A78`, Bone `#F5F1E8`, Ink `#1A1F1C`, Academy purple `#5B2BBF`
- Refined serif headings + clean sans body
- Nigerian MSME / agribusiness / AI-enabled context, premium-but-accessible, mobile-first

Variants will differ in composition, hero treatment, density, and how the Academy is featured. You pick one; that direction's tokens go verbatim into `src/styles.css` and structural choices (hero layout, card style, section rhythm) are matched exactly.

## Step 2 — Foundation

- Enable Lovable Cloud (Supabase + auth + storage)
- Create design tokens in `src/styles.css` from the chosen direction
- Site shell in `src/routes/__root.tsx`: top nav (Home, About, Services, Programmes, Finance Readiness Diagnostic, Academy, Insights, Contact) + "Book a Consultation" CTA, plus footer
- Provision `LOVABLE_API_KEY` for the AI script generator

## Step 3 — Public pages

Each is its own route with unique `head()` metadata (title, description, og):

- `/` Home — hero, What We Do (6 services), Why Us, Featured Solutions (3), Academy preview (3 course cards), Who We Serve, 5-step Approach, CTA band
- `/about` — mission, vision, values, focus areas
- `/services` — 6 detailed service blocks with per-service CTA
- `/programmes` — current + 3 upcoming programmes
- `/finance-readiness` — diagnostic intro + 13-field enquiry form → `diagnostic_requests`
- `/insights` — placeholder posts list (static content, table ready for later)
- `/contact` — contact form → `enquiries`, with WhatsApp/email/location
- `/privacy`, `/terms` — placeholder pages

Generated hero/section imagery via `imagegen` saved under `src/assets/`.

## Step 4 — Auth

- Email/password + Google sign-in (via Lovable broker + `configure_social_auth`)
- `/login`, `/signup`, `/reset-password`
- `_authenticated` layout for protected routes
- `profiles` table auto-populated by signup trigger
- `user_roles` table with `app_role` enum (`admin`, `learner`) + `has_role()` security-definer for future admin gating

## Step 5 — Academy

- `/academy` — Academy landing (purple accent variant of the brand), 3 course cards
- `/academy/courses/professionals-ai-edge` — full course page (modules, outcomes, pricing ₦10,000 → ₦1,000, contact 08026065189), "Enroll Now" CTA
- `/academy/courses/icss-2-0-entrepreneurship` — Coming Soon + waitlist form → `academy_waitlist`
- `/academy/courses/finance-readiness-msmes` — Coming Soon + waitlist
- `/_authenticated/academy/dashboard` — minimal "My Courses" list reading from `academy_enrolments`

## Step 6 — Enrolment + Paystack (stubbed)

- Enroll button → requires sign-in → enrolment form → creates row in `academy_enrolments` (status `pending_payment`)
- Paystack init/verify wired as `createServerFn` handlers reading `process.env.PAYSTACK_SECRET_KEY`; when key is absent, the flow shows a "Payment coming soon — you've been registered, we'll contact you" confirmation and stores the enrolment. When you add the key later, the same flow goes live without code changes.
- `academy_payments` row created on init; verified server-side; on success, `access_status` flips to `active`

## Step 7 — Course Video Studio (admin, AI-powered)

- `/_authenticated/admin/video-studio` (gated by `has_role('admin')`)
- Form (course, module, lesson topic, audience, duration, key points, example, activity, CTA)
- `createServerFn` calls Lovable AI Gateway (`google/gemini-3-flash-preview`) with a structured prompt returning the 12-part script
- Save to `video_script_prompts`; preload the 10 Professionals AI Edge + 6 ICSS 2.0 prompt templates from the spec

## Step 8 — Database

Migration creates all spec tables with proper `GRANT`s and RLS:
`enquiries`, `diagnostic_requests`, `academy_courses`, `academy_enrolments`, `academy_payments`, `academy_modules`, `academy_resources`, `academy_waitlist`, `video_script_prompts`, `blog_posts`, plus `profiles` and `user_roles`.

RLS shape:

- Public-write/admin-read for enquiry-style tables (`enquiries`, `diagnostic_requests`, `academy_waitlist`)
- `academy_courses`, `academy_modules`, `blog_posts`: public read of published rows, admin write
- `academy_enrolments`, `academy_payments`: learner reads own, admin reads all, writes via server functions only
- `video_script_prompts`: admin only

Seed `academy_courses` with the 3 launch courses.

## Step 9 — QA

- Mobile viewport check on every public page
- Submit one row per public form and confirm DB writes
- Sign up, sign in with Google, hit `_authenticated` routes, run the video studio once
- Verify enrolment stub path end-to-end

## Deferred to next phase (not built now)

- Full admin dashboard (content/enrolments/waitlist management UI beyond Video Studio)
- Learner course content delivery (module pages, video player, resources/downloads UI)
- Live Paystack (waiting on keys)
- Blog post authoring UI
- Insights article detail pages with real content
- Announcements

## Technical notes

- Stack: TanStack Start + Supabase via Lovable Cloud, Tailwind v4 with tokens in `src/styles.css`
- All DB writes from public forms go through `createServerFn` with Zod validation
- AI calls server-only; `LOVABLE_API_KEY` never reaches the client
- Paystack secret will be added via `add_secret` when you're ready; until then, the enrolment path stores the lead and shows a "we'll reach out" state