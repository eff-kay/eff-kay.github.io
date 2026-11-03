# Research and technical scope

Reviewed November 3, 2026. These links support the teaching distinctions, not approval of a real ecommerce integration.

## Video

TechWorld with Nana: [MCP Explained Simply — What It Is and Why It Exists](https://www.youtube.com/watch?v=oblaHqULUHk).

The earlier edition reviewed the full auto-generated transcript and recorded the creator’s correction about conversation state. For this experiment the browser transcript export returned “No transcript is available”; a fresh transcript reread was therefore unavailable. Revisited saved exact-timestamp frames and the prior review notes instead: the focused-result example (4:25), API wrapper (5:20), tool discovery (7:10), credentials (12:45), common interface (16:37), host/client/server (22:05), and aggregation (27:45). The video informs the problem-first progression. New diagrams and notes are original. No transcript, copied script or video stills are redistributed in this deck.

## Primary technical sources

- [MCP architecture](https://modelcontextprotocol.io/docs/learn/architecture): host/client/server, protocol boundary, discovery and invocation. The current page resolves to a dated protocol version; this deck avoids version-sensitive connection-handshake examples.
- [MCP tools specification](https://modelcontextprotocol.io/specification/2025-06-18/server/tools): `tools/list`, `tools/call`, names, descriptions and input schemas. Versioned reference for the core concepts; slide fragments omit full wire envelopes.
- [MCP Python SDK: first steps](https://py.sdk.modelcontextprotocol.io/get-started/first-steps/): tools, resources and prompts; model/host/user control distinctions. The deck does not prescribe an SDK version or import path.
- [GPT Actions introduction](https://developers.openai.com/api/docs/actions/introduction): API-only integration using Custom GPT actions and OpenAPI. An action schema already addresses many description and invocation needs; MCP is not required to make APIs callable.
- [OpenAI function calling](https://developers.openai.com/api/docs/guides/function-calling): the alternative custom-host execution loop. A custom GPT-backed application is distinct from ChatGPT as a product.
- [OpenAI MCP servers](https://developers.openai.com/api/docs/guides/tools-connectors-mcp): MCP connectivity in OpenAI APIs; this does not imply a public ChatGPT listing or commerce approval.

## Boundaries retained in the narration

- The LLM selects/proposes a function through its host. The host/client sends requests; backend code executes. Never depict a bare model as a network client.
- Existing APIs, OpenAPI, shared gateways and libraries can already work. The 3×4 picture illustrates repeated mappings, not a lower bound on codebases or exponential growth.
- MCP provides a standard connection and capability contract; the store maps domain fields, writes useful results and enforces business rules.
- Identity comes from verified credentials. Consent is linked to a reviewed quote, not inferred from generated text or a boolean supplied by the model.
- Protocol request IDs are not order idempotency keys. Host conversation state is not automatically MCP memory.
- Checkout policies and real commerce eligibility require independent verification. These slides demonstrate no real money movement.
- A server can aggregate multiple provider APIs, but there is no required central MCP cloud hub.
- Resources/prompts are complementary and host-dependent, not a mandatory sequence or guaranteed host feature.
