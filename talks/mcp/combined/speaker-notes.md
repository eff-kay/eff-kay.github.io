# From APIs to MCP to distribution — combined preview

32 slides: presenter introduction, 30 content slides and Q&A. Expanded review draft; no timing target is asserted.

## Slide 1. Faizan Khan

Source: first-principles-experiment / slide 1.

I’m Faizan. At Docsalot we create and host MCP servers, including read-only access to more than 300 documentation sites. I want to start with an ordinary API integration and derive the need for MCP from Maya’s shopping request. Then we will use the protocol to search, buy and cancel, and follow the store into distribution and review in AI applications. The store, providers and transactions are fictional. This expanded preview combines the first-principles opening with the practical publication material, so we can judge how the full story flows before deciding what to trim.

## Slide 2. Maya wants her AI to do the shopping.

Source: first-principles-experiment / slide 2.

Maya asks her AI: find me a blue carry-on backpack under a hundred dollars, delivered by Friday. She is not opening our storefront and clicking through product pages. Her assistant needs to discover a real item, get a delivery quote, explain the total and ask before committing the purchase. Our store still owns its inventory and orders. The address and delivery providers know other parts of the answer. Let’s assume MCP does not exist and start with the simplest useful thing: expose the services as ordinary APIs. We will keep Maya’s identity, the quoted price and the eventual order consistent as the design grows.

## Slide 3. Each service knows one part of Maya’s request.

Source: first-principles-experiment / slide 3.

Our first challenge is explaining functionality. The catalog finds backpacks, GeoRoute resolves the saved destination, ParcelQuote estimates shipping and arrival, and our order service places or cancels purchases. Maya’s AI needs to understand those jobs before it can choose the right operation. An endpoint address alone does not communicate when to use it, which inputs it needs or what its answer means. We still expose ordinary HTTP APIs, and OpenAPI descriptions can already capture much of this information. But we must deliberately write clear descriptions and make them available through the host’s integration. The service names, purpose, inputs and useful results form the capability menu the model reasons over. The store is headless in this example: the assistant is choosing functions instead of clicking through a storefront.

## Slide 4. With a fixed application, we can write the flow ourselves.

Source: first-principles-experiment / slide 4.

If I were building a conventional application, I would write this sequence myself. Search the catalog, resolve the destination, ask the delivery provider for a quote and prepare an order draft. Our fictional item costs seventy-nine dollars, the route is twelve kilometres and shipping is twelve dollars with an estimated Friday arrival. The fixture total is ninety-one dollars, including tax and shipping. Nothing here requires MCP. Shared libraries, good API documentation and an OpenAPI description can already reduce the work. What changes in our story is that Maya is speaking freely to an AI, rather than following a fixed interface that I designed in advance. Now somebody has to connect that conversation to the right operations.

## Slide 5. Turn Maya’s request into a real API call.

Source: first-principles-experiment / slide 5.

Maya asks what delivery will cost. On the left is a normalized function-call fragment: the model proposes quote delivery with a real product identifier and her saved demo-home destination. That describes an operation; it does not execute the API. On the right is Python taken from our combined local store example. Our adapter sends an HTTP request to the GeoRoute fixture, checks the response and reads the route result. It then passes that distance to ParcelQuote and returns a complete delivery quote. We show only the first provider call here so the code stays readable. The HTTP client is created in the surrounding function. A real ChatGPT action uses its configured OpenAPI schema and authentication; this small JSON fragment illustrates the requested function and arguments rather than the host-specific wire format. This is the integration boundary we need to build: connect the model’s choice to validated code that can actually call the service. The execution code is only half the integration. Before this call can be proposed, the host must give the model a useful description of quote_delivery, including when to choose it instead of product search or order placement. That capability description is the main problem we are about to solve.

## Slide 6. Teach the AI what each function is for.

Source: first-principles-experiment / slide 6.

