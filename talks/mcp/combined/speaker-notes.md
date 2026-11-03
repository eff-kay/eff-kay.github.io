# From APIs to MCP to distribution — combined preview

33 slides: presenter introduction, 31 content slides and Q&A. Expanded review draft; no timing target is asserted.

## Slide 1. Faizan Khan

Source: first-principles-experiment / slide 1.

I’m Faizan. At Docsalot we create and host MCP servers, including read-only access to more than 300 documentation sites. Our example today is a chatbot we build for the browser. Maya types into our web UI; our backend calls OpenAI’s API and executes the store’s tools. Then we switch that backend to Claude’s API and see which integration details change. That helps us derive a reusable store-facing MCP interface. Later, as a separate distribution step, we take the store into consumer applications such as ChatGPT and Claude. The store, providers and purchases are hypothetical; these slides explain the architecture rather than claiming a deployed browser chatbot or live paid model requests.

## Slide 2. Maya uses our chatbot in her browser.

Source: first-principles-experiment / slide 2.

This is the application we are building: a chatbot in Maya’s browser. She types her request into our web UI. The browser sends it to our backend, and our backend calls OpenAI’s API with the conversation and the available tool definitions. It also runs the code that reaches the store’s catalog, routing, delivery and order services. The browser does not receive our model-provider keys or directly execute trusted store operations. Maya asks for a blue carry-on backpack under a hundred dollars delivered by Friday, then reviews a quote before buying. We are starting without MCP. Later we will replace the OpenAI API integration with Claude’s API inside this same browser chatbot. Our example is a web application that we build and operate.

## Slide 3. Each service knows one part of Maya’s request.

Source: first-principles-experiment / slide 3.

Our first challenge is explaining functionality. The catalog finds backpacks, GeoRoute resolves the saved destination, ParcelQuote estimates shipping and arrival, and our order service places or cancels purchases. Maya’s AI needs to understand those jobs before it can choose the right operation. An endpoint address alone does not communicate when to use it, which inputs it needs or what its answer means. We still expose ordinary HTTP APIs, and OpenAPI descriptions can already capture much of this information. But we must deliberately write clear descriptions and make them available through the host’s integration. The service names, purpose, inputs and useful results form the capability menu the model reasons over. The store is headless in this example: the assistant is choosing functions instead of clicking through a storefront.

## Slide 4. With a fixed application, we can write the flow ourselves.

Source: first-principles-experiment / slide 4.

We can already write the store workflow in ordinary backend code: search the catalog, resolve the destination, get a courier estimate and prepare checkout. Our fixture is a seventy-nine-dollar backpack plus twelve dollars delivery, with ninety-one dollars total including tax and an estimated Friday arrival. Our browser chatbot makes the next step dynamic: Maya can ask a follow-up, buy, or cancel. We call OpenAI’s API so its model can propose the next function based on the conversation. Our backend must tell it what the functions do, validate their arguments, execute them and return their results. MCP is not needed to make this first API-only version work. We want to discover what becomes reusable when we extend the functionality and later switch model providers.

## Slide 5. Turn Maya’s request into a real API call.

Source: first-principles-experiment / slide 5.

Maya asks what delivery will cost. Our backend has sent function descriptions to OpenAI’s API, and the model can return a function_call requesting quote_delivery. The JSON on the left is a normalized illustration of its name and arguments; in the actual Responses API, we read the returned function call and parse its arguments. Our backend validates those inputs. The Python on the right is the route-provider call inside our store adapter: send the saved address reference, check the response and read the distance. The next provider call obtains the delivery estimate. Our backend then sends the tool result back to OpenAI as function_call_output associated with the original call ID, and continues the conversation. The model proposes the operation; our backend executes it.

## Slide 6. Teach the AI what each function is for.

Source: first-principles-experiment / slide 6.

Here is how our own chatbot conveys functionality to the model. We build an OpenAI function tool definition with its type, name, description and parameters schema, then include it in the API request. QUOTE_SCHEMA is a JSON Schema object defining the product identifier and saved-address reference; it is expanded in the companion example file. The description explains when this function is useful, and the schema describes its arguments. The model should choose search for available items, quote_delivery for price and arrival, and place_order only after the reviewed checkout. Our code still validates every proposed call. Our backend supplies this tool definition in its OpenAI model request. When we switch to Claude’s API, we can reuse the same domain schema but adapt the provider’s surrounding tool-definition format and result handling.

