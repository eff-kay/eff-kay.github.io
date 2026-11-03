# Private authoring ledger — checked November 3, 2026

Not a projected slide or a references appendix. Retained only so changing platform requirements can be rechecked.

- Video: https://www.youtube.com/watch?v=oblaHqULUHk — reviewed full auto-generated transcript and selected exact frames in the prior revision. Borrow the ecommerce teaching progression, not the script. Short API/MCP quote only. Host owns conversation context; direct API integrations can also protect secrets. Avoid absolute claims about integration counts, automatic security or model interchangeability.
- https://developers.openai.com/plugins/deploy/submission — current remote route: Plugins portal, package ZIP, verified publisher and submitter access, endpoint/domain/auth setup, scans, review evidence, approval then explicit publication. Five positive and three negative cases; dedicated review account; accessible walkthrough; release notes. Backend remains hosted by publisher. No production submission performed.
- https://developers.openai.com/plugins/deploy/submission-errors — automatic validation errors differ from review decisions.
- https://claude.com/docs/connectors/building/submission — current direct remote connector route is claude.ai/directory/manage, Submit new → MCP connector. Paid plans with appropriate roles; HTTPS; OAuth for user-account actions; titles/hints; in-product testing and listing/reviewer materials. Older cached help pages describing Team-only submissions or standalone MCPB listings conflict with this current dedicated guide; use the dedicated guide.
- https://claude.com/docs/connectors/building/review-criteria — separate read/write operations, accurate narrow descriptions and required hints, avoid unrelated behavioral instructions in tool metadata. Catch-all safe/unsafe method tools are rejected.
- https://claude.com/docs/plugins/submit — plugin bundle from connected GitHub source; local validation; private source can be validated but must be public before listing goes live. Submit author-owned remote server separately as connector.
- https://claude.com/resources/articles/build-plugins-for-claude — portal paths and approval/publication distinction.

Diagrams are illustrative, not screenshots of submission portals. This presentation does not establish this buyer workflow is eligible for either directory; product-specific commerce, data-use and third-party API permissions must be assessed before a real submission. The revised buyer example is one store exposing its own catalog and order capabilities, using a fictional address/distance service and delivery provider. The price fixture is $79 + $12 = $91, tax included, with a 12 km route and non-guaranteed Friday estimate. Explicitly confirmed order placement and ownership/state-checked cancellation are illustrative. Cancellation and payment reversal have separate outcomes. No transaction or approved listing is being claimed. References intentionally omitted from projected content at the user's request.

## Commerce clarification for the revised store example
- https://developers.openai.com/plugins/plugin-guidelines — physical-goods commerce and checkout requirements.
- https://developers.openai.com/plugins/build/monetization — generally available external merchant checkout; saved-payment and selected embedded flows have specific restrictions and requirements. Do not imply MCP listing approval enables unrestricted in-chat purchasing. Order placement in the story is a generic store capability, with host-specific checkout routing explained in the ChatGPT notes.

## Submission-summary revision
Rechecked OpenAI submission errors and plugin guidelines, plus Claude connector review criteria/submission. The closing summary separates automatic setup/validation blockers from human/policy review outcomes; its six buckets are an authored synthesis, not ranked rejection statistics. The companion submission-playbook.md expands them. No claim of personal marketplace submission history is introduced.

## Package and ecosystem expansion
- Verified selected logo typography in local branding archive: Plus Jakarta Sans (option 4), not Work Sans (option 5). Embedded the matching licensed font.
- User confirmed Muse as muse.ai and Instinct as instinct.com. Muse has a public connector intake; Instinct's product is verified but a public MCP/plugin intake remains unverified.
- Added 18 brand marks, grouped by connector/plugin catalogs, registry/discovery, and clients/emerging routes. Sources and scope are in assets/ecosystems/manifest.json and the tutorial repository publication/ecosystem-routes.md.
- Primary package reference: Anthropic productivity at commit 2574e29377c7173d0cecffef29a6ecbd7f8ccb5d, recommended by claude.com/docs/plugins/build. Also inspected OpenAI's official Figma package.
- Five TrailShop sample ZIPs and target-specific source layouts are in the public tutorial repository publication/dist. These are examples with fictional URLs, not deployed/authenticated store releases. Host review was not run.
- Current installed Hermes CLI lacks plugins validate; record portable/schema checks rather than claiming native Hermes validation.

## MCP building blocks (November 3 update)
Official MCP Python SDK first-steps reference: https://py.sdk.modelcontextprotocol.io/get-started/first-steps/ — tools callable/model-controlled; resources application-loaded context; prompts user-selected templates. Control describes normal interaction design, not permission. Read-only functions can be tools. The illustrated composition is optional and host support varies.