This is the key integration problem: conveying the store’s functionality to the model so it can choose an appropriate call. A function needs more than a clever name. I describe its job, the inputs it accepts and the result it gives back. The model should use product search to find an item, quote delivery to estimate a total and arrival, and place order only after the confirmed checkout. The JSON here is a normalized explanatory function card, not a complete OpenAPI or MCP schema. For our API-only ChatGPT route, we put the operation descriptions, parameter schemas and responses into the Custom GPT action’s OpenAPI definition and configure authentication. In a custom host, we provide the model’s supported function-definition format. Both approaches work without MCP. We still need to test ambiguous questions, missing inputs and cases where the model should ask a question rather than call a function.

## Slide 7. The model proposes. Our adapter does the work.

Source: first-principles-experiment / slide 7.

Now we have a real call path. The model proposes search products with a query and color. The ChatGPT host sends the described action request. Our store adapter validates the inputs, calls the catalog API and returns a result. The model can use that result to answer Maya or request the next operation. This is what developers mean by a tool: a named, callable function with a purpose and defined inputs. It can read information, so a search counts as a tool. It can also change state, as placing an order does. The model is not running our backend code and is not holding our provider credentials. In a custom API host, our own application would implement the surrounding model-call loop.

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

Now we extend the product. Maya has bought the backpack and asks where the parcel is. We add a carrier-tracking capability called track shipment, which is a proposed extension for this teaching example, not one of the five tools already installed in our local demo. Implementing the carrier API is only half the job. We also describe when this capability should be used, what order identifier it accepts and what tracking facts it returns. In the API-only integration, we update the host’s action or function definitions and execution mapping. If several hosts have their own copies, those copies can drift. We must refresh the available definitions and test that the model chooses tracking rather than product search or order creation. The server still enforces ownership. With MCP later, the host can obtain an updated tool catalog from the server; refresh and caching behavior still depend on the host.

## Slide 12. What if Maya changes her model—or her AI app?

Source: first-principles-experiment / slide 12.

There are two different changes here. If I swap the model inside the same AI host, that host may keep the same function definitions and execution code. I should not claim that every new model requires rewriting our APIs or the whole integration. I do need to check supported schemas and evaluate tool selection, argument generation and whether it respects the confirmation flow. If Maya moves to a different provider or AI application, the function-definition format, execution integration and permission experience may also differ. The store’s underlying capabilities have not changed. We want a reusable server-side contract that compatible hosts can adapt to their own models. MCP helps at that client-server boundary; it does not force all models to choose the same tool or eliminate host-specific work. That distinction is why I separate changing a model from changing the AI host.

## Slide 13. These are the three things we want to make reusable.

Source: first-principles-experiment / slide 13.

Here are the three problems our protocol should address. First, communicate what the services can do so the model has a useful menu. Second, make new capabilities available without manually maintaining a disconnected copy for every integration. Third, expose a reusable server interface that different AI hosts can connect to. Names, descriptions and schemas address the first requirement. A discoverable, updated capability catalog addresses the second. A shared client-server contract addresses the third. OpenAPI, shared gateways and libraries can already solve parts of this, so MCP is not the only possible answer. Its value is an existing common contract that compatible hosts implement. The host still maps these definitions into its model’s supported format, manages context and evaluates the resulting choices. The store keeps its authorization and business logic.

## Slide 14. Let the server describe its current capabilities.

Source: first-principles-experiment / slide 14.

The first agreement is discovery. A connected MCP client can ask the server for its available tools using tools slash list. Each tool provides a name, description and input schema, so the application has a defined way to obtain the menu. The host chooses which tools to make available to the model and may transform their definitions into the model provider’s format. The server must still filter or authorize capabilities appropriately, and a listed tool does not grant permission to use it. Discovery is a protocol operation, not the model guessing API URLs and not a marketplace search. Connection and capability details depend on the protocol version and host. We are focusing on the common discovery and execution concepts rather than implementing a wire protocol by hand. This also connects to the extension problem: once a new capability is implemented and described on the server, a host that refreshes its catalog can discover it. The host may cache definitions, filter tools or require a reconnect; discovery is not a promise of instant automatic availability in every model conversation. The descriptions and schemas still need careful design and testing.

