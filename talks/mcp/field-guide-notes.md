# MCP talk — expanded visual edition

No time limit. Detailed technical reference and narration for every slide.

## 1. Your MCP server works. Now ship it.

MCP FIELD GUIDE

Opening: “The first successful tool call is a great demo. It is a very small part of a shipped integration.” This expanded visual edition has no time target. Build the story through three topics: a safe contract, dependable operations, and distribution with reviewable evidence. The running example is documentation retrieval. Use the diagrams as explanation anchors and the notes as the technical reference.



## 2. I build the layer agents use.

ORIENTATION

Introduce yourself through the problem you work on, not a résumé tour. “At Docsalot, we create and host MCP servers. We have created a read-only MCP surface for more than three hundred documentation sites.” This number is supplied by me for this talk; it does not mean three hundred independent public-directory approvals or active customers. Explain the useful contrast: public documentation retrieval versus an authenticated dashboard with write capabilities. The same brand can have very different trust boundaries. Photo is from my public Sessionize profile because LinkedIn required sign-in.

Detailed reference from the first draft: Documentation systems. Agent tooling. MCP infrastructure.
Previously: open-source developer tools at Plotly. Two first-author papers in IEEE TSE.
300+ documentation sites with a read-only MCP surface Searchable documentation, delivered directly to AI clients.

Visual walkthrough: Use the supplied 300+ scope as experience, without converting it to approval or usage claims.

