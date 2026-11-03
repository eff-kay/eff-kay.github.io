# API-first design notebook

## The experiment

Assume MCP does not exist. Maya wants her AI to buy a blue carry-on backpack under $100, delivered by Friday. The store exposes APIs, with no shopping dashboard for the assistant. The assistant acts on Maya’s behalf; it is not a store-admin chatbot. The four service boundaries are catalog, GeoRoute, ParcelQuote and store orders. Catalog and orders are owned by the store; routing and delivery are fictional independent providers.

This is a design walkthrough. The request/response values below are fixtures, not successful live calls.

## One successful API-only trace

| Step | Caller / operation | Useful result |
|---|---|---|
| Find | Store adapter → catalog `GET /products` | BP-79: blue carry-on, $79, available |
| Resolve | Store adapter → GeoRoute `POST /routes` | Authorized `home` destination, warehouse route 12 km |
| Quote | Store adapter → ParcelQuote `POST /delivery-quotes` | Delivery $12, Friday estimate |
| Prepare | Store adapter combines facts | Q-42: $91 USD including tax/delivery, 120-second validity, bound to Maya |
| Confirm | Host shows the quote and obtains Maya’s explicit approval | Approval bound to Q-42 and its details |
| Order | Adapter → `POST /orders` after checks | Order 12345; business idempotency key recorded |
| Cancel | Adapter → `POST /orders/12345/cancel` | Owner checked; cancel only if not dispatched |

These are four services with several endpoints. The tool names need not correspond one-to-one to endpoints. `quote_delivery` can coordinate catalog, routing and courier calls behind the store boundary.

## Supporting ChatGPT before MCP

Use a Custom GPT action with a complete OpenAPI schema and configured authentication. The action can target a narrow store gateway that manages downstream provider calls. The host handles model/action interaction; the store adapter enforces the domain rules. The slide’s `operationId`, inputs and response labels are explanatory summaries, not a valid full OpenAPI document.

For a custom application using OpenAI’s API, the separate integration pattern is:

1. Supply named function descriptions and input schemas to the model.
2. Receive the requested function name and arguments.
3. Validate against an allowlist; authenticate/authorize and execute the operation.
4. Return the tool result associated with the model’s call identifier.
5. Continue the model interaction with bounded steps, failures and approvals.

Do not call that custom application the ChatGPT product. Direct function calling, GPT Actions and MCP connectivity are related but distinct host integration paths.

## Requirements we discover

| Question | Shared MCP concept | Work that remains ours |
|---|---|---|
| What can this server do? | Tool discovery, `tools/list` | Useful descriptions, capability selection and access rules |
| What inputs are accepted? | Per-tool input schema | Domain validation, identity checks, schema evolution |
| How do we request it? | `tools/call` via an MCP client | Provider adapters and operation execution |
| What did it return? | Common result/content contract | Domain fields, concise content, business error semantics |
| What context can be read? | Resources | Content quality, authorized scope, host context management |
| Can the user pick a starting workflow? | Prompts | Template content, host support and presentation |
| Can Maya buy or cancel? | A tool can expose the operation | Consent, order ownership, quote expiry and fulfilment policy |
| What if a response is lost? | Protocol request/response correlation | Business idempotency, durable state and safe retry policy |
| Will all hosts behave alike? | Compatible client/server communication | Host-specific permissions, model mapping, UX and deployment |

## Why not stop at OpenAPI?

We can. OpenAPI and shared gateways may be sufficient for a particular product. They already describe API operations, parameters and responses. Our motivation for MCP is an existing common runtime interface adopted by compatible AI hosts: obtain capabilities, invoke tools and exchange context using agreed client/server semantics. It reduces repeated host-facing plumbing without removing provider-specific code. It is a useful design choice, not the only solution logically forced by Maya’s problem.

## A minimal server-shaped design

```text
AI host + its MCP client
          │
          │ tools/list or tools/call(name, arguments)
          ▼
Store MCP server
  ├─ narrow tool catalog + schemas
  ├─ validation + customer authorization
  ├─ search_products → catalog API
  ├─ quote_delivery → route API + delivery API
  ├─ place_order → quote/consent checks + order API
  └─ cancel_order → ownership/state checks + order API
          │
          ▼
Useful, typed domain facts in the protocol result
```

Use a maintained SDK for the actual protocol version, transport, discovery/capability exchange and validation. The slides intentionally do not implement a partial wire server and call it production-ready.

## Review probes for the audience

- What exactly must the host know before the first call?
- Which facts should the model supply, and which must come from trusted identity?
- Does repeating this purchase call buy twice?
- Can a useful read-only search still be a tool?
- Does MCP remove any inventory or cancellation policy code?
- If a host ignores resources or prompts, does the tool-only workflow still work?
- What changes when a fourth AI host connects?

## The three pressures behind the shared interface

1. **Convey functionality:** describe what each service does, when it should be chosen, required inputs and meaningful results. The host must make these definitions available to the model; an endpoint URL alone is not enough. OpenAPI/function descriptions already solve much of this for a particular integration.
2. **Extend functionality:** after adding a proposed carrier-tracking function, publish its description and schema and update the host-visible catalog. In direct integrations, update each relevant action/function mapping. In MCP, a compatible host can refresh the server catalog; caching and refresh behavior still vary. Preserve compatible definitions and evaluate new tool selection. The proposed extension is not implemented in the local demo.
3. **Change the model or host:** a new model inside the same host may reuse the integration, but needs schema/behavior evaluation. A different provider or AI application may need its own tool-format mapping and execution integration. MCP preserves the shared server interface across compatible hosts; it does not normalize all model behavior.

## Shape the result before returning it

Slide 18 uses an illustrative [provider response](examples/provider-response.json) with diagnostics and route metadata, and a [compact domain result](examples/compact-tool-result.json). The adapter sums item/shipping cents, preserves the quote ID, currency, estimate, validity and tax flag, and returns the relevant facts. A standard MCP envelope does not automatically perform this selection or summarization. Keep operational detail in the backend when needed, preserve meaningful failures, and avoid removing information required for consent or the next action.