## Slide 15. Call a function through the shared interface.

Source: first-principles-experiment / slide 15.

The next agreement is invocation. The host’s MCP client sends a tools slash call request with the tool name and arguments. This is an illustrative fragment, not a complete JSON-RPC message or SDK example. Our server receives quote delivery, validates the request and calls the same catalog, routing and delivery APIs we already had. It then returns an MCP result containing the relevant quote information. A common envelope makes transport and parsing more reusable, but the store defines the actual quote fields and business errors. Request IDs associate protocol messages; our checkout idempotency key solves a different business problem. Notice that the model still proposes operations through its host. It is not directly opening a network connection to the MCP server.

## Slide 16. That reusable boundary is the MCP server.

Source: first-principles-experiment / slide 16.

Now the label has a reason to exist. The store MCP server publishes a shared AI-facing interface over the capabilities we already built. A host is the AI application Maya uses. Its MCP client communicates with our server. Our server executes the store operation through existing adapters and APIs. ChatGPT and the other applications still have their own product behavior, permissions and supported features. The diagram assumes each host has an appropriate MCP connection configured; deployment and listing are separate tasks. In this example the store aggregates its four services behind one server. Another design could expose multiple servers. There is no universal MCP hub in the middle and no requirement that the model itself understand or speak the wire protocol. If we add shipment tracking, the store adds its implementation and description to this server. If Maya uses another compatible host, it can discover the same server capabilities. The host remains responsible for adapting tool definitions to its chosen model and testing its behavior.

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

Here’s the ownership picture. The host is the application Maya is using. Its model can propose a step, and its MCP client handles the connection to our store’s server. The server validates the request, enforces our policy and talks to the underlying services. On the right are our catalog and orders, plus the external address and delivery providers. The customer-facing tool can coordinate a workflow across them; it doesn’t have to expose every raw provider operation. We can reuse that interface in our own chatbot and in other supporting applications. The server is our ecommerce store’s integration surface. It’s not the model, and the protocol doesn’t replace our business logic.

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

The protocol and customer journey now work together. The next problem is getting that experience to customers. This works in our store’s chatbot. But a shopper may already be asking ChatGPT or Claude to help them find something. I don’t want to make them start the whole conversation again on our website. Publishing helps them discover and connect our store’s capabilities inside the applications they already use, including buying and cancelling when those actions are supported and permitted. That’s why distribution matters. The directory doesn’t host our backend or transfer permissions automatically. I still prepare a stable HTTPS service, account access, accurate tool descriptions, privacy and support information, and realistic reviewer cases. I test in each host. Then I follow that platform’s separate submission and review process.

## Slide 25. ChatGPT: submit the package. Prove the connected experience.

Source: final-version-1 / slide 12.

For ChatGPT, I use the Plugins portal with the correct organization permissions and verified publisher identity. I upload the package with our remote MCP configuration, connect the endpoint, verify the domain and complete authentication and scans. I include five positive cases, three negative cases and a walkthrough, with reviewer access when required. For this store, I’d demonstrate finding an item, placing one confirmed order, and cancelling an eligible order. I’d also test another customer’s order and an ineligible cancellation. I resolve findings, submit for review and publish after approval. Uploading is not approval, and checkout has separate rules: the usual route completes payment on our own domain; embedded checkout needs the permitted setup. Listing approval doesn’t itself enable Instant Checkout. We continue operating the service behind the listing.

## Slide 26. Claude: choose connector or plugin bundle.

Source: final-version-1 / slide 13.

For Claude, I can submit our remote server as an MCP connector through the directory portal. I test it in Claude and provide the endpoint, authentication, listing details and reviewer access. The tools need accurate titles and the appropriate read or write hints, especially for placing and cancelling orders. The current portal supports paid plans with relevant account permissions. If I also distribute reusable workflow instructions, I can submit a GitHub plugin bundle; our remote server still needs its connector submission. I address the findings and publish after approval. Approval doesn’t transfer from ChatGPT, and I don’t assume every host permits the same commerce experience. I verify the supported flow in each one.

