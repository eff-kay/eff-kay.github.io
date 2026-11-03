# From APIs to MCP to distribution — combined preview

**32 slides**, combining the latest API-first experiment with the remaining version-1 material. This expanded review draft does not assert a 15-minute runtime. Both source decks remain separate.

Local: http://127.0.0.1:8766/combined-preview/MCP-API-to-marketplace.html

Public: https://eff-kay.github.io/talks/mcp/combined/

## Sequence

| Slides | Section | What happens |
|---|---|---|
| 1 | Introduction | Faizan / Docsalot |
| 2–7 | Explain capabilities | Maya’s task, APIs, function descriptions and execution |
| 8–13 | Extend and change | Identity, confirmation, cancellation, new functionality and model/host changes |
| 14–18 | Derive the protocol | Discovery, calls, host/client/server, resources/prompts, compact results |
| 19–23 | Use the store | Version-1 tool menu and architecture, then search/quote, purchase and cancellation |
| 24–28 | Distribute | Distribution motivation, ChatGPT, Claude, packages and ecosystem logos |
| 29–31 | Launch and learn | Why distribute, review gotchas, before/during/after checklist |
| 32 | Questions | Apply the model to another store |

The imported slides are version-1 slides 7–20. Its supporting tool menu is moved before execution, and packages/ecosystem examples sit beside distribution. The opening, provider-API diagrams and transition notes are adapted for the combined narrative. `source-map.json` records the original source of every slide and hashes the source decks. The six-section bottom ribbon counts content steps rather than minutes.

## Review controls

- Arrow keys navigate; Home/End jump to the first/last slide.
- **N** opens first-person speaking notes.
- **O** opens the 32-slide overview.
- **F** enters fullscreen; Escape dismisses panels.
- The large JSON response on slide 18 can be scrolled.

`MCP-API-to-marketplace.html` and `index.html` are identical, self-contained copies. Fonts, logo, portrait, diagrams, ecosystem marks and notes are embedded, with font/icon licenses. Plus Jakarta Sans matches the selected Docsalot wordmark in the branding archive. Headings use a lighter 600 weight and looser spacing on a pure-white canvas; JetBrains Mono is used for code. `theme.css` holds the white-background and heading overrides and is embedded during the build.

Edit `content.json` / `spoken-notes.json`, then run `python3 build.py`. `outline.md` and `speaker-notes.md` are generated alongside the HTML.

## Companions

- [Submission checklist](submission-playbook.md)
- [Ecosystem routes](ecosystem-routes.md)
- [Package downloads and profile guide](https://eff-kay.github.io/talks/mcp/buyer/packages/)
- [Run the store inside Codex](https://github.com/eff-kay/atlas-mcp-python-tutorials/tree/main/store/codex-demo)
- [API-first source notes](research-api-first.md)
- [Version-1 source notes](research-version-1.md)
- [Original 20-slide API experiment](https://eff-kay.github.io/talks/mcp/api-first/)
- [Frozen final version 1](https://eff-kay.github.io/talks/mcp/final-version-1/)

All store data, transactions and example package endpoints are fictional. Marketplace material is reused from version 1’s sourced research; this preview does not perform or claim submission/approval. Instinct’s public route remains unverified, as indicated on the ecosystem slide.

## Browser chatbot and provider switch

The current example is **our own browser chatbot**: browser → our backend → OpenAI API, with the backend executing store functions. Slide 12 switches that same backend to Claude’s API. Later, slide 24 starts a separate distribution phase in the ChatGPT/Claude consumer products. The earlier Custom GPT/Actions framing is superseded for this combined preview.

- Slide 2: browser/backend/model-API boundaries.
- Slides 6–7: OpenAI function definitions and the backend tool loop.
- Slide 12: OpenAI Responses vs Claude Messages, including tool-schema wrappers and result envelopes.
- Slides 16/20: model-provider adapter and MCP client inside our backend.
- [Primary references](research-browser-api.md) and [backend call templates](examples/provider-api-excerpts.py).

Model IDs, configured clients and provider-specific conversation objects are supplied by the application. The snippets were syntax checked, not executed against paid model APIs. A provider swap still needs adaptation/evaluation; MCP standardizes the store-facing connection.
