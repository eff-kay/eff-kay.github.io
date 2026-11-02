# Atlas Docs — one server, from demo to distribution

Untimed, fictional, continuous example. The stages are teaching milestones, not protocol versions.

## 1. We shipped a tool. Then Maya tried to use it.

**S0 · Local · ONE SERVER · ONE STORY**

Open with the premise: we are going to build one imaginary product, Atlas Docs, and keep the same users, data and tools throughout the talk. Maya is a developer trying to integrate an API. Every layer we add is motivated by a requirement or failure she encounters. Atlas is fictional and the product stages are teaching milestones, not MCP protocol revisions. The story is intentionally untimed and technically expansive. At the end, the audience should be able to explain why each component exists and trace a request through the final system. The illustrations are authored scenarios, not a claim about Docsalot’s internal implementation or directory approvals.



## 2. Why I care about the last mile.

**S0 · Local · INTRODUCTION**

Introduce the experience behind the talk. Docsalot creates and hosts MCP servers, and the supplied scope is a read-only MCP surface for more than 300 documentation sites. That number is not a customer count, an adoption measure or a count of directory approvals. The fictional Atlas example lets us discuss the engineering systematically without pretending its architecture is an audited diagram of Docsalot production. Mention the developer tooling and research background only briefly. The existing Sessionize portrait is reused; no LinkedIn access is needed for this edition.

- [Faizan Khan · speaker profile](https://sessionize.com/faizan-khan/)

## 3. Meet Maya. Meet Atlas Docs.

**S0 · Local · THE EXAMPLE**

Establish the cast before teaching protocol details. Atlas Docs is a fictional service that owns its example documentation and APIs. Maya is a developer at a fictional customer workspace called North. A second workspace, Harbor, will matter later when we introduce private documentation and tenant isolation. For now there is one public guide and no authentication requirement. The task is not to rotate a real key through MCP: it is to find instructions about key rotation. That distinction keeps credentials and account mutations out of the initial tool surface. We will deliberately evolve the same product rather than switch examples for every concept.



## 4. Keep this question in view.

**S0 · Local · THE REQUEST**

Read Maya’s request: “How do I rotate an API key in v2?” This is the thread we will return to at the end of each phase. Initially, Atlas has only one example guide, so the first implementation can look successful without solving disambiguation, access or freshness. Later Maya will need private North-specific guidance and then become an authorized editor for an explicit update request. We will make those changes in intent and role visible rather than let a read-only question silently become permission to publish. Ask the audience to remember what the server knows at each stage.



## 5. S0: one tool. One hard-coded guide.

**S0 · Local · 01 BUILD · FIRST TOOL**

Start with a local SDK server and a single get_guide tool. It returns a constant, fictional guide. The host launches the process and communicates over stdio; there is no separate model running inside the MCP server. The handler does not search or contact an external API. Its lack of auth is appropriate only because the example content is public. It has no write capability. This is useful as a protocol and host smoke test, but it is not yet a documentation product. Point at the only path that matters: host to MCP handler to guide and back. The full architecture deliberately excludes jobs, private tenants and directory packaging at this point.

- [MCP transport bindings](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports)
- [MCP tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)

## 6. Register. Handle. Serve.

**S0 · Local · 01 BUILD · FIRST TOOL**

This is a shortened SDK v2 code view. The full example lives in examples/01-basic/server.ts. It imports McpServer from @modelcontextprotocol/server, serveStdio from @modelcontextprotocol/server/stdio, and z from zod/v4. serveStdio receives a factory, which registers a tool with an empty z.object input schema, a clear description and accurate read-only hints, then returns the server. The handler returns a content array with a text item. The SDK owns protocol framing and validates declared inputs; the application still owns semantic validation and authorization as the product grows. This starter is stdio-only and uses fixture text; it is not a remote or production-ready server. Protocol support must be verified against target hosts.

Complete S0 starter (TypeScript SDK v2):
/** Atlas Docs S0: one public fixture tool, stdio only. No private data or writes. */
import { McpServer } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import * as z from 'zod/v4';

serveStdio(() => {
  const server = new McpServer({ name: 'atlas-docs', version: '0.1.0' });
  server.registerTool(
    'get_guide',
    {
      title: 'Get the example Atlas guide',
      description: 'Return the single public Atlas API v1 guide fixture. Does not search or provide v2 guidance.',
      inputSchema: z.object({}),
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false }
    },
    async () => ({
      content: [{ type: 'text', text: 'Atlas API v1 — key rotation fixture. Create a replacement key, update your application, then revoke the old key. This fictional fixture is not v2 guidance.' }]
    })
  );
  return server;
});