## Slide 7. Our backend runs the conversation-and-tool loop.

Source: first-principles-experiment / slide 7.

This sequence is the actual API-only integration pattern for our web chatbot. Maya’s browser sends a message to our backend. The backend sends that message and tool definitions to OpenAI. OpenAI can return a function_call; our code parses it, checks the arguments and executes the relevant store function. The store returns facts, and our backend sends a function_call_output with the matching call ID back to the model. The model can request another function or return text that our backend sends to Maya’s browser. A tool is a named function the model can request; its backend implementation might call a read-only search or change an order. API credentials, execution, validation and the loop belong on our server. The drawing is simplified to one tool turn; a real implementation handles multiple calls, failures, approvals and bounded retries.

## Slide 8. Maya’s identity cannot be a prompt parameter.

Source: first-principles-experiment / slide 8.

Before quoting a saved address or reading an order, I need to know whose data this is. Maya signs in and grants the intended access. The adapter derives her customer identity from verified credentials rather than trusting a customer identifier generated by the model. It checks whether the token permits the operation. Our server keeps its GeoRoute and ParcelQuote credentials on the trusted side and sends only the data those providers need. This is not a new problem invented by AI, and MCP will not make it disappear. But an assistant taking action on someone’s behalf makes the trust boundary especially important. A tool definition is a description of a capability; it is never proof that Maya authorized the action.

## Slide 9. A quote is information. A purchase is a commitment.

Source: first-principles-experiment / slide 9.

We found a product and shipping estimate. That does not authorize a purchase. I present the ninety-one-dollar quote with the item, destination and validity period. Maya explicitly confirms that specific checkout. The adapter verifies that the quote still exists, has not expired, belongs to Maya and matches what she confirmed. Only then does it request order creation. In this example, confirmation is a trusted host interaction linked to the quote; a model-generated confirmed equals true flag would not prove consent. We are illustrating order creation, not processing real payments. The exact checkout and consent experience depends on the host and its policies. The important design step is to separate reading a quote from committing an order.

## Slide 10. Then Maya says: “Actually, cancel it.”

Source: first-principles-experiment / slide 10.

Maya’s follow-up gives us two more requirements. The host needs to resolve it to the right order using the conversation and verified customer context. The server then checks ownership and the current fulfilment state. Our fictional policy permits cancellation before dispatch. Once dispatched, it returns a clear refusal or next option rather than pretending cancellation succeeded. We also need retry-safe operations. If a network response is lost, repeating purchase creation with the same operation key should not buy a second backpack. A protocol request identifier alone is not a business idempotency guarantee. Cancellation status and payment reversal status must remain separate. These rules belong in the store backend regardless of how an AI calls it.

## Slide 11. Tomorrow Maya asks: “Where is my parcel now?”

Source: first-principles-experiment / slide 11.

Now we extend our browser chatbot. Maya has bought the backpack and asks where the parcel is. We propose adding a carrier-tracking function named track_shipment; this is a future capability for the story, not one of the installed local demo’s five tools. We implement the carrier integration and describe the function, its order ID input and tracking result. In the initial OpenAI integration, we add that definition to the tools our backend sends and register its executor. If the backend also supports Claude, we update that provider’s tool definition or the common registry that produces it. We refresh the host-visible catalog and test that the model selects tracking. MCP later gives us a reusable server catalog and invocation interface, while our backend still adapts it to the chosen model API and enforces ownership.

## Slide 12. Now switch our chatbot from OpenAI’s API to Claude’s.

Source: first-principles-experiment / slide 12.

