# Architecture rules
- Store approved legal documents as Markdown source in `src/content` and render both through the shared `LegalDocument` component so their layout remains consistent without altering approved copy.
- Use `LegalNotice` for consent links at authentication, registration, enquiry and checkout controls so all forms point to the same canonical legal pages.
- Keep `/privacy` and `/terms` as permanent redirects to the canonical legal URLs so existing links remain usable.- Keep agent-integration (MCP) tools in `src/lib/mcp/` and query the database only as the signed-in caller, so connected assistants never see another user's data.
- Keep user roles only in `user_roles` (never on profiles); `has_role(...,'admin')` also passes for super_admin, so every existing admin check covers super admins automatically.
- Keep homepage visual content separate from auth and LMS logic, and use shared Button variants for its CTAs, so presentation updates preserve learner workflows and navigation.
- Scope institutional website tokens and typography to public presentation wrappers and shared chrome; leave global learner tokens intact so the redesign cannot restyle protected learning tools.
- Keep public service content and shared presentation in website-only modules; preserve all existing route paths and use dedicated top-level service routes so new advisory pages cannot intercept existing diagnostic or LMS URLs.

- Keep public Academy discovery cards and shelves in website presentation modules, adapting existing catalogue metadata without changing course definitions or enrolment handlers; this isolates discovery styling from learner access.
- Gate LMS staff (admin, super_admin, facilitator) through `is_lms_staff()` in policies and keep admin-only writes on `has_role(...,'admin')`, so facilitators can review but never manage enrolments or cohorts.
- Build canonical links with `canonicalLink()` from `src/lib/seo.ts` (production origin with validated `VITE_SITE_URL` override) and keep `public/sitemap.xml` limited to indexable public pages, so search engines never index preview hosts or private areas.