- [Faizan Khan · speaker profile](https://sessionize.com/faizan-khan/)

## 3. MCP is one layer.

ORIENTATION

Use the nested diagram to distinguish a user experience from a protocol integration. The host controls model orchestration and permissions UX. A package can carry tools, instructions or other supported components depending on the ecosystem. A connector describes the remote service connection. MCP describes structured interaction with the server. These are conceptual layers, not a claim that every host uses an identical internal architecture. A server can be connected directly without a public listing; a listing helps discovery but does not supply application authorization. Ask the audience which layer they actually need to ship.

- [Submit a Claude plugin to OpenAI](https://developers.openai.com/plugins/guides/submit-claude-plugin)
- [Publish a Claude Code plugin](https://code.claude.com/docs/en/plugins/publish)

## 4. Follow one request.

ORIENTATION

Walk left to right. The host owns the model loop and client behavior. The MCP server owns its tool boundary and downstream credentials. The index owns source data and freshness. A successful RPC is not yet a correct answer: a result from the wrong product version is still a failure. Now generalize: a plugin packages how users discover and install the capability; a connector names the remote integration in a host; MCP is the wire contract. These layers are related but they are not interchangeable.

Detailed reference from the first draft: 01 Host + model Chooses search_docs
→ 02 MCP boundary Validates identity + input
→ 03 Docs index Filters site + version
→ 04 Result Evidence + source URL

Contract Operations Distribution

- [MCP tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)

## 5. The host owns the loop.

ORIENTATION

Start at the user’s intent. The host decides whether and when to invoke a tool and constructs its arguments. Your server validates those arguments and enforces access regardless of how good the model seems. Return evidence that is useful for the host’s answer. Do not claim the server can observe all reasoning or the final conversation; it sees only the inputs and context provided through its interface. The loop is conceptual and omits host-specific implementation details. This distinction explains why server logs alone cannot prove user success.

- [MCP tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)

## 6. Three layers to ship.

ORIENTATION

Introduce the three main topics. Build a safe contract: tool semantics, authorization and runtime compatibility. Operate it: policy enforcement, privacy-conscious observability and durable async recovery. Distribute it: platform packages, evidence and ongoing review. The time limit has been removed, so this edition is a sequenced field guide, not a twenty-minute script. Each slide deliberately carries a small amount of visible text; use the notes to supply technical explanation and examples.



## 7. Start with the service.

01 BUILD · CONTRACT

This is our implementation recommendation. Begin with a typed domain service and a small test fixture. Do not begin by scaffolding OAuth and a hundred tools. The retrieval function should accept only validated fields and a server-created principal. A public site identifier can select an authorized catalog entry; it must not become an arbitrary URL fetch. When moving to authenticated documents, apply tenant filtering before retrieval and recheck each returned record. Pin the SDK and use its supported transport implementation instead of writing raw JSON-RPC from memory. Examples in these notes are design blueprints, not a compiled server.

Detailed reference from the first draft: 1 Choose the boundary
Public docs search or authenticated tenant docs? Decide explicitly.

2 Define two operations
search_docs returns bounded hits; get_doc returns a canonical source.

3 Implement the service layer
Validate site/version; authorize document; return structured evidence.

4 Attach a supported SDK
Register tools; add tested stdio/HTTP adapter; pin supported protocol versions.


Keep policy and retrieval outside transport handlers so every adapter calls the same business logic.

Visual walkthrough: The service owns validation, authorization and business behavior. Transport wraps that service. The SDK handles protocol details; it does not invent application security.



## 8. Keep the core outside the transport.

01 BUILD · CONTRACT

Recommended architecture: define a domain service with explicit typed inputs and a server-created request context. Place authentication, object access and output projection in predictable layers. A stdio adapter and a hosted HTTP adapter should not independently implement different authorization policies. Use your pinned SDK’s supported transports and error mapping. This diagram does not mean local and remote auth models are interchangeable: resolve the caller appropriately at each adapter, then hand a validated context to the same service. Test the domain behavior separately from wire compatibility.

- [MCP transport bindings](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports)

## 9. Constrain the capability.

01 BUILD

Start with one workflow: find a guide and fetch its source. Resist generating an MCP tool for every internal endpoint. Make names, descriptions, inputs and output schemas say the same thing. Enforce maximum result count and input lengths in code, not just prose. Derive tenant identity from validated authentication, never from a model-supplied tenant ID. Separate reads from writes. An annotation helps a host choose safeguards; it cannot enforce your authorization. Test confusing prompts as well as direct prompts.

Detailed reference from the first draft: BROAD SURFACE
api_request({
method, url, body
})
The model chooses the operation, destination and payload.

BOUNDED WORKFLOW
search_docs({
query, site_id, version, limit
})
The server owns destinations, permissions and query limits.


Validate input → authorize object → execute → validate output. An annotation is a hint, not a permission.

Visual walkthrough: Compare who chooses the destination and operation. The right side constrains both before execution.

- [MCP tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)
- [OpenAI plugin guidelines](https://developers.openai.com/plugins/plugin-guidelines)

## 10. Split the actions.

01 BUILD · CONTRACT

The shape of the tool list affects review, permission prompts and model behavior. A catch-all request tool obscures action boundaries; documenting the difference in prose does not fix a mixed safe/unsafe contract. Split tools by meaningful operation, then give each an accurate name, schema and side-effect annotations. A read-only hint must match the implementation: starting a persistent job or writing an artifact is still a state change even if the output looks like a preview. Clients apply their own safeguards, so review the target host’s annotation requirements rather than assuming one universal confirmation policy.

- [Claude connector checklist](https://claude.com/docs/connectors/building/review-criteria)
- [OpenAI plugin guidelines](https://developers.openai.com/plugins/plugin-guidelines)

## 11. A small schema is a strong boundary.

01 BUILD · CONTRACT

Read only the important fields aloud: explicit version, bounded query and result count, no arbitrary URL. openWorldHint false assumes a deliberately bounded authorized documentation catalog; if the tool performs open-ended public web search, true is appropriate. Hints must follow actual behavior and target-platform requirements. Add an output schema for title, source URI, document version, excerpt and stable document identity as needed. Do not include internal tracing metadata in the model response. Enforce the same validation in the service layer: JSON Schema is not an authorization boundary.

Detailed reference from the first draft: {
"name": "search_docs",
"title": "Search documentation",
"description": "Find guides in one authorized site and version. Returns up to 5 hits.",
"inputSchema": {
"type": "object", "additionalProperties": false,
"properties": {
"query": { "type": "string", "minLength": 1, "maxLength": 500 },
"site_id": { "type": "string" },
"version": { "type": "string" },
"limit": { "type": "integer", "minimum": 1, "maximum": 5 }
},
"required": ["query", "site_id", "version"]
},
"annotations": {
"readOnlyHint": true, "destructiveHint": false, "openWorldHint": false
}
}

Visual walkthrough: The full first-draft JSON schema is retained below in these notes. Keep additionalProperties false where appropriate and enforce the same constraints at runtime.

- [MCP tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)
- [OpenAI plugin guidelines](https://developers.openai.com/plugins/plugin-guidelines)

## 12. Anatomy of a call.

01 BUILD · CONTRACT

This is an anatomical sketch, not a complete copy-and-paste wire message. In the current protocol era, required protocol metadata and capabilities are per-request. The SDK should encode the exact supported form. A JSON-RPC ID correlates a response with a request; it is not an application idempotency key for a side effect. Arguments are model-supplied inputs and must be validated and authorized. Authentication and request context are resolved by the server; do not trust a tenant field merely because it appears inside a syntactically valid request. Keep secrets outside model-visible arguments and output.

- [MCP transport bindings](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports)
- [MCP tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)

## 13. Make the handler easy to audit.

01 BUILD · CONTRACT

The pseudocode illustrates ordering and is not runnable without the named application services. For a public catalog, authenticate can deliberately resolve an anonymous principal with a public-only policy. For private docs, missing auth is not anonymous access. The server owns tenant mapping. Authorization should constrain search itself to prevent count and ranking leakage, then check returned records to catch index ACL lag. Use parameterized database queries and bounded search. Do not turn an unknown site into a best-effort arbitrary fetch. Test unauthorized document IDs and version mismatches explicitly.

Detailed reference from the first draft: async function searchDocs(input, requestContext) {
const args = validateSearchInput(input);
const principal = await authenticate(requestContext);
const site = await catalog.requireAuthorizedSite(principal, args.site_id);
policy.require(principal, "docs:read", site);

const hits = await index.search({
tenant: site.tenantId, site: site.id, version: args.version,
query: args.query, limit: Math.min(args.limit ?? 5, 5)
});
const visible = await authorizeEveryHit(principal, hits);
return validateSearchOutput(projectEvidence(visible));
}
Model-supplied IDs select candidates. Server-side policy decides which candidates exist for this caller.

Visual walkthrough: Walk through the retained pseudocode in notes. Authorization constrains retrieval itself, then each returned record is checked. Output projection avoids over-sharing.



## 14. Make the grant explicit.

01 BUILD

Explain the resource server and authorization server as separate roles, even if they share a deployment. Public documentation can be unauthenticated; user-account actions need the host-supported OAuth flow. The client discovers the protected resource and issuer, obtains consent with PKCE, and presents a resource-bound token. The server checks identity and object access on every operation. Do not forward a client bearer token to another API merely because it is a token. Store downstream grants separately. Current MCP prefers client ID metadata documents where supported; dynamic registration is a compatibility option, not a universal prerequisite.

Detailed reference from the first draft: [Sequence diagram] MCP access token ≠ upstream API token. Validate audience, issuer, expiry and permissions.

Visual walkthrough: The token authenticates a caller and conveys grants. Object-level policy still decides whether this exact operation may run.

- [MCP authorization](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)
- [MCP security best practices](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices)

## 15. Debug discovery first.

01 BUILD · AUTH

Debug in this order: exact public resource URI, challenge, metadata JSON, issuer identity, registration support, redirect allowlist, consent, code exchange, token validation. Metadata routes returning an HTML app shell are a classic integration failure. Current MCP authorization supports client ID metadata documents, pre-registration, and compatibility dynamic registration with defined selection rules. Pick the intersection your host and authorization server actually support. A logged-in browser session does not prove the token's scope, audience or tenant. Redact authorization codes and tokens in all saved traces.

Detailed reference from the first draft: [Sequence diagram]

- [MCP authorization](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)

## 16. Ask for the smallest useful grant.

01 BUILD · AUTH

These scope names are examples for an application, not protocol-reserved strings. Design grants around meaningful actions. A user who needs public search should not consent to publishing access. An editor grant may still need tenant and document checks, and a publish action may require a separate approval gate. Avoid silently expanding an existing grant during a tool update. Explain why permission is needed at consent time and provide revocation. On each request, validate the token and enforce current object access. The staircase depicts capability breadth, not a recommendation to request all higher scopes up front.

- [MCP authorization](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)
- [MCP security best practices](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices)

## 17. A token has an intended audience.

01 BUILD · AUTH

The token panel is conceptual; tokens can be opaque and the server may validate them through an authorization service rather than decoding local JWT fields. Check issuer, expiration, intended resource and permissions using the chosen authorization system. Never forward a token issued for the MCP resource to an upstream API just because it arrived as a bearer token. Use a separately authorized downstream grant. Incorrect audience handling turns an apparently working connector into a confused trust relationship. Test tokens for the wrong resource, expired tokens and revoked access, as well as the successful path.

- [MCP authorization](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)
- [MCP security best practices](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices)

## 18. Threats meet controls at the boundary.

01 BUILD · AUTH

The first three are grounded in MCP security guidance; tenant and retrieval controls are our application design recommendations. Explain why an external article can contain useful facts without becoming an instruction source. Read-only tools still exfiltrate data if queries or results cross a tenant boundary. Avoid presenting prompt wording as the primary defense. Server-side capability and egress restrictions matter even if the model follows malicious retrieved text. For proxies, obtain explicit per-client consent and keep upstream tokens out of tool output. Apply the threat model again when a tool changes from read to write.

Detailed reference from the first draft: Attack Failure boundary Control to implement
Confused deputy Shared upstream OAuth client skips per-client consent Bind user consent to the requesting client
Token passthrough MCP token forwarded to unrelated API Validate audience; separate downstream grant
SSRF User-controlled URL or metadata fetch reaches internal network Allowlist + IP/DNS/redirect validation
Cross-tenant retrieval Model supplies another tenant’s object ID Derive tenant; authorize each object
Instruction injection Retrieved docs treated as trusted behavioral instructions Separate content from authority; minimize tool privilege

- [MCP security best practices](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices)

## 19. Tenant isolation must survive retrieval.

01 BUILD · AUTH

Treat tenant identifiers from arguments as candidate selectors, not authority. Resolve the tenant from validated caller context and catalog ownership. Apply an authorized filter inside retrieval so ranking, count and snippet results do not reveal another tenant’s documents. Recheck individual objects before returning them, especially if an index can lag behind permission changes. A global shared index requires deliberate partition and cache design. Test direct document IDs, search queries, pagination cursors, source links and cached results for cross-tenant leakage. This is an application architecture recommendation, not built-in isolation supplied by MCP.



## 20. Retrieved text is data, not authority.

01 BUILD · AUTH

A documentation page can contain instructions aimed at the model, malicious examples or accidentally broad commands. Treat the retrieved text as a source to interpret, not a source of authority to change system behavior or initiate unrelated tool calls. Do not claim prompt phrasing alone makes this safe. Limit the server’s capabilities, destinations and output, and require authorization at every execution boundary. The host must apply its own instruction hierarchy and safeguards; your server cannot prove how every host reasons over content. This distinction is particularly important when one integration retrieves text and another can send or mutate data.

- [Claude connector checklist](https://claude.com/docs/connectors/building/review-criteria)
- [OpenAI plugin guidelines](https://developers.openai.com/plugins/plugin-guidelines)

## 21. A cache key is part of the boundary.

01 BUILD · RUNTIME

This is a recommended application cache design, not a literal protocol-mandated cache key. Include the dimensions that affect visibility and content: tenant, authorization state or equivalent partition, site, version and relevant query parameters. Avoid a shared cache that serves private snippets to another caller. Define invalidation for source updates and access revocation, and keep TTLs consistent with the freshness promise. Server-side result caching is different from host-side tool-list caching; track both when debugging stale behavior. Never add raw tokens to cache keys or logs just to distinguish callers.



## 22. Pin the protocol.

01 BUILD

The blog we started from was written in May. The July revision changed the protocol model, so showing its initialize-and-session snippet as current would be wrong. Latest MCP core is stateless, with protocol metadata and capabilities per request. Earlier clients still exist; choose a compatibility strategy and let a tested SDK implement the wire details. Test ChatGPT, Claude and your IDE clients separately. A server supporting an extension does not imply the host supports it. Test proxies, timeouts and discovery routes from outside your own network.

Detailed reference from the first draft: EARLIER REVISIONS Connection lifecycle
initialize → capabilities → calls Optional HTTP session state

2026-07-28 CORE Request lifecycle
Per-request metadata + capabilities Stateless core; request-scoped streaming


01 SDK + adapter Pin dependency versions
→ 02 Host matrix Transport · auth · extensions
→ 03 Contract tests Old + new clients
→ 04 Release Keep live schemas working

- [MCP transport bindings](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports)
- [July 2026 MCP release](https://blog.modelcontextprotocol.io/posts/2026-07-28/)

## 23. Compatibility has dimensions.

01 BUILD · RUNTIME

This is a recommended test matrix. Record client build/date, server build and selected protocol revision. Exercise real hosted clients, not just a generic Inspector. Browser CORS and Origin validation are distinct concerns: apply them to the relevant transport and client path rather than allowing all origins to make a test pass. If a host cannot use Tasks or render UI, provide a useful synchronous/text fallback or clearly document the limitation. Test a published deployment behind your actual load balancer. A compatibility claim needs a scope and date.

Detailed reference from the first draft: Surface What to test Evidence to retain
Transport Protocol revision; discovery; POST; stream closure Wire transcript with secrets redacted
Auth No-auth; first consent; refresh; revoke; wrong audience Recorded expected challenges and denials
Tools Listing; schema; errors; pagination; response limits Contract snapshot and host conversation
Extensions Tasks; Apps UI; elicitation, if actually used Supported / unsupported result per host
Edge TLS; proxy buffering; CORS/Origin policy; timeouts Public-network smoke test
Do not silently equate a current server implementation with current host support.

Visual walkthrough: Cells are a test-plan illustration, not a claim about real host support. Replace generic host labels only after recording exact tested versions and evidence.

- [MCP transport bindings](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports)

## 24. Policy belongs in the request path.

02 OPERATE

This is a recommended production architecture, not a claim that the MCP protocol supplies governance automatically. Resolve a user and tenant before touching data. Check the specific document or record, not only the top-level scope. Put egress controls around fetching to reduce SSRF risk. For a write, bind approval to the exact target and action, then recheck permissions before execution. A public read-only service still needs source authorization, indexing rules and limits. Assign each tool an owner and a shutdown path. Keep audit records with access controls and retention, not a permanent dump of user conversations.

Detailed reference from the first draft: tools/call
IDENTITY TENANT + OBJECT SCOPE + ACTION EGRESS + LIMITS
downstream API

ALLOW → execute + audit DENY → typed, actionable error RISKY WRITE → approval + recheck
Recommended control plane: tool inventory · named owner · schema diff · rollout gate · emergency disable.

- [MCP security best practices](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices)

## 25. Permission is an intersection.

02 OPERATE · GOVERNANCE

Use the overlap as a memory aid: a valid user, an authorized tenant, a granted action and an accessible object must all agree. The geometry is conceptual, not a literal set cardinality. For example, docs:read can permit an action class while the chosen document belongs to another workspace. A valid token is not enough. Recheck current permissions at execution time for sensitive operations; an earlier approval can become stale. Keep denied responses helpful without revealing unauthorized object existence. Write tests for each dimension separately so a failing check is not accidentally masked by a broader grant.



## 26. Own the tool lifecycle.

02 OPERATE · GOVERNANCE

This lifecycle is a recommended governance model, not a required platform form. Keep its artifacts small and executable. A tool description can expand triggering even when the handler code is unchanged, so review text and schema changes together. Pin dependency versions and inspect transitive changes for local packages. For remote services, record deployments and the contract version a host currently sees. Use canary traffic and a tool-level disable switch so an incident does not require deleting an entire integration. Retention and access policies should match the published privacy statement.

Detailed reference from the first draft: Control Concrete artifact Owner
Inventory Tool, scope, source, data class, side effects Product + engineering
Admission Schema diff + threat review + negative tests Security / tool owner
Execution Identity, object policy, egress and budgets Runtime service
Audit Access-controlled event + retention policy Operations
Retirement Deprecation notice, migration, disable switch Named maintainer
Treat a description change as behavior-affecting: it changes what the model may choose to call.



## 27. Metadata changes can expand behavior.

02 OPERATE · GOVERNANCE

A description is executable influence over tool selection even if it is not executable code. Changing “search this site” to “search all workspaces” can alter triggering and imply broader data access. Review the declared schema, description, annotations and actual implementation as one contract. Keep a snapshot and inspect differences during deployment. A narrowed description cannot compensate for a handler that still has broad access, and a broader handler cannot be safely introduced without updating the contract and governance checks. This slide’s diff is an authored example, not a recorded product change.

- [OpenAI remote MCP review](https://developers.openai.com/plugins/deploy/app-review)

## 28. Approval can become stale.

02 OPERATE · GOVERNANCE

A confirmation is not a forever grant. Between preview, approval and execution, a document can move, a user can lose access or a job can resume much later. Bind approvals to the exact intended action and target and re-evaluate current authorization before sensitive execution. For durable jobs, define whether permission is checked at admission, at each step and at result read, based on the threat model. Do not blindly replay a captured approval token after scope changes. This slide shows a recommended time-of-check/time-of-use safeguard, not a protocol-provided transaction guarantee.



## 29. Observe the whole operation.

02 OPERATE

These timings are an illustration, not Docsalot measurements. Use a server trace that follows the request through policy, downstream calls and response shaping. Record protocol/client version, tool name, schema version, duration and outcome where appropriate; redact secrets and avoid logging raw prompts by default. Keep internal trace IDs in your telemetry, not model-visible tool results. Track transport failure separately from a tool-level isError and a semantically wrong answer. You cannot infer final user satisfaction from server logs alone; use controlled end-to-end evaluations and privacy-respecting feedback. Bound metric-label cardinality.

Detailed reference from the first draft: Illustrative request waterfall 980 ms total
Edge + auth 140 ms


Policy + validation 80 ms


Search index 580 ms


Result shaping 180 ms



Transport status · latency · timeouts Tool isError · validation · retries Outcome right source · freshness · completion

- [OpenTelemetry MCP attributes](https://opentelemetry.io/docs/specs/semconv/registry/attributes/mcp/)
- [OpenAI plugin guidelines](https://developers.openai.com/plugins/plugin-guidelines)

## 30. Three meanings of “success.”

02 OPERATE · OBSERVABILITY

Do not multiply percentages as if the layers were independent. Define denominators and exclusions before setting SLOs. A no-results response may be correct for an unsupported query, so interpret no-hit rate with test cases and query categories. Keep high-cardinality tenant and request identifiers out of metric labels; use access-controlled traces for investigation. Sample responsibly and retain only what your policy discloses. Trace context may be absent across a third-party host boundary; start a server trace when needed rather than inventing end-to-end visibility.

Detailed reference from the first draft: Layer Question Measure
Transport Did the exchange complete? Timeouts, HTTP failures, protocol failures
Tool Did this operation complete correctly? isError, dependency failure, validation errors
Workflow Did the user get the intended result? Curated eval success, provenance, feedback
Watch Reliability
p95/p99 latency; auth-loop rate; dependency error rate.


Watch Retrieval quality
No-hit rate; source freshness; wrong-version citations.



Server-only telemetry cannot observe an entire host conversation. Use explicit evaluations for end-to-end claims.

Visual walkthrough: The nesting is conceptual; it does not encode measured probabilities or statistical independence. A transport exchange can succeed while the tool returns an error. A tool can succeed while a retrieved document answers the wrong version.

- [OpenTelemetry MCP attributes](https://opentelemetry.io/docs/specs/semconv/registry/attributes/mcp/)

## 31. Find the failing layer.

02 OPERATE · OBSERVABILITY

Use this tree to prevent an HTTP-only diagnosis. First determine whether a request reached the service and whether auth discovery completed. Then inspect whether tool execution returned an application error, timed out or failed downstream. If execution succeeded but the answer is wrong, inspect source version, freshness, retrieval quality and the host’s interpretation through a controlled evaluation. The server cannot observe the full host conversation by default. Correlate evidence only where safely available and avoid logging raw conversations just to make debugging convenient. Record denominators and expected behavior before calling an error-rate chart meaningful.

- [OpenTelemetry MCP attributes](https://opentelemetry.io/docs/specs/semconv/registry/attributes/mcp/)

## 32. Observe without copying the conversation.

02 OPERATE · OBSERVABILITY

Define allowed telemetry fields before capture. Prefer tool name, deployment/schema version, duration, a bounded error category and operational outcome; add caller context only where necessary, disclosed and access-controlled. Do not log access tokens, authorization codes, credentials or raw conversation history. An internal trace identifier can help your own investigation, but it usually does not belong in model-visible results. Set retention, sampling and access controls. These are recommended observability practices; they do not mean a specific host forwards trace context or that the server can observe model reasoning.

- [OpenTelemetry MCP attributes](https://opentelemetry.io/docs/specs/semconv/registry/attributes/mcp/)
- [OpenAI plugin guidelines](https://developers.openai.com/plugins/plugin-guidelines)

## 33. Protect the service from one noisy tenant.

02 OPERATE · RELIABILITY

A small read-only tool can still generate expensive queries or a thundering herd. Bound input size, per-tenant concurrency, queue depth, execution time and output size. Fair scheduling is an application choice; this queue diagram is a recommended pattern rather than protocol behavior. Decide whether excess work is rejected, delayed or routed to an async job. Return actionable capacity errors and apply retry backoff rather than encouraging all clients to retry immediately. Track queue wait separately from execution latency. Protect a shared downstream dependency with a global budget as well as tenant-level limits.



## 34. Timeout means “outcome unknown.”

02 OPERATE

Imagine publish_docs committed but the response disappeared. A blind retry can publish twice. Use an application-defined idempotency key scoped to actor, operation and payload; return the stored outcome for the same request. Persist long work before acknowledging acceptance. The current Tasks extension lets an opted-in client poll a durable handle, and cancellation is cooperative. Hosts without it need a deliberately designed job interface. Enforce ownership on every status and result read. Put bounded retries with jitter around transient failures, not validation errors. A disconnected HTTP stream is not evidence that business work rolled back.

Detailed reference from the first draft: ACCEPTED persist job + dedupe key
→ WORKING deadline + worker lease
→ COMPLETED persist result
↳ INPUT REQUIRED &nbsp;&nbsp; ↳ FAILED &nbsp;&nbsp; ↳ CANCELLED

A Extension-aware host
Use MCP Tasks only when supported; poll the durable handle.


B Compatible fallback
Expose explicit start / status / result tools; treat starting work as a write.



App-defined idempotency ≠ JSON-RPC request ID. Cancellation does not undo a committed side effect.

- [MCP Tasks extension](https://modelcontextprotocol.io/extensions/tasks/overview)

## 35. The response vanished. Did the write commit?

02 OPERATE · ASYNC

This is an application reliability pattern. Exactly-once side effects are not supplied by JSON-RPC IDs or a task handle. A deduplication record needs an atomic relationship with the business write where possible; otherwise use a transactional outbox or reconciliation strategy. Define retention for keys so late retries are understood. A read may be retry-safe but expensive, so rate limits still matter. A write may be naturally idempotent, but a publish/send operation generally needs stronger safeguards. Retries must fit the overall deadline.

Detailed reference from the first draft: What happened What you know Safe next move
Timeout before response Commit status unknown Look up idempotency record / job status
429 or transient upstream failure Capacity or temporary dependency problem Bounded retry with backoff + jitter
Invalid arguments / denied access Request cannot run as supplied Return actionable error; do not retry unchanged
Cancel requested Stop requested, not rollback proven Report actual state; reconcile side effects
Worker crash after commit Ack may be missing Deduplicate; persist outcome; reconcile
Bind a dedupe key to principal + operation + payload hash. Reject conflicting reuse.



## 36. Choose the execution model.

02 OPERATE · ASYNC

Do not choose async solely because the server can implement it. First estimate execution and intermediary deadlines. Bounded fast retrieval can return synchronously. If work can outlive a request, check the actual host’s extension support and use a durable task handle only through a compatible contract. Otherwise define explicit application job tools for start, status and result, with accurate side-effect annotations. Starting persistent work is a write even when the eventual artifact is a read-like report. Enforce job ownership, TTL, quotas and cancellation semantics independently of the transport.

- [MCP Tasks extension](https://modelcontextprotocol.io/extensions/tasks/overview)

## 37. Return a durable handle.

02 OPERATE · ASYNC

Tasks in the July-era spec are an extension, not a feature every client must implement. The host opts in through per-request capability metadata and the server advertises support. A server decides whether to return a task. Polling retrieves terminal results; input_required can pause for input. Do not assume older tasks/result APIs are the current shape. A fallback start/status/result API is your own tool design and its state machine must be documented. Protect task status and result access with the same principal/tenant checks as the initiating operation.

Detailed reference from the first draft: [Sequence diagram] Authorize task IDs. Enforce TTL and quotas. Cooperative cancellation may arrive after a side effect.

Visual walkthrough: Use the current Tasks extension only when both client and server support it. The stored application job and authorization checks remain your responsibility.

- [MCP Tasks extension](https://modelcontextprotocol.io/extensions/tasks/overview)

## 38. Store the outcome behind the operation key.

02 OPERATE · ASYNC

The key is application-defined and should be scoped to the authenticated principal and operation. Store a canonical payload hash so accidental reuse with different arguments produces a conflict instead of the wrong result. Record in-progress and terminal states; concurrent duplicate requests need an atomic claim or equivalent coordination. For writes, relate the record atomically to the business action where possible. Define retention and late-retry behavior. A request ID only correlates wire messages and does not supply these semantics. The diagram is a recommended reliability design, not a complete transaction implementation.



## 39. Commit the handoff with the business write.

02 OPERATE · ASYNC

This is a standard application reliability pattern recommended for the gap between a committed database write and external job delivery. Save the business change and an outbox event in the same local database transaction. A worker then reads committed events and dispatches or processes them. Crashes can still cause repeated delivery, so downstream effects need deduplication or idempotency. Do not label this exactly-once execution. Some systems use a different durable queue or workflow engine; choose a design that fits the actual consistency and transaction boundaries. Retain reconciliation for effects that cannot be included in a transaction.



## 40. Stop amplifying a failing dependency.

02 OPERATE · RELIABILITY

This diagram is a recommended protection pattern around a flaky downstream service. Closed means normal requests flow while failures are tracked; open means fail fast for a bounded interval; half-open allows limited probes to see whether recovery is real. Combine the breaker with timeouts, bounded exponential backoff and concurrency limits. A breaker is not a replacement for capacity planning or a permission check. Do not retry malformed requests or denied access. Choose thresholds and cooldowns from observed behavior rather than copying arbitrary numbers from a slide. Report degraded service clearly and preserve useful partial or cached results only where the contract permits them.



## 41. Show the failure and the recovery.

02 OPERATE · DEMO

This is an optional demo plan, not an implemented MCP demo bundled with the deck. To add it later, build a local mock service and run the same three prompts against a pinned host/client. Show the trace and final result side by side. Make a dependency fail on purpose; do not disable security controls to create a smoother performance. A fixture-based recording can show the failure and recovery without depending on an unpredictable live OAuth flow. The current deck's diagrams are explanatory, not captured production traffic.

Detailed reference from the first draft: 01 Fixture Small authorized docs set
→ 02 Happy path Find correct v2 guide
→ 03 Injected failure Index timeout / expired token
→ 04 Recovery Typed error + bounded retry
→ 05 Evidence Trace + expected result

Use a recording or a local fixture. Never put reviewer credentials or real user documents on screen.



## 42. One endpoint. Many distribution contracts.

03 DISTRIBUTE

The practical distinction is between connecting and being discoverable. A user can often connect directly before any public directory listing exists, subject to host and organization policy. OpenAI publishes plugins for ChatGPT and Codex. Claude treats a remote connector and a workflow plugin as distinct submissions; submit your own remote server separately even if a plugin references it. Cursor has reviewed plugins and direct MCP configuration. Copilot can use registry entries or manual configuration. The official MCP Registry publishes metadata; it is not universal product approval. Never call your listing “approved everywhere.”

Detailed reference from the first draft: MCP your stable endpoint
ChatGPT / Codex Plugin package → OpenAI review
Claude Connector + optional plugin bundle
Cursor Plugin repository or direct configuration
Copilot / VS Code Registry discovery or manual setup
Official MCP Registry Metadata publication + namespace proof

- [Submit a Claude plugin to OpenAI](https://developers.openai.com/plugins/guides/submit-claude-plugin)
- [Claude connector submission](https://claude.com/docs/connectors/building/submission)
- [Cursor MCP support](https://prod.cursor.com/docs/mcp)
- [GitHub Copilot MCP integration](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp/extend-copilot-chat-with-mcp)
- [Official MCP Registry quickstart](https://modelcontextprotocol.io/registry/quickstart)

## 43. Connect first. Earn discovery separately.

03 DISTRIBUTE · LANDSCAPE

Direct configuration lets a known user connect a compatible service, subject to host eligibility and organization policy. A public listing adds a discovery and trust route, with platform-specific requirements. It does not make the underlying service more authorized or more compatible by itself. Test the direct workflow early so review is not the first time someone signs in from a clean environment. Then prepare distribution-specific packaging and evidence. A self-hosted marketplace can serve a known audience without official directory placement, but it does not transfer an official approval signal.

- [Cursor MCP support](https://prod.cursor.com/docs/mcp)
- [GitHub Copilot MCP integration](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp/extend-copilot-chat-with-mcp)
- [Publish a Claude Code plugin](https://code.claude.com/docs/en/plugins/publish)

## 44. OpenAI: package to publish.

03 DISTRIBUTE · OPENAI

Use the current Plugins portal at platform.openai.com/plugins. Confirm the owning organization and project, verification and Apps Management Write. Include the MCP in the initial package rather than starting a skills-only listing and expecting to attach it later. Keep all secrets out of the archive. Complete the public HTTPS connection and portal-specified domain challenge. Resolve required validation/setup failures, supply reviewer access and test evidence, then submit. Approval is separate from publishing. The portal's current behavior and requirements win over a screenshot in this talk.

Detailed reference from the first draft: 01 Prepare Verified identity + access
→ 02 Upload ZIP Manifest + MCP config
→ 03 Connect + scan HTTPS + domain proof
→ 04 Review Cases + credentials + video
→ 05 Publish After approval

Package changes Metadata and skills need a new ZIP.
Hosted tool changes Continuously scanned; preserve the live contract.

- [OpenAI plugin submission](https://developers.openai.com/plugins/deploy/submission)

## 45. The package declares the capability.

03 DISTRIBUTE · OPENAI

Use the package structure and schema required by the current OpenAI guide. This exploded view is a conceptual inventory rather than a manifest file reference. Include the intended MCP connection in the initial package and keep reusable source under version control. Public metadata, assets and skills should match the product being reviewed. Reviewer credentials belong in private review details, not configuration headers or the archive. Validate all referenced paths and avoid undeclared local dependencies. Hosted server changes and package metadata changes can follow different update checks, so keep their release evidence distinguishable.

- [OpenAI plugin submission](https://developers.openai.com/plugins/deploy/submission)

## 46. Check blockers early.

03 DISTRIBUTE · OPENAI

OpenAI's current guidelines say annotation justifications are no longer required; old forum posts may say otherwise. Distinguish that from the requirement that the values themselves be accurate. Do not configure a protected server as unauthenticated or embed a bearer header to evade a portal limitation. The current portal rejects nonempty server headers for public submission. A schema accepting an API-key declaration does not mean the submission UI can complete that authentication. These constraints are a reason to investigate distribution before finalizing an API surface.

Detailed reference from the first draft: Area Current guidance Engineering response
Annotations Explicit readOnly, destructive and openWorld booleans Audit behavior; avoid optimistic labels
API ownership Unofficial third-party pass-through connectors not accepted Establish first-party value and legitimate rights
Authentication Portal supports no-auth / OAuth / mixed; no API-key input flow Confirm supported auth before packaging
Privacy Minimize collection; published policy and user controls Keep raw chats and secrets out of tools
Review access Dedicated working test account and realistic data Keep credentials private and usable

- [OpenAI plugin guidelines](https://developers.openai.com/plugins/plugin-guidelines)
- [OpenAI plugin submission](https://developers.openai.com/plugins/deploy/submission)

## 47. Review the contract before the submission.

03 DISTRIBUTE

Separate a documented rejection rule from our engineering prediction. Claude explicitly rejects catch-all tools that combine safe and unsafe HTTP methods. Both ecosystems expect accurate behavior and no model-manipulating descriptions. OpenAI rejects unofficial third-party pass-through connectors under its current guidelines; ownership and authorization deserve attention when your product retrieves other people's docs. For Docsalot, public availability alone does not establish permission to distribute third-party content. Explain the first-party product value and source rights. There is no rejection-rate dataset here and no guaranteed review time. Fix the exact finding rather than renaming the same capability.

Detailed reference from the first draft: 01 Hidden capability Generic executor, mixed read/write, misleading hints.

02 Broken replay Unusable account, empty fixtures, auth or discovery failure.

03 Untrusted behavior Prompt manipulation, undisclosed data transfer, unclear API rights.


FIX BEHAVIOR → UPDATE METADATA → RE-RUN SCENARIOS → RESCAN → RESUBMIT

- [Claude connector checklist](https://claude.com/docs/connectors/building/review-criteria)
- [OpenAI plugin guidelines](https://developers.openai.com/plugins/plugin-guidelines)

## 48. The test case is the review unit.

03 DISTRIBUTE · EVIDENCE

Do not pad a submission with features the product does not have. Expand positive scenarios using actual supported inputs: version disambiguation, site disambiguation, fetching, pagination if supported, and a valid no-match result. The three positives on screen illustrate format rather than satisfying the full five-case requirement. Include expected tool names and expected results, not only a vague “works.” Separate negative test expectations from a model's free-form answer: the server must deny forbidden operations regardless of model behavior. Record a video against the same fixture and release.

Detailed reference from the first draft: Case type Prompt / scenario Expected behavior
Positive Find v2 authentication guide search_docs; correct version and source
Positive Fetch the selected document get_doc; bounded canonical content
Positive No matching guide exists Clear no-match result; no invented document
Negative Read a private site without permission Deny before retrieval; no existence leak
Negative Fetch an arbitrary internal-network URL Reject unsupported destination
Negative Delete the documentation site No destructive capability on read-only surface
These are illustrative cases. OpenAI’s five positive cases still need five distinct, supported workflows or scenarios.

Visual walkthrough: These examples illustrate a review format. Preserve the detailed test-case requirements and additional scenarios in notes; do not imply this board alone meets a portal’s complete submission requirements.

- [OpenAI plugin submission](https://developers.openai.com/plugins/deploy/submission)

## 49. Walk in as a brand-new user.

03 DISTRIBUTE · EVIDENCE

Re-run the workflow using a dedicated account with exactly the permissions and sample data a reviewer will receive. Start from a clean host session to reveal remembered-consent and cached-credential assumptions. Ensure login does not wait on your personal MFA approval or an expiring magic link. Provide deterministic prompts, expected tool names and verifiable outcomes. A populated fixture should cover multiple supported scenarios, permission denial and valid no-result behavior. Use sample data rather than a real customer account. The point is to remove uncertainty about setup, not to hide normal product limitations.

- [OpenAI plugin submission](https://developers.openai.com/plugins/deploy/submission)
- [Claude connector submission](https://claude.com/docs/connectors/building/submission)

## 50. Two contracts can be live at once.

03 DISTRIBUTE · RELEASES

This is the most operationally important distribution lesson. If you make a new field required before the host adopts the schema, users break even though the scan system retained the approved definition. Keep old parameters and resource URIs working while the new contract is held. Per-tool outcomes can differ: a new tool can pass while another update is held. Roll back a breaking server deployment rather than waiting for review. The submission and review pages currently differ on some MCP URL-change details; confirm with the portal/support instead of promising an in-place endpoint migration.

Detailed reference from the first draft: HOST STILL SEES search(query)
Previously approved schema

≠ SERVER NOW EXPECTS search(query, folder)
Breaking deployment


01 Expand Accept old + new
→ 02 Deploy Maintain compatibility
→ 03 Rescan Inspect live definition
→ 04 Migrate Remove old only safely

OpenAI retains the definition, not a frozen copy of your implementation.

- [OpenAI remote MCP review](https://developers.openai.com/plugins/deploy/app-review)

## 51. Align the two release lanes.

03 DISTRIBUTE · RELEASES

Expand the implementation before migrating the published contract. During review, users can still call the approved old schema against the newly deployed server. Keep old parameters, response shapes and resource references working. Rescan and inspect the definition the host is actually allowed to use; do not infer adoption from deployment success. Different tools can pass checks independently. Once the relevant clients have safely adopted a replacement and migration policy permits it, retire old behavior deliberately. The swimlane is a recommended rollout strategy derived from continuous-review behavior, not a claim that a portal controls your live deployment.

- [OpenAI remote MCP review](https://developers.openai.com/plugins/deploy/app-review)

## 52. Claude has two submission paths.

03 DISTRIBUTE · CLAUDE

Use claude.ai/directory/manage and choose the submission type. Current connector guidance accepts remote HTTPS endpoints; public data can be unauthenticated, and authenticated user services use OAuth. It now says standalone local MCPB directory submissions are deprecated: include a local server in a plugin instead. For plugins, connect GitHub and prove repository push access; the repository must be public before listing goes live. These are current documented flows, not the older form-based workflow or a promise of instant approval.

Detailed reference from the first draft: REMOTE CONNECTOR
HTTPS MCP endpoint
Developer portal → MCP connector. Tool titles, annotations, auth, listing materials and reviewer access.

PLUGIN BUNDLE
GitHub source
Developer portal → Plugin bundle. Validate source, permissions, data handling and release settings.


If your plugin points to your own remote MCP server, submit the connector separately too.

- [Claude connector submission](https://claude.com/docs/connectors/building/submission)
- [Claude plugin submission](https://claude.com/docs/plugins/submit)

## 53. A quality label is not an auth mode.

03 DISTRIBUTE · CLAUDE

Current Claude documentation distinguishes directory labels from how a connector authenticates and runs. The higher-touch verification path is assessed separately from simply connecting a working server, and the docs do not establish a guaranteed schedule. Do not promise that receiving a label changes OAuth requirements, grants extra runtime permissions or means every future version is safe. Maintain the connector regardless of its label. The exact classification process is time-sensitive; recheck the linked review documentation before presenting a definitive current-flow claim.

- [Claude connector checklist](https://claude.com/docs/connectors/building/review-criteria)
- [Claude connector submission](https://claude.com/docs/connectors/building/submission)

## 54. Audit what the tool really does.

03 DISTRIBUTE · CLAUDE

Current Claude checklist requires tool titles and applicable hints, and tool names no longer than sixty-four characters. It uses a conservative destructive hint for tools that modify or delete data. Interpret hints against each host's current rules rather than blindly copying labels from another platform. For custom query tools, name or link the target API. Check the actual implementation, not just metadata. All these conditions can be checked before submission. Community and Verified are different labels; current docs describe automated policy scans and selective higher-touch verification, not an approval speed guarantee.

Detailed reference from the first draft: Separate reads and writes. Do not combine GET and DELETE behind one method argument.
Describe capability, not model behavior. No hidden instructions, favoritism or unrelated software calls.
Return useful failures. Validate inputs; avoid generic errors and oversized responses.
Prove every tool in Claude. Inspector + custom connector; populated reviewer account.

- [Claude connector checklist](https://claude.com/docs/connectors/building/review-criteria)

## 55. The commit is the release input.

03 DISTRIBUTE · CLAUDE

A plugin folder is its own submission. The connected GitHub account must have push access, and validation applies to one commit. After a push, validate again. The source may remain private during validation/review with the required access and source-upload consent, but must become public before the directory listing goes live. Do not include confidential code accidentally. The default publication path involves an Anthropic reviewer even after checks pass; auto-publish behavior depends on the setting Anthropic applies. Maintain source, version, README, license and transparent data handling.

Detailed reference from the first draft: 01 Repository Manifest + components
→ 02 Local check claude plugin validate
→ 03 Portal Source + data handling
→ 04 Scan Per-commit findings
→ 05 Publish According to review setting

Passing checks does not automatically mean live. Publish settings and reviewer holds still apply.

- [Claude plugin submission](https://claude.com/docs/plugins/submit)

## 56. Cursor: source to marketplace.

03 DISTRIBUTE · CURSOR

Cursor documents supported plugin formats, including an Agent Plugins root manifest and the Cursor-specific manifest location. Use the format that matches the components you need, keep referenced paths valid and test locally. The submission portal accepts the public repository link and the Cursor team reviews the plugin. Include a clear README and configuration guidance. Direct MCP installation and a reviewed marketplace listing are separate routes. For a multi-plugin repository or variable-based setup, follow the current reference rather than assuming a package from another host imports unchanged.

- [Cursor plugin reference](https://cursor.com/docs/reference/plugins)

## 57. Installation has an organization boundary.

03 DISTRIBUTE · COPILOT

For GitHub Copilot, MCP can be configured through supported registry/gallery routes or manually, and organization-managed subscriptions have relevant policy controls. A server can be discoverable yet unusable for someone whose organization has disabled or restricted MCP. Keep this different from server-side authorization: an administrator allowing an integration does not give every user access to every downstream object. Document both the installation prerequisite and the expected sign-in flow. Verify the exact supported IDE surface and current policy setting rather than making a universal statement about all Copilot environments.

- [GitHub Copilot MCP integration](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp/extend-copilot-chat-with-mcp)

## 58. Choose the route your users can adopt.

03 DISTRIBUTE · LANDSCAPE

For Cursor, choose the supported Agent Plugins or Cursor-specific format, test locally and submit a public repository. For Copilot, separate the GitHub MCP Registry gallery from manual setup and enterprise enablement. For the official MCP Registry, hosted remote-only servers publish endpoint metadata; packaged servers also need package ownership verification. A self-hosted Claude marketplace is a distribution route for an audience that already trusts you; it is different from Anthropic directory listing. Keep install instructions host-specific and avoid a single universal configuration blob.

Detailed reference from the first draft: Route How to ship What it does not imply
Cursor marketplace Valid plugin manifest + public repo; submit at marketplace/publish Direct MCP config is not marketplace approval
Copilot / VS Code Registry discovery or manual MCP configuration Organization policy may still block usage
Official MCP Registry Publish server.json; prove namespace/package ownership Metadata hosting is not host approval
Your own marketplace Publish a host-supported catalog + install docs No automatic listing in an official directory

- [Cursor plugin reference](https://cursor.com/docs/reference/plugins)
- [GitHub Copilot MCP integration](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp/extend-copilot-chat-with-mcp)
- [Official MCP Registry quickstart](https://modelcontextprotocol.io/registry/quickstart)
- [Publish a Claude Code plugin](https://code.claude.com/docs/en/plugins/publish)

## 59. Publish the metadata.

03 DISTRIBUTE · REGISTRY

Explain that these commands are reference material, not commands the deck executes. The CLI reads its target registry from the login context. Namespace authentication and artifact ownership are separate checks. For an npm package, the quickstart uses mcpName in package metadata; other artifact types have their own proof. Never publish tokens in server.json. Remote-only metadata avoids an unnecessary package but does not remove the need to run a reliable service. The official Registry remains documented as preview at research time.

Detailed reference from the first draft: # Generate and inspect server.json
mcp-publisher init

# Authenticate for your namespace
mcp-publisher login github

# Validate and publish metadata
mcp-publisher publish
Packaged Verify the artifact
Publish to npm/PyPI/etc.; add the package-specific ownership proof.


Remote-only Verify the identity
Use your authorized namespace and stable remote endpoint metadata.



Inspect generated configuration and current schema first. No registry publication was performed for this talk.

- [Official MCP Registry quickstart](https://modelcontextprotocol.io/registry/quickstart)
- [MCP publisher CLI commands](https://github.com/modelcontextprotocol/registry/blob/main/docs/reference/cli/commands.md)

## 60. Prove two different identities.

03 DISTRIBUTE · REGISTRY

Separate permission to publish under a registry namespace from proof that the referenced package belongs to that publisher. The exact verification mechanism depends on the namespace and artifact ecosystem. The npm quickstart uses a package metadata claim tied to the MCP registry name; other package types use their documented mechanism. A remote-only server does not need a package artifact just to publish its endpoint metadata, but still needs an authorized namespace and a functioning service. Registry metadata publication is not a security endorsement or public listing approval from every host.

- [Official MCP Registry quickstart](https://modelcontextprotocol.io/registry/quickstart)
- [MCP publisher CLI commands](https://github.com/modelcontextprotocol/registry/blob/main/docs/reference/cli/commands.md)

## 61. Access is not redistribution permission.

03 DISTRIBUTE · OWNERSHIP

For a documentation integration, public availability is not enough to establish every right to copy, index, redistribute or proxy content. Explain the product’s first-party value, how source permissions are obtained and which source policies apply. The current OpenAI guidelines reject integrations that primarily function as unofficial third-party pass-through connectors, so do this analysis before building a broad aggregator. Claude also expects owned or legitimately proxied APIs and appropriate service identity. Do not turn the supplied 300+ site count into a claim that all source permissions or every directory approval have been independently audited here.

- [OpenAI plugin guidelines](https://developers.openai.com/plugins/plugin-guidelines)
- [Claude connector checklist](https://claude.com/docs/connectors/building/review-criteria)

## 62. Distribution ends at useful work.

03 DISTRIBUTE · ACTIVATION

This funnel is an original recommendation, not a platform analytics feature claim. A listing gives a distribution opportunity, not guaranteed discovery. Use task-specific example prompts and direct installation documentation. Instrument your own connection and tool boundaries with disclosed, minimized telemetry. You may not see every directory impression or final host answer. Look for successful activation using agreed definitions and controlled feedback, not raw call volume. Test the empty workspace and first consent flow. Keep public docs and status/support paths current after launch.

Detailed reference from the first draft: DISCOVER Clear listing + specific prompts
CONNECT OAuth completion + useful empty state
FIRST VALUE One successful, evidenced workflow
RETURN Reliable results + current source data

Approval ≠ placement ≠ installation ≠ useful work. Keep these metrics separate.



## 63. Keep the insight. Refresh the mechanics.

SYNTHESIS

The word tokenless describes onboarding UX, not a cryptographic design with no tokens. The existing blog has a strong product and operations narrative. Its transport and registration details need explicit version context now. This slide makes that editorial decision transparent. We have not edited the blog or the SEO worktree. Before the talk, refresh high-change facts: submission packaging, supported authentication, local-server distribution paths, verification labels and supported host protocol versions. Avoid attaching a review-time promise to this deck.

Detailed reference from the first draft: May 2026 blog framing Current treatment in this talk
Remote hosting reduces setup friction Retained as the narrative foundation
initialize / optional session example Earlier protocol era; current core is stateless
Dynamic registration for onboarding Check CIMD, pre-registration and DCR compatibility
Server works through a public tunnel Necessary integration evidence, not directory acceptance
Tokenless onboarding No manual token paste; access tokens still exist
Research checked November 1, 2026. Recheck portal and host behavior before presenting.

- [How to set up a remote MCP server for your SaaS](https://docsalot.dev/blog/how-to-set-up-a-remote-mcp-server-for-your-saas)
- [July 2026 MCP release](https://blog.modelcontextprotocol.io/posts/2026-07-28/)
- [MCP authorization](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)

## 64. Read-only still needs a trust model.

SYNTHESIS

Use this section to reconnecting the three topics to my work. Read-only lowers mutation risk; it does not remove data leakage, stale documentation, prompt injection in retrieved content, or redistribution obligations. Show an example failure: the tool returns version-one authentication instructions for a version-two question. Every transport span is green, but the workflow failed. The response needs source provenance and an unambiguous version. Ingestion and tool serving are separate operational systems. We should use this case to show judgment without claiming directory approvals, customer counts, or measured reliability we have not established.

Detailed reference from the first draft: 01 Sources Authorized docs + versions
→ 02 Ingestion Fetch → parse → index
→ 03 MCP tools Search → fetch source
→ 04 AI host Answer with evidence

Governance Per-site isolation; source rights; bounded fetch.
Observability Index age; empty results; citation correctness.
Distribution One clear workflow; honest data ownership.

Read-only still requires source rights, isolation, freshness and provenance.



## 65. Release through four proof points.

SYNTHESIS

This is the practical closing checklist, not a platform-mandated process. First prove usefulness with a small workflow. Second prove the boundary with denial and cross-tenant tests. Third prove operation by observing a deliberately injected downstream failure and rolling back a release. Fourth prove reviewability in the target host using a clean account and the exact release package. A local success is not hosted auth success; hosted success is not host compatibility; host compatibility is not directory approval. Teams can do some work in parallel, but none of these gates disappears because the server generated quickly.

Detailed reference from the first draft: 01 Useful
One real workflow. Small schema. Bounded result.

02 Safe
Tenant checks. Least privilege. Failure and retry semantics.

03 Operable
Trace. Evaluate. Alert. Owner and rollback.

04 Reviewable
Fixtures. Credentials. Platform package and evidence.


LOCAL PROOF → HOSTED PROOF → HOST PROOF → DIRECTORY PROOF



## 66. Build the tool. Ship the trust.

SYNTHESIS

Close the expanded field guide by returning to the opening. A working tool is the start; a reliable integration has enforceable boundaries, visible outcomes and reproducible evidence. Recap the three topics using these visual anchors. Explain one thing the audience can change tomorrow: narrow a generic executor, separate tool error from transport success, or create a reviewer fixture. No time target applies. Use Docsalot as the experience that motivates this work without claiming approvals or metrics not established in the material.



## 67. Where does it break?

DISCUSSION

Invite a concrete integration failure and choose its layer: authorization, long-running work, platform review, or result quality. Use the four diagram links to jump to the corresponding scene. Trace one request through its identities, data boundaries, execution outcome and release contract. When discussing a real system, separate what its logs prove from what is inferred. This is an open-ended discussion section with no time target.



## 68. The reference shelf.

REFERENCES

Source ledger: all primary references are linked below. Research baseline: November 1, 2026. Recheck changing portal and host requirements before delivery. Visuals, example timings and operational patterns are authored teaching material; they do not imply measured product metrics. Existing portrait retained. No further LinkedIn access is part of this revision.

- [MCP specification · 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28)
- [MCP transport bindings](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports)
- [MCP tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)
- [MCP authorization](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)
- [MCP security best practices](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices)
- [MCP Tasks extension](https://modelcontextprotocol.io/extensions/tasks/overview)
- [July 2026 MCP release](https://blog.modelcontextprotocol.io/posts/2026-07-28/)
- [OpenAI plugin submission](https://developers.openai.com/plugins/deploy/submission)
- [OpenAI plugin guidelines](https://developers.openai.com/plugins/plugin-guidelines)
- [OpenAI remote MCP review](https://developers.openai.com/plugins/deploy/app-review)
- [Submit a Claude plugin to OpenAI](https://developers.openai.com/plugins/guides/submit-claude-plugin)
- [Claude connector submission](https://claude.com/docs/connectors/building/submission)
- [Claude connector checklist](https://claude.com/docs/connectors/building/review-criteria)
- [Claude plugin submission](https://claude.com/docs/plugins/submit)
- [Publish a Claude Code plugin](https://code.claude.com/docs/en/plugins/publish)
- [Cursor plugin reference](https://cursor.com/docs/reference/plugins)
- [Cursor MCP support](https://prod.cursor.com/docs/mcp)
- [GitHub Copilot MCP integration](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp/extend-copilot-chat-with-mcp)
- [Official MCP Registry quickstart](https://modelcontextprotocol.io/registry/quickstart)
- [MCP publisher CLI commands](https://github.com/modelcontextprotocol/registry/blob/main/docs/reference/cli/commands.md)
- [OpenTelemetry MCP attributes](https://opentelemetry.io/docs/specs/semconv/registry/attributes/mcp/)
- [Faizan Khan · speaker profile](https://sessionize.com/faizan-khan/)
- [How to set up a remote MCP server for your SaaS](https://docsalot.dev/blog/how-to-set-up-a-remote-mcp-server-for-your-saas)