Now keep the same browser chatbot, Maya and store APIs, but switch our backend from OpenAI’s Responses API to Claude’s Messages API. These snippets are valid Python API-call shapes with configured client objects, model names, schema and conversation variables omitted. OpenAI’s function tool uses parameters for the argument schema. Claude’s tool uses input_schema. The same domain JSON Schema can be supplied to both here. The surrounding request and conversation formats differ too. Our backend parses OpenAI function_call objects and sends function_call_output items; with Claude it handles tool_use blocks and replies with tool_result blocks linked to the tool-use ID. Merely changing a model name does not perform that provider migration. We can centralize these mappings in an adapter, but must implement or adopt that abstraction and test it. MCP reuses the store-facing server contract; it does not turn these two model APIs into the same API. Switching models within one provider may require only configuration and behavior testing rather than this integration rewrite.

## Slide 13. These are the three things we want to make reusable.

Source: first-principles-experiment / slide 13.

These are the three pressures in our own chatbot. We need to describe the store’s capabilities to the model. We need to add functionality without letting definitions and executors drift. And we want to switch the backend’s model provider without rewriting the store’s integration logic each time. MCP can give the store a standard capability catalog and invocation interface that our backend reaches through an MCP client. Our provider adapter then translates those definitions and results into the OpenAI or Claude API format. We can already build a common tool registry without MCP, so MCP is not logically required for one chatbot. Its value is a common server contract that other compatible hosts can also reuse. The store APIs, authorization and business rules remain independent of our chosen model provider.

## Slide 14. Let the server describe its current capabilities.

Source: first-principles-experiment / slide 14.

The first agreement is discovery. A connected MCP client can ask the server for its available tools using tools slash list. Each tool provides a name, description and input schema, so the application has a defined way to obtain the menu. The host chooses which tools to make available to the model and may transform their definitions into the model provider’s format. The server must still filter or authorize capabilities appropriately, and a listed tool does not grant permission to use it. Discovery is a protocol operation, not the model guessing API URLs and not a marketplace search. Connection and capability details depend on the protocol version and host. We are focusing on the common discovery and execution concepts rather than implementing a wire protocol by hand. This also connects to the extension problem: once a new capability is implemented and described on the server, a host that refreshes its catalog can discover it. The host may cache definitions, filter tools or require a reconnect; discovery is not a promise of instant automatic availability in every model conversation. The descriptions and schemas still need careful design and testing.

## Slide 15. Call a function through the shared interface.

Source: first-principles-experiment / slide 15.

The next agreement is invocation. The host’s MCP client sends a tools slash call request with the tool name and arguments. This is an illustrative fragment, not a complete JSON-RPC message or SDK example. Our server receives quote delivery, validates the request and calls the same catalog, routing and delivery APIs we already had. It then returns an MCP result containing the relevant quote information. A common envelope makes transport and parsing more reusable, but the store defines the actual quote fields and business errors. Request IDs associate protocol messages; our checkout idempotency key solves a different business problem. Notice that the model still proposes operations through its host. It is not directly opening a network connection to the MCP server.

## Slide 16. Our chatbot keeps one store-facing interface.

Source: first-principles-experiment / slide 16.

Here is the boundary we extracted. Maya’s browser still talks to our backend. That backend is the MCP host: it contains the model-provider adapter and an MCP client. The provider adapter calls OpenAI or Claude, presents tool definitions and interprets the provider’s tool requests and results. The MCP client discovers and invokes the store’s capabilities through the shared protocol. Our store MCP server coordinates the existing catalog, address, delivery and order services. Switching model providers still involves model API adaptation and evaluation, but the store’s MCP tools and execution contract can stay the same. A framework or provider-managed MCP connector may implement parts of this orchestration; this diagram shows the responsibilities, not one mandatory SDK arrangement. There is no direct model connection from Maya’s browser and no central MCP cloud hub.

## Slide 17. The same agreement can carry context and starting points.

Source: first-principles-experiment / slide 17.

Our derivation began with callable functions because Maya wanted something done. MCP also lets a server expose resources and prompts. A resource is readable context, such as the return policy or size guide, which the application can load for the model. A prompt is a reusable message template the user can choose, such as help me choose a backpack. Tools perform requested functions, including read-only searches and state-changing actions. These are complementary capabilities; this picture is not a mandatory pipeline. A server can expose just tools, and host support for resources and prompts differs. We should verify the target host before relying on them. The host controls how context reaches its model and how the user experiences these capabilities.

## Slide 18. A lot of JSON. Only a few useful facts.

