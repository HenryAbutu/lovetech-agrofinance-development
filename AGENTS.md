# Architecture rules
- Store approved legal documents as Markdown source in `src/content` and render both through the shared `LegalDocument` component so their layout remains consistent without altering approved copy.
- Use `LegalNotice` for consent links at authentication, registration, enquiry and checkout controls so all forms point to the same canonical legal pages.
- Keep `/privacy` and `/terms` as permanent redirects to the canonical legal URLs so existing links remain usable.- Keep agent-integration (MCP) tools in `src/lib/mcp/` and query the database only as the signed-in caller, so connected assistants never see another user's data.