- [MCP TypeScript SDK v2 · server quickstart](https://ts.sdk.modelcontextprotocol.io/v2/)
- [MCP tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)

## 7. The host chooses the tool.

**S0 · Local · 01 BUILD · FIRST TOOL**

Walk through the request sequence. Maya’s host decides to invoke get_guide; Atlas does not choose when the model should use it. The server reads its fixed text and returns it. The host then decides how to answer Maya. A successful tool call proves only that the basic host, tool registration and transport can work together. It does not prove the answer matches v2, that results are fresh, or that any private document would be safe. This distinction will explain why we later need both server telemetry and an end-to-end answer evaluation. JSON-RPC request identifiers correlate messages; they are not business-operation deduplication keys.

- [MCP tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)
- [MCP transport bindings](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports)

## 8. The tool works. The task still fails.

**S0 · Local · 01 BUILD · THE FIRST FAILURE**

The first failure is semantic rather than transport-level. The hard-coded guide is for v1, while Maya asked for v2. Atlas returned a perfectly well-formed tool response. The host may summarize it confidently unless the result makes its limits clear. This is an authored failure scenario, not a measurement. Ask the audience what we should add before showing the next slide: a version-aware corpus and a way to select the right guide. We do not solve this by adding a vague instruction to “always be accurate.” We need the product contract and data model to represent the distinction.



## 9. S1: search the corpus. Fetch the chosen guide.

**S1 · Search · 01 BUILD · RETRIEVAL**

We now replace the fixed response with a corpus and two coherent tools. search_docs finds candidate guides; get_doc returns a selected source. The user does not need to guess an internal identifier in the opening prompt. The search result supplies identifiers the host can use for the fetch. These are independent model-callable operations with a bounded result size and clear descriptions. They are not a generic HTTP executor. Because Atlas owns the fixture API and docs, the story’s first-party service identity is straightforward. Later platform policies still require accurate ownership and data-handling explanations for a real product.

- [MCP tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)

## 10. Make version an explicit input.

**S1 · Search · 01 BUILD · RETRIEVAL**

The domain input is query, site, version and a small result limit. A schema constrains the shape, length and bounds. The handler validates whether that site and version are supported and will later resolve whether the caller may access them. A missing or ambiguous version should lead to an explicit clarification or documented fallback, not a silent default to whatever looks similar. In the current public-only stage, site is a catalog selector, not an arbitrary URL. This blocks the accidental expansion from “search our docs” to “fetch anything on the network.” The exact limit of three is a fixture choice, not a protocol requirement.

- [MCP tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)

## 11. Return evidence the host can inspect.

**S1 · Search · 01 BUILD · RETRIEVAL**

The example result carries a title, document ID, canonical source URI, version and relevant excerpt. All domains ending in .example are fictional placeholders. The excerpt is documentation text, not a command to the host and not a request for a real key. Return only fields needed to answer or fetch the source; keep internal traces, tokens and unrelated account context out of the model-visible result. For the complete result, get_doc can return bounded canonical content. The host remains responsible for how it uses citations in the final answer, so we will evaluate citation and version correctness separately from the RPC status.

- [MCP tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)
- [OpenAI plugin guidelines](https://developers.openai.com/plugins/plugin-guidelines)

## 12. Maya gets the v2 guide.

**S1 · Search · 01 BUILD · CHECKPOINT**

Pause and replay Maya’s original request. The host calls search_docs with the explicit v2 constraint, receives bounded evidence, then fetches the chosen document if necessary. The answer can now point to a v2 source instead of inventing a version match. What changed? We added a corpus, search/fetch separation and version-aware evidence. What did not change? The server is still local, public and read-only. We have not earned the right to claim remote onboarding, private data safety or reliable publishing. This checkpoint makes the system’s limits visible before adding the next requirement.



## 13. “Can my teammate use Atlas too?”

**S2 · Remote · 01 BUILD · REMOTE ACCESS**

Maya’s teammate wants access without reproducing a local runtime setup. We extract the domain retrieval logic from the stdio handler and host it behind a stable HTTPS MCP endpoint. That is a deployment and adapter change, not a reason to rewrite search semantics. Public guide retrieval can still be unauthenticated if that is the deliberately intended product. The remote service introduces network, proxy, timeout and compatibility concerns. We use a tested SDK transport and explicitly support the host/protocol intersection. We do not transplant an earlier initialize/session snippet into the current stateless protocol without checking the SDK and target host.

- [MCP transport bindings](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports)
- [July 2026 MCP release](https://blog.modelcontextprotocol.io/posts/2026-07-28/)

## 14. One core. Two adapters.

**S2 · Remote · 01 BUILD · REMOTE ACCESS**

The same tested search and evidence functions should power both adapters. Keep transport framing and authentication seams separate from application behavior. For this story, the hosted service exposes the same useful read tools rather than a new set of arbitrary endpoint wrappers. Pin the SDK major line and supported protocol revisions. Current SDK v2 and v1 use different package and transport APIs; the starter deliberately uses the v2 shape. A host that supports MCP is not necessarily compatible with every current extension or protocol revision. Test real hosted clients, discovery routes and the production proxy path instead of treating localhost success as enough.

- [MCP TypeScript SDK v2 · server quickstart](https://ts.sdk.modelcontextprotocol.io/v2/)
- [MCP transport bindings](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports)

## 15. Then Maya asks for North’s private guide.

**S3 · Auth · 01 BUILD · PRIVATE DOCS**

The requirement changes: Maya now needs a private guide containing North-specific integration instructions. The server must know who the caller is and which workspace they can access. Public and private content need explicit boundaries; adding a hidden “tenant” argument to the tool is not authentication. The public path can remain available without identity, but it must never fall through to private data. We introduce resource-bound OAuth access for the hosted service and test the target hosts’ supported registration and consent mechanisms. Keep the privacy policy and source documentation aligned with this new private-data capability.

- [MCP authorization](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)
- [MCP security best practices](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices)

## 16. Add a resource-bound grant.

**S3 · Auth · 01 BUILD · AUTHENTICATION**

This diagram explicitly separates the host, Atlas resource server and issuer. OAuth resource server and authorization server are separate roles even if deployed together. The MCP endpoint’s challenge points the host toward protected-resource metadata; the client discovers the issuer and performs its supported registration and PKCE-based authorization flow. The token is intended for Atlas MCP. Atlas validates it and then applies operation/object checks. Do not forward that token to an unrelated upstream API. Client ID metadata, pre-registration and compatibility dynamic registration need to be tested against the actual host.

- [MCP authorization](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)
- [MCP security best practices](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices)

## 17. “I’m Maya” does not mean “I can read Harbor.”

**S3 · Auth · 01 BUILD · AUTHORIZATION**

Introduce Harbor as the second fictional tenant. Maya’s authenticated identity maps to North on the server. A model-supplied document ID or workspace selector cannot grant access to Harbor. Filter the index by authorized scope before ranking or returning counts and snippets, then recheck returned objects to catch index ACL lag. Apply the same boundary to get_doc, pagination cursors, source URLs and caches. A token with a read scope authorizes an action category, not every document in every workspace. Test denial without leaking whether a forbidden private object exists. This is application policy, not automatic isolation supplied by MCP.

- [MCP security best practices](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices)

## 18. The question stayed the same. The boundary changed.

**S3 · Auth · 01 BUILD · PRIVATE DOCS**

Replay the question in the North workspace. Maya signs in and consents; the server resolves her identity and North grant, validates the v2 filter, searches only accessible documents, and returns the correct source. The host sees enough evidence to answer but not a raw token, broad conversation history or Harbor data. Summarize the first act: we evolved from a constant to versioned search, hosted the same core, and added identity plus authorization when the data required it. The result remains read-only. The next act requires a new explicit user request and editor permission; nothing about reading the guide silently authorizes a write.



## 19. “This guide is stale. Can you fix and publish it?”

**S4 · Writes · 02 OPERATE · NEW USER INTENT**

Make the change in authority explicit. Maya is now acting as an editor who has a North publishing grant, and she asks to fix and publish the stale guide. This is a different user intent from the opening retrieval question. We need write-specific contracts, appropriate annotation and a confirmation or approval model for the consequential action. A read token does not become a publish token just because a model notices a stale page. The example does not perform real publishing. The key teaching point is that expanding the tool surface should follow a legitimate workflow and be accompanied by stronger policy and reliability semantics.

- [MCP tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)
- [OpenAI plugin guidelines](https://developers.openai.com/plugins/plugin-guidelines)

## 20. Separate draft from publish.

**S4 · Writes · 02 OPERATE · WRITE CONTRACTS**

Keep read, draft and publish operations distinct. For this fictional product, save_draft creates or updates a revision inside North, while publish_doc changes the public version of an identified document. Their metadata must describe actual effects and limitations. Host annotation rules are platform-specific, so apply the current target requirements and do not assume an undo button makes an action harmless. Validate editor access and target ownership in every write handler. A generic api_request(method, body) tool would conceal precisely the boundary we need both the model and a reviewer to understand. Starting persistent workflows and writing artifacts are state changes too.

- [OpenAI plugin guidelines](https://developers.openai.com/plugins/plugin-guidelines)
- [Claude connector checklist](https://claude.com/docs/connectors/building/review-criteria)

## 21. Approve this change to this revision.

**S4 · Writes · 02 OPERATE · APPROVAL**

The approval or confirmation must identify the exact action, document and proposed content, not a vague permission to “fix docs.” Include the base revision or equivalent precondition so the server can reject a stale update if someone edits the document before execution. Recheck current permissions at the execution boundary. A host confirmation UI is useful but cannot replace backend authorization. If permissions are revoked while a long workflow waits, define how the eventual write is denied. The r17/r18 revision labels are fictional. This is a recommended application contract, not a universal MCP approval packet format.

- [MCP security best practices](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices)

## 22. Another editor published first.

**S4 · Writes · 02 OPERATE · CONCURRENCY**

A safe write must cope with concurrency. Maya’s draft was based on r17, but another editor has already made r18 current. A base-revision precondition prevents overwriting the newer work. Return an actionable conflict rather than silently rebasing arbitrary content or treating the stale approval as valid for a different diff. The host can fetch the latest revision, explain the conflict and ask Maya to review a new proposal. An application-defined revision precondition is separate from idempotency, which will later handle repeating the same intended operation after an ambiguous response.



## 23. Maya says “it failed.” HTTP says “200.”

**S5 · Signals · 02 OPERATE · OBSERVABILITY**

The server returned a complete HTTP exchange containing an actionable tool failure. Looking only at status codes would count that as success and hide Maya’s problem. Instrument transport completion, tool execution and end-to-end task outcomes separately. For this case, record a bounded conflict category, tool name, build/contract version and duration in internal telemetry. Avoid logging Maya’s full conversation or the whole private document. A server trace tells us what Atlas executed; it does not reveal every step of the host’s reasoning or prove the final answer was useful. The displayed status is an illustrative scenario, not a measured error rate.

- [OpenTelemetry MCP attributes](https://opentelemetry.io/docs/specs/semconv/registry/attributes/mcp/)
- [MCP tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)

## 24. Trace the Atlas request.

**S5 · Signals · 02 OPERATE · OBSERVABILITY**

These are invented teaching timings, summing to 240 ms; do not present them as Docsalot or Atlas measurements. This failed request stops at its revision precondition: no storage write occurs. The waterfall isolates authentication/policy, the revision check and the error result. Track queue wait separately once jobs exist. Use your service’s trace context and access-controlled telemetry to investigate the storage dependency; a third-party host may not provide an upstream trace. Keep internal trace identifiers out of model-visible results unless needed for the actual task. Choose metric labels with bounded cardinality rather than tagging every request or private document ID. Operational visibility should be narrow, disclosed and subject to retention and access controls.

- [OpenTelemetry MCP attributes](https://opentelemetry.io/docs/specs/semconv/registry/attributes/mcp/)

## 25. Reload r18. Review and approve r19.

**S5 · Signals · 02 OPERATE · RESOLVE THE CONFLICT**

Resolve the earlier conflict explicitly. Another editor created r18 while Maya was working from r17. Maya now reloads r18, reviews the resulting proposed diff and authorizes a new publish to r19. The server checks her current editor grant and the new base-revision precondition before committing. Do not silently reuse approval for the old r17-based proposal. The next evaluation verifies r19; the later lost-response scene is a fault-injected replay of this same publish attempt, rather than an unexplained extra publication. Keeping these revision identities consistent lets the audience follow the actual state changes.



## 26. Define the expected answer after publication.

**S5 · Signals · 02 OPERATE · EVALUATION**

Define an end-to-end acceptance test using the opening question. The target is North’s v2 guide at r19, with an accessible canonical source. This is the expected result, not a claim the index already reflects publication. The next scene exposes that freshness gap. Assert the guide’s version, permitted workspace, source and revision, not only the transport status. Add negative fixtures for an unauthorized Harbor document, an unsupported version and a read-only caller attempting publish_doc. A valid no-match is different from a dependency failure. Use a controlled host evaluation to test the final answer because server-only telemetry cannot see the full user outcome. The same fixture and expected tool sequence will later become review evidence for distribution. This is how the narrative links product testing to submission rather than creating a new demo for the directory.

- [OpenTelemetry MCP attributes](https://opentelemetry.io/docs/specs/semconv/registry/attributes/mcp/)

## 27. The guide is published. The index is still rebuilding.

**S6 · Jobs · 02 OPERATE · LONG WORK**

Maya’s newly published revision is stored, but the search index needs rebuilding. Atlas now supports reindex_site, an explicit stateful job under an editor/operator grant. This is additional work after the publish action, not an unannounced promise that publishing and index freshness are one atomic operation. Explain the product’s visible state: current source revision r19, index still at r18 until the job completes. A request timeout or disconnect does not prove the worker stopped. We need durable status and ownership checks. Do not silently run a write under the read-only label just because indexing helps a future read.

- [MCP Tasks extension](https://modelcontextprotocol.io/extensions/tasks/overview)
- [OpenAI plugin guidelines](https://developers.openai.com/plugins/plugin-guidelines)

## 28. Persist the job. Return the handle.

**S6 · Jobs · 02 OPERATE · ASYNC CONTRACT**

If the host and server support the current MCP Tasks extension, Atlas can use its task-handle and polling contract. If not, Atlas needs an explicit application start/status/result tool interface. Do not assume extension support merely because the server can implement it. In either design, persist the job before acknowledging acceptance, authorize every status and result read, define retention/TTL and bound queue capacity. A task ID is not permission to inspect another user’s work. Cooperative cancellation reports intent; it does not guarantee rollback of committed side effects. The diagram is conceptual and the example’s exact method surface depends on the chosen compatible path.

- [MCP Tasks extension](https://modelcontextprotocol.io/extensions/tasks/overview)

## 29. Replay the publish. Lose the response.

**S6 · Jobs · 02 OPERATE · THE RETRY PROBLEM**

Replay the same approved r19 publish with fault injection: the storage write commits, but its response is lost. This is an alternate failure trace for that operation, not an extra request to publish another revision. Maya’s host now has an unknown outcome. A blind retry could create r20 or trigger another publish notification. A new JSON-RPC request ID does not solve this business problem. Even a valid base-revision check may now report a conflict without telling the user that her own earlier operation succeeded. We need an application operation key and a durable outcome lookup. This is distinct from retrying a harmless read, though even reads need cost and rate limits. The failure is hypothetical but illustrates a common distributed-systems ambiguity.



## 30. Same operation key. Same stored outcome.

**S6 · Jobs · 02 OPERATE · IDEMPOTENCY**

p42 is a fictional application key representing the same intended publish, not a JSON-RPC correlation ID. Scope it to the validated principal and operation and bind it to a canonical payload hash. For a matching retry, return the stored result r19; for a conflicting payload under the same key, reject the request. Coordinate concurrent requests atomically and define how long records live. Where possible, persist the operation outcome atomically with the document revision. If a queue or downstream effect crosses that transaction boundary, use a durable handoff and reconciliation instead of claiming exactly-once effects. Never accept a caller’s key as proof of authority.



## 31. Store the revision and the indexing event.

**S6 · Jobs · 02 OPERATE · DURABLE HANDOFF**

Atlas uses a local transaction to store the published revision and an outbox event for indexing. A worker processes committed events and updates the index. Delivery can repeat after a crash, so the worker must deduplicate or make applying a particular source revision idempotent. This design reduces the gap between a committed write and a lost job handoff; it does not make every external effect exactly-once or the index instantly consistent. Expose index freshness explicitly so Maya knows when r19 is searchable. Alternative workflow engines can provide a different durable handoff, but the application still needs defined failure and reconciliation behavior.



## 32. Now the retry returns r19.

**S6 · Jobs · 02 OPERATE · CHECKPOINT**

Close the async/retry sequence using the same document, actor and revision. Maya’s retry carries p42. Atlas validates the current caller and operation relationship, recognizes the stored payload, and returns the original successful r19 outcome rather than creating another revision. The durable indexing event can also be retried until the index reflects r19. A failure in indexing is reported as that specific state, not as proof that the publish never happened. The audience should now be able to distinguish publication commit, response delivery, job execution and index freshness as separate events. We added complexity because they can fail independently.



## 33. North gets busy. Harbor needs service too.

**S7 · Govern · 02 OPERATE · GOVERNANCE**

A working job system can still be exhausted by one tenant. Put limits on per-tenant concurrency, queue depth, request size, query cost and result size, along with global downstream budgets. Fair scheduling prevents North’s rebuilds from starving Harbor’s retrieval or indexing. Define whether overload rejects, defers or creates a job and return an actionable capacity response. Apply bounded retries with backoff and jitter for transient failures instead of synchronizing all clients into a retry storm. These are recommended service policies, not requirements imposed automatically by MCP. Keep operational metrics private and bounded.



## 34. The tool description is part of the release.

**S7 · Govern · 02 OPERATE · CHANGE CONTROL**

The team proposes changing the tool’s description from searching North’s authorized docs to searching all workspaces. That text can alter model triggering and implied capability even before a handler changes. Review description, input/output schema, annotations, policy and implementation as one contract. A publisher cannot fix unauthorized behavior merely by narrowing a sentence, nor expand access merely by broadening it. Maintain an inventory with a named owner, source rights, data classification and a disable path. For this story we reject the unbounded change and keep authorized tenant isolation. Later, directory scanning will add another contract gate to this internal release process.

- [OpenAI remote MCP review](https://developers.openai.com/plugins/deploy/app-review)
- [Claude connector checklist](https://claude.com/docs/connectors/building/review-criteria)

## 35. Atlas is now a hosted product.

**S7 · Govern · 02 OPERATE · SYSTEM CHECKPOINT**

Pause on the grown architecture and invite the audience to name each box’s purpose. The host chooses tools; Atlas validates and dispatches; policy resolves identity, tenant, scope and object; the docs service stores revisions and queries a versioned index; workers process durable indexing events with bounded capacity. Internal telemetry observes the path without copying raw chats. The picture is still a simplified conceptual map: the issuer, operation ledger, outbox and telemetry are details within these boundaries, not absent responsibilities. No directory has approved anything yet. We are finally ready to distribute the same working product, using its own regression scenarios as review evidence.



## 36. “Can I install Atlas from my assistant?”

**S8 · Submit · 03 DISTRIBUTE · FIRST USERS**

The next requirement comes from users who want to discover and install Atlas from the host’s ecosystem. Keep the distinction clear: a direct compatible connection can work before a public listing exists, subject to host and organization policy. A directory route adds packaging, ownership, product and review requirements. It does not replace Atlas’s auth, object checks or operations. We will submit the same bounded retrieval and publishing capabilities rather than build a different impressive demo just for reviewers. Explain the integration’s first-party value and why it accesses only the intentionally authorized data.

- [Submit a Claude plugin to OpenAI](https://developers.openai.com/plugins/guides/submit-claude-plugin)
- [Cursor MCP support](https://prod.cursor.com/docs/mcp)

## 37. Give reviewers Maya’s complete journey.

**S8 · Submit · 03 DISTRIBUTE · REVIEW FIXTURE**

Use a dedicated reviewer fixture representing Maya’s authorized North workspace, never a real customer account. Populate it with the v1/v2 documents, an editable draft and a safe indexing job so the entire intended workflow can be exercised. Provide exact prompts, expected tool names and observable outcomes. Re-run from a clean host session to reveal cached-consent and remembered-credential assumptions. Reviewer login must be usable without waiting for your private approval. Keep the account’s permissions limited to fixture data. Negative scenarios should prove that Harbor data, invalid destinations and unauthorized publishing are denied. The sequence on screen is a journey summary, not a substitute for each platform’s required number and format of tests.

- [OpenAI plugin submission](https://developers.openai.com/plugins/deploy/submission)
- [Claude connector submission](https://claude.com/docs/connectors/building/submission)

## 38. OpenAI: Atlas becomes a plugin package.

**S8 · Submit · 03 DISTRIBUTE · OPENAI**

For OpenAI, package the Atlas integration with the current supported plugin manifest and MCP connection configuration, plus any optional skills. Use the verified publishing identity and required organization access. Upload the archive, resolve setup and validation findings, and configure the stable public HTTPS endpoint and supported authentication. Keep secrets and reviewer credentials out of the ZIP. Submit the required evidence, then publish only after approval. The exact package fields and portal behavior are date-sensitive; the official submission guide was rechecked for this edition on November 2, 2026. The full Atlas system is hypothetical and no actual submission is performed.

- [OpenAI plugin submission](https://developers.openai.com/plugins/deploy/submission)

## 39. Five positive cases. Three boundary cases.

**S8 · Submit · 03 DISTRIBUTE · OPENAI EVIDENCE**

Prepare exactly five positive and three negative cases for the initial single-MCP review, with the required walkthrough and release notes. The Atlas examples align with features already introduced: correct v2 search, fetching a permitted source, valid no-match behavior, publishing a sample revision and reindexing the fixture. Negative cases use Maya’s North account against Harbor content, a read-only account against publishing and an unsupported internal URL. Specify expected tools and outcomes and run the cases using the reviewer account. The video should demonstrate this same product behavior rather than a separate happy-path mockup. Enter reviewer access privately in the portal.

- [OpenAI plugin submission](https://developers.openai.com/plugins/deploy/submission)

## 40. Claude: submit the remote connector.

**S8 · Submit · 03 DISTRIBUTE · CLAUDE**

Use Claude’s developer portal and select MCP connector for Atlas’s remote HTTPS endpoint. Test every tool in the actual host, provide the required titles and appropriate hints, and supply documentation, privacy/support information and the reviewer fixture. If Atlas also packages a workflow as a plugin, submit that bundle through the separate GitHub-based plugin path and submit the owned remote connector too. Skills are not a standalone connector listing. Current dedicated documentation routes local servers through plugins rather than accepting the older standalone MCPB directory path. Keep the distinction between a working connector and any Community/Verified review label.

- [Claude connector submission](https://claude.com/docs/connectors/building/submission)
- [Claude plugin submission](https://claude.com/docs/plugins/submit)
- [Claude connector checklist](https://claude.com/docs/connectors/building/review-criteria)

## 41. Atlas exposed a mixed read/write tool.

**S8 · Submit · 03 DISTRIBUTE · REJECTION AND REPAIR**

Frame this as a hypothetical finding, not an actual Atlas or Docsalot rejection. Suppose the team accidentally reintroduced a catch-all docs_request operation in the submission package. Claude’s published checklist rejects tools that combine safe and unsafe HTTP methods. The fix is behavioral: expose meaningful read and write operations separately, give them accurate metadata, update the implementation and rerun the fixture scenarios. A new name for the same generic executor does not resolve the boundary. For any real review, use the exact feedback and the applicable current policy. Do not invent rejection percentages, guaranteed timelines or a claim that this repair guarantees acceptance.

- [Claude connector checklist](https://claude.com/docs/connectors/building/review-criteria)
- [OpenAI plugin guidelines](https://developers.openai.com/plugins/plugin-guidelines)

## 42. Same service. Different installation contracts.

**S8 · Submit · 03 DISTRIBUTE · OTHER ROUTES**

Cursor offers direct MCP setup and a reviewed plugin marketplace route with supported manifest formats and a public repository submission. Copilot/VS Code can use supported registry/gallery installation or manual MCP configuration, subject to relevant organization policy and user trust. The official MCP Registry hosts metadata about the endpoint or package; it does not run Atlas or approve it for every host. Establish namespace and any package ownership proof for that route. Keep installation instructions specific to the host. A portable protocol does not mean identical packaging, shared review status or uniform extension support across these ecosystems.

- [Cursor plugin reference](https://cursor.com/docs/reference/plugins)
- [GitHub Copilot MCP integration](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp/extend-copilot-chat-with-mcp)
- [Official MCP Registry quickstart](https://modelcontextprotocol.io/registry/quickstart)

## 43. S9: the server changes before the host’s schema does.

**S9 · Evolve · 03 DISTRIBUTE · AFTER APPROVAL**

Distribution is not the last release. Suppose Atlas wants a new optional publishing input or a stronger conflict-reporting shape. Under continuous review, the host may retain the previously approved definition while Atlas’s implementation has already changed. Accept the old contract during that window, avoid making new fields required prematurely, and inspect the live metadata rather than assuming a server deployment updated the host. Preserve resource references as well as input compatibility. New or changed tools can have separate scan outcomes. Roll back a breaking implementation instead of waiting for review to fix runtime behavior. This ties internal schema governance directly to public distribution.

- [OpenAI remote MCP review](https://developers.openai.com/plugins/deploy/app-review)

## 44. Follow Maya’s request one last time.

**S9 · Evolve · 03 DISTRIBUTE · THE FULL JOURNEY**

Use the exact opening question again. The host selects Atlas’s read tool. The endpoint accepts a supported protocol request, validates the resource-bound token if private data is needed, resolves Maya’s North permissions and checks the requested action and objects. The domain service filters the index by site/version and current access, then returns bounded evidence with provenance. Internal traces classify transport, tool and dependency behavior without collecting the raw chat. The host answers with the correct North v2 source. Durable jobs and publishing controls are not invoked merely because they exist; they serve the separate update workflow. Distribution made this capability installable but did not grant additional data access.

- [MCP authorization](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)
- [MCP tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)

## 45. Every layer has a reason to exist.

**S9 · Evolve · SYNTHESIS · WHAT CHANGED**

Ask the audience to explain the right column before you name it. Wrong-version instructions required explicit retrieval constraints and provenance. Private docs required a user/resource grant and object authorization. New publishing intent required separate write tools, revision checks and approval semantics. Ambiguous completion required a durable operation outcome, while indexing needed a durable handoff. New users needed product-specific distribution evidence. The diagram condenses the narrative; it does not imply these are the only controls needed for production. The aim is that the final architecture no longer looks like an arbitrary pile of infrastructure. Each part should remind the audience of a concrete failure we already traced.



## 46. We started with a constant.

**S9 · Evolve · SYNTHESIS · THE COMPLETE PRODUCT**

Compare this map with the stage-zero server. We still have the same basic idea: a host invokes a bounded capability over MCP and receives useful results. What grew is the product boundary around it: coherent retrieval, remote adapters, private access, explicit editor actions, observable execution, durable recovery, operational budgets and reviewable distribution. This is a conceptual final map, with the detailed ledger/outbox/issuer responsibilities explained earlier. Do not describe it as an audited Docsalot diagram. The test of understanding is whether someone can trace both Maya’s read request and her explicit publish/reindex workflow, including their denial and failure paths.



## 47. One tool can be small. A trustworthy product is deliberate.

**S9 · Evolve · CLOSING**

Close through the story instead of repeating a checklist in isolation. Atlas began with one fixed guide and ended with a system whose permissions, execution and distribution we can reason about. The important skill is not adding every possible component on day one; it is recognizing when a legitimate requirement creates a new boundary and implementing the smallest reliable response. Ask the audience to identify the next failure in their own integration and the evidence they would need to show it is solved. Mention Docsalot’s work as the experience behind the talk without suggesting Atlas is a shipped customer product or that the example has received any directory approval.



## 48. Where would your request fail?

**S9 · Evolve · DISCUSSION**

Invite a concrete question and stay with the same fictional system. Identify the actor, desired action, data boundary and observed failure before suggesting a new control. Use the links to revisit authorization, durable jobs or the platform submission routes. Distinguish what the server knows from what the host or user experiences. For a distribution question, locate the relevant submission artifact and current official source rather than suggesting a universal plugin format or approval transfer. There is no time target or required Q&A duration for this edition.



## 49. The source shelf.

**S9 · Evolve · REFERENCES**

Sources are linked below and from the relevant slides. The prior edition’s research baseline was November 1, 2026; the SDK v2, OpenAI submission and Claude connector submission entry points were checked again for this edition on November 2. The example, actors, domains, revisions, operation keys, test data and timings are fictional teaching fixtures. Security and reliability designs that go beyond protocol requirements are labeled as application recommendations in the notes. The minimal stdio starter is included separately; the later stages are explanatory designs and handler pseudocode, not a complete deployed product. Both earlier decks remain preserved. No submission, publication or LinkedIn access was performed.

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
- [MCP TypeScript SDK v2 · server quickstart](https://ts.sdk.modelcontextprotocol.io/v2/)