Source: first-principles-experiment / slide 18.

This is another practical reason to build an adapter around our service functionality. A provider may return a large JSON payload with the facts we need mixed among route metadata, service flags, cache information and diagnostics. On the left is an illustrative full response; it can be scrolled. I highlight the quote identifier, amounts, currency, arrival estimate and validity. Our MCP server’s code selects those facts, adds the item and shipping amounts, and returns the smaller result on the right. The total remains ninety-one dollars, or nine thousand one hundred cents. It keeps the quote ID so the next purchase request can refer to the actual quote, the currency so the amount is unambiguous, the expiry, and the fact that Friday is only an estimate. This does not happen automatically because a response passes through MCP. We implement the transformation; MCP carries the tool result in a standard form. We should preserve meaningful errors and any details required for Maya’s decision or the next action. The backend can retain diagnostics for investigation without sending every internal field into the model’s context.

## Slide 19. Discover the store’s tools. Then make a specific request.

Source: final-version-1 / slide 17.

We have arrived at a common interface: descriptions, discovery, calls and useful results. Now I want to use it for Maya’s complete shopping journey. My application first asks the store’s MCP server what it can do. The menu includes finding products, quoting delivery, placing an order and cancelling an order. Each tool has a name, a purpose and defined inputs. That helps the host present the right capabilities to the model. I keep the read operations separate from the actions that change an order or a payment. Discovering a purchase tool doesn’t authorize a purchase, and seeing a cancel tool doesn’t let me cancel somebody else’s order. The server still enforces those boundaries. I’m exposing clear store operations, not a universal tool that lets the model make arbitrary requests against every backend API.

## Slide 20. The store exposes the tools. The host coordinates the requests.

Source: final-version-1 / slide 7.

This is the ownership picture for our browser chatbot. Its backend is the host. A model API adapter calls OpenAI or Claude and handles that provider’s tool-call format, while the MCP client connects to our store’s server. The model itself runs at the provider, not inside the browser or the backend box; the box represents our integration code. The store server validates the operation, enforces policy and talks to catalog, routing, delivery and order services. One customer-facing tool may coordinate several underlying API calls. We can keep this store interface when the backend changes model providers, and other compatible applications can use it too. It does not replace our business logic.

## Slide 21. Find the item. Resolve the address. Quote delivery.

Source: final-version-1 / slide 8.

Let’s run Maya’s question. Our catalog returns a suitable blue carry-on for 79 dollars. With her authorized destination, GeoRoute resolves the address and gives us a 12-kilometre route from the warehouse. Then ParcelQuote uses the route and parcel details to return a 12-dollar delivery quote with a Friday estimate. That gives us a 91-dollar total in this fixture, including tax and delivery. These are dependent steps: I don’t get a valid delivery quote just by knowing the product name. The application or server coordinates them. Now I can show Maya the item, total and estimate, and explain what the result is based on. Nothing has been ordered yet.

## Slide 22. “I’ll take it.” Review, confirm, place the order.

Source: final-version-1 / slide 9.

Maya follows up: I’ll take it. Now we’re moving from getting information to changing something. I show her the exact product, the current total and the delivery destination, and obtain the required confirmation. The store rechecks price, stock, identity and the checkout conditions when it executes the order. Payment details belong in the appropriate secure checkout flow, not in a model prompt. Once the backend confirms the outcome, we return order 12345. If the connection drops, I need a way to recover that outcome without blindly creating a second order or charge. That reliability is our implementation responsibility. MCP carries the request; it doesn’t make a purchase automatically safe.

## Slide 23. “Actually, cancel my order.” Check the state before acting.

Source: final-version-1 / slide 10.

Then Maya changes her mind: actually, cancel my order. The host can use the conversation to identify order 12345, but the server still verifies that it belongs to her and checks its fulfilment state. In our example it hasn’t been dispatched, so the backend accepts the cancellation and we report the confirmed result. If it has already shipped, we explain the permitted next step instead of pretending cancellation succeeded. Any payment reversal or refund has its own status; I don’t promise it completed just because the order was cancelled. We’ve now exposed a useful store journey through MCP. The next question is where shoppers should be able to use it.

