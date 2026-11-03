# Deriving MCP: Maya’s API-first shopping assistant

A separate **20-slide experiment**, with first-person notes and 18 illustrated walkthrough slides in three acts. The previous deck is frozen in `../final-version-1/`; the existing final-buyer deck is unchanged.

Open locally: http://127.0.0.1:8766/first-principles-experiment/MCP-derived-from-APIs.html

1. **Expose the APIs:** Maya delegates a shopping task; expose catalog, address, delivery and order APIs; build the first ChatGPT action and executor.
2. **Make the AI work:** verified identity, quote-bound consent, cancellation/retries, useful results; then add other hosts and identify repeated integration work.
3. **Extract the protocol:** capability discovery, a shared call/result contract, host/client/server; resources and prompts; replay the same purchase and state what MCP does and does not solve.

The experiment is an architecture derivation, not a new runnable MCP server or a hand-written protocol implementation. The existing Python workshop remains available separately. No store/provider is real; no payment or purchase is executed. No claim that API integrations require MCP, or that consent, retries, context management and authorization are uniquely LLM problems.

## Presenter controls

Arrow keys navigate. **N** opens first-person notes. **O** opens the overview. **F** enters fullscreen. Escape dismisses panels; Home/End jump to the first/last slide. The bottom progress ribbon shows three six-slide acts and remaining walkthrough slides. This experiment makes no 15-minute runtime claim; the frozen version retains the earlier pacing plan.

## Files

- `MCP-derived-from-APIs.html` / `index.html`: identical, self-contained HTML with font, images and notes embedded.
- `content.json`: editable slide content and SVG diagrams.
- `spoken-notes.json`: editable first-person speaking draft.
- `speaker-notes.md`, `outline.md`: generated companion documents.
- `design-notebook.md`: API-first assumptions, call trace and requirements-to-MCP mapping.
- `research.md`: primary sources and video-review scope.
- `build.py`: renderer; run after content/note edits.
- `make_content.py`: initial authoring source; running it replaces content and notes.

Plus Jakarta Sans matches the selected Docsalot wordmark. Slide 5 uses embedded JetBrains Mono for the JSON/Python excerpts from the combined local store demo. Low-radius boxes, navy/blue/pale-paper colors, custom diagrams and large type continue the approved design. References stay in companion documents, not on projected slides.

## Run the same store inside Codex

[Combined local plugin demo](https://github.com/eff-kay/atlas-mcp-python-tutorials/tree/main/store/codex-demo) — one persistent MCP endpoint, local routing/delivery APIs, five store tools, two resources and one prompt.