## Slide 27. What goes in the package?

Source: final-version-1 / slide 18.

Here’s the concrete folder behind the word plugin. The portable starting point has a manifest, an MCP connection file, optional skills, assets and documentation. I’ve built sample ZIPs for the same store and included native layouts for ChatGPT, Claude, Cursor and Factory. They’re labeled examples because the endpoint and listing URLs are fictional. For a real release I replace those values, implement production authorization, test the actual host and complete review. Claude and Cursor take repository submissions; Muse has its own connector intake. The same ZIP isn’t a universal submission. I also linked Anthropic’s real productivity plugin as a working reference. Keep credentials, databases and local dependencies out of the archive.

## Slide 28. One store. A wider ecosystem.

Source: final-version-1 / slide 19.

These are places I’d investigate for distributing or connecting the same store, not eighteen identical marketplaces. ChatGPT, Claude, Muse, Cursor and Hermes have documented public review routes. Factory supports Git plugin marketplaces, with official curation separate. The MCP Registry, Smithery, Glama, Docker and Cline provide other discovery paths. Gemini, VS Code, Zed and Continue have their own extension or MCP configuration ecosystems. I’ve included Instinct because it is relevant to this conversation, but I haven’t verified a public MCP submission route at instinct.com. I check each route before promising availability. The companion table records the format and link for every logo; this isn’t a complete census or a claim that all accept ZIPs.

## Slide 29. A working server is useful. Make it easy to discover.

Source: final-version-1 / slide 14.

Let me close with why I’d submit at all. MCP compatibility lets an application connect, but it doesn’t make our store discoverable. A directory listing gives customers another way to find us where they already ask for help. The connection flow then needs to make account access and our capabilities understandable. Finally, the workflow has to deliver what the listing promises: find the item, complete a permitted order, or cancel an eligible one. I can still use private connections without a public listing. Publication is a distribution choice, not a requirement of the protocol, and it doesn’t guarantee traffic or certify the whole service. The point is to turn a useful connection into an experience new customers can actually adopt.

## Slide 30. What blocks submission or gets rejected in review.

Source: final-version-1 / slide 15.

The gotchas fall into six buckets. First, reviewers can’t connect or sign in: I verify the real endpoint and a populated test account. Second, the tools are misleading or incomplete: I separate read and write operations and supply accurate metadata. Third, privacy or API ownership is unclear. Fourth, the tool instructions or actions violate platform policy. Fifth, the listing and evidence don’t let someone reproduce the promised workflow. Sixth, I’ve used the wrong packaging, screenshot rules or checkout route for that host. Some of these block submission automatically; others lead to review rejection. Claude explicitly rejects mixed read/write catch-all tools and unrelated behavioral instructions. OpenAI checks its domain challenge, current scan and required tool annotations. I follow the reported finding, not a guessed workaround. Passing validation is not approval.

## Slide 31. Submit a complete experience. Keep the promise after launch.

Source: final-version-1 / slide 16.

My final takeaway is that I’m submitting an experience, not just an MCP endpoint. Before submission, I test the same account and customer journey the reviewer will use, including denied and failed requests. During review, I reproduce each finding, correct the right artifact and check it again: a package change and a hosted-tool change are not always the same release. After approval, I deliberately publish, verify the listing and connection flow, and keep the service healthy. I preserve compatible tools and safe purchase and cancellation outcomes. That brings our talk together: connect the store’s capabilities, make the shopping journey work, and publish it responsibly. The submission checklist is also a useful product-readiness checklist, whether or not I choose a public directory.

## Slide 32. What should your store let an assistant do?

Source: final-version-1 / slide 20.

I’m happy to take questions. If you have an example, let’s start with the customer’s request, the services needed to fulfil it, and the actions the store is willing to expose. We can trace it through the same picture: host, store MCP server and underlying systems. We can also talk about hosting, permissions or the publication paths. 