## Slide 24. Your store’s assistant works. Let customers find it.

Source: final-version-1 / slide 11.

So far Maya has been using our own browser chatbot, whose backend calls OpenAI or Claude through an API. Now we introduce a separate distribution question: what if a shopper wants to use the store from the ChatGPT or Claude consumer applications instead? Publishing can help people discover and connect the store’s MCP capabilities in those products, subject to their supported features and policies. That is a new host and onboarding path, not the earlier model-provider switch. I still need a stable HTTPS service, appropriate account access, accurate tool descriptions, privacy/support information and reviewer cases. The directory does not host our backend or automatically transfer permissions. We test each host and follow its submission and review process.

## Slide 25. ChatGPT: package, prove, then publish.

Source: final-version-1 / slide 12.

For ChatGPT, I upload our plugin ZIP through the Plugins portal and connect the hosted store server. I complete domain, sign-in and scan checks. Then I make the experience easy to reproduce: five positive cases, three negative cases, a working reviewer account and a video. I rehearse the exact account before submitting, and enter private credentials in the portal, never the ZIP. For Maya, that includes a quote, an authorized action and safe refusals. I fix the findings and submit. After approval, I select Publish and verify the live connection. The links below open the official portal, guide and checklist.

Portal: https://platform.openai.com/plugins
Guide: https://developers.openai.com/plugins/deploy/submission
Review checklist: https://developers.openai.com/plugins/deploy/app-review

## Slide 26. Claude: choose the route that matches what you ship.

Source: final-version-1 / slide 13.

For our hosted store, I choose MCP connector in Claude’s directory portal. I supply HTTPS, working authentication, listing details and reviewer access. The current default is automated policy screening followed by a Community listing; some submissions need a person to review them. Verified is a separate route selected by Anthropic, and per-customer server URLs require it before listing.

If I also ship skills and workflow instructions, I submit a plugin from GitHub. That bundle is scanned, can be held for review, and has a publishing gate. The portal tells me whether I, a reviewer or the directory publishes it. A remote server referenced by the plugin still needs a connector submission. I check for Published rather than assuming a passing scan means it is live.

Portal: https://claude.ai/directory/manage
Connector guide: https://claude.com/docs/connectors/building/submission
Plugin guide: https://claude.com/docs/plugins/submit
Status meanings: https://claude.com/docs/directory/submission-status

## Slide 27. What goes in the package?

Source: final-version-1 / slide 18.

Here’s the concrete folder behind the word plugin. The portable starting point has a manifest, an MCP connection file, optional skills, assets and documentation. I’ve built sample ZIPs for the same store and included native layouts for ChatGPT, Claude, Cursor and Factory. They’re labeled examples because the endpoint and listing URLs are fictional. For a real release I replace those values, implement production authorization, test the actual host and complete review. Claude and Cursor take repository submissions; Muse has its own connector intake. The same ZIP isn’t a universal submission. I also linked Anthropic’s real productivity plugin as a working reference. Keep credentials, databases and local dependencies out of the archive.

I can open the sample package directly from this slide. The showcase compares ChatGPT’s plugin ZIP with Claude’s GitHub plugin folder and its separate connector worksheet. I can show the native manifests, connection configuration and the identical shopping skill, then walk through five successful fixture cases and three denials. The downloadable presenter kit includes the differences, a short speaking script and the exact values and external steps to replace before submission.

Showcase: https://eff-kay.github.io/talks/mcp/submission-showcase/

## Slide 28. One store. A wider ecosystem.

Source: final-version-1 / slide 19.

These are places I’d investigate for distributing or connecting the same store, not eighteen identical marketplaces. ChatGPT, Claude, Muse, Cursor and Hermes have documented public review routes. Factory supports Git plugin marketplaces, with official curation separate. The MCP Registry, Smithery, Glama, Docker and Cline provide other discovery paths. Gemini, VS Code, Zed and Continue have their own extension or MCP configuration ecosystems. I’ve included Instinct because it is relevant to this conversation, but I haven’t verified a public MCP submission route at instinct.com. I check each route before promising availability. The companion table records the format and link for every logo; this isn’t a complete census or a claim that all accept ZIPs.

## Slide 29. A working server is useful. Make it easy to discover.

Source: final-version-1 / slide 14.

Let me close with why I’d submit at all. MCP compatibility lets an application connect, but it doesn’t make our store discoverable. A directory listing gives customers another way to find us where they already ask for help. The connection flow then needs to make account access and our capabilities understandable. Finally, the workflow has to deliver what the listing promises: find the item, complete a permitted order, or cancel an eligible one. I can still use private connections without a public listing. Publication is a distribution choice, not a requirement of the protocol, and it doesn’t guarantee traffic or certify the whole service. The point is to turn a useful connection into an experience new customers can actually adopt.

## Slide 30. Three things that block a good submission.

Source: final-version-1 / slide 15.

I reduce the gotchas to three questions. Can the reviewer connect and sign in? Do the tools deliver the outcome I promised? Is that experience permitted on this platform? These are a practical grouping, not a ranked rejection statistic.

For access, I try the endpoint and populated test account outside our network. For behavior, I replay the success and refusal cases; a quote must not place an order, and a cancellation must enforce ownership and state. Claude specifically requires separate read and write tools, accurate titles and hints, and descriptions without unrelated behavioral instructions. For scope, I check privacy, API rights and commerce rules. The fictional purchase demo is a protocol example, not a promise that every marketplace accepts its checkout flow. I follow the actual finding: setup errors, scan findings and a reviewer’s rejection are different stages.

ChatGPT: https://developers.openai.com/plugins/deploy/app-review
Claude: https://claude.com/docs/connectors/building/review-criteria
Policy: https://developers.openai.com/plugins/plugin-guidelines

## Slide 31. Leave room for review.

Source: final-version-1 / slide 16.

I would not promise a launch date based on approval. Neither platform publishes a fixed review deadline. For ChatGPT, I would reserve two to six weeks or more in our schedule. That is my planning buffer, not an OpenAI estimate or a measured average. Small public reports include two-to-three-week approvals and waits exceeding five weeks, so there is a long tail.

Claude has two different paths. A standard remote connector is automatically screened for a Community listing by default, so I would not assign it the same manual-review estimate. There is no published completion time; a human hold or the Verified requirement can add weeks. For a plugin bundle needing review, I would allow several weeks as a scheduling buffer, not an Anthropic target. Elastic reported three weeks from first commit to live, which includes building and must not be called three weeks of approval.

I leave time for fixes and another pass, keep the review account working, and check who acts next in the portal. Approved and Published are different states. After launch, I monitor sign-in, tool failures and safe order outcomes. The companion records the dated sources and assumptions.

Official timing: https://developers.openai.com/plugins/deploy/app-review
Claude status: https://claude.com/docs/directory/submission-status

## Slide 32. What we haven’t covered.

Source: combined-preview / slide 32.

Before questions, I want to be clear about what I haven’t covered. I showed how to expose the store’s capabilities, connect them to an AI application and approach distribution. We touched identity and confirmation, but we haven’t built a production authentication and authorization system.

For a real Maya, I would need to work through sign-in, OAuth, token expiry and refresh, revocation, scopes and tenant isolation. Authenticating Maya and deciding whether she can cancel this particular order are separate checks. Tool permission hints don’t replace those checks in our backend. Our local teaching demo uses a fictional customer; it does not demonstrate a production identity system.

The second topic is observability. If Maya’s order fails, I want to follow that request from the chatbot backend through the MCP server to the routing, delivery or order service. I would add correlated traces, operation timings, useful errors and an audit trail for changes. I would also monitor failures, usage and cost, while keeping credentials and unnecessary personal data out of telemetry. A trace helps explain execution; an audit record helps establish who changed what.

These are two follow-up deep dives. A working protocol connection and a directory listing are the starting point for operating the service.

Presenter references:
https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization
https://opentelemetry.io/docs/concepts/signals/traces/

## Slide 33. What should your store let an assistant do?

Source: final-version-1 / slide 20.

I’m happy to take questions. If you have an example, let’s start with the customer’s request, the services needed to fulfil it, and the actions the store is willing to expose. We can trace it through the same picture: host, store MCP server and underlying systems. We can also talk about hosting, permissions or the publication paths. 