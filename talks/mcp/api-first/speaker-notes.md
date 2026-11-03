# API-first experiment — first-person notes

20 slides: introduction, 18 walkthrough slides and Q&A. Three six-slide acts; this experiment does not claim a 15-minute runtime. All transactions are fictional.

## Slide 1. Faizan Khan

I’m Faizan. At Docsalot we create and host MCP servers, including read-only access to more than 300 documentation sites. For this experiment I want to put the protocol name aside and build the need for it. We’ll start with ordinary HTTP APIs, make one assistant useful, and then ask what happens when another AI application wants the same capabilities. This is an architecture walkthrough with fictional products and transactions, not a live checkout or a claim that we have implemented every diagram. Our question is simple: which parts belong to the store, which belong to the AI application, and which parts would benefit from a shared agreement?

## Slide 2. Maya wants her AI to do the shopping.

Maya asks her AI: find me a blue carry-on backpack under a hundred dollars, delivered by Friday. She is not opening our storefront and clicking through product pages. Her assistant needs to discover a real item, get a delivery quote, explain the total and ask before committing the purchase. Our store still owns its inventory and orders. The address and delivery providers know other parts of the answer. Let’s assume MCP does not exist and start with the simplest useful thing: expose the services as ordinary APIs. We will keep Maya’s identity, the quoted price and the eventual order consistent as the design grows.

## Slide 3. Expose four services. There is no storefront to click.

We begin with a headless store: no shopping dashboard is available to the assistant. The catalog API finds products. GeoRoute resolves an authorized destination and calculates the warehouse distance. ParcelQuote estimates delivery from route and parcel information. The orders API creates or cancels an order. These are invented endpoint names for our example, not a proposed industry API specification. A service has multiple operations, so four services does not mean only four endpoints. The store owns catalog and orders; the other two are independent providers. Exposing an API is already a useful design. The next challenge is making those capabilities usable from Maya’s AI application.

## Slide 4. With a fixed application, we can write the flow ourselves.

If I were building a conventional application, I would write this sequence myself. Search the catalog, resolve the destination, ask the delivery provider for a quote and prepare an order draft. Our fictional item costs seventy-nine dollars, the route is twelve kilometres and shipping is twelve dollars with an estimated Friday arrival. The fixture total is ninety-one dollars, including tax and shipping. Nothing here requires MCP. Shared libraries, good API documentation and an OpenAPI description can already reduce the work. What changes in our story is that Maya is speaking freely to an AI, rather than following a fixed interface that I designed in advance. Now somebody has to connect that conversation to the right operations.

## Slide 5. Who turns Maya’s sentence into the right API request?

Maya might ask for a backpack, change the destination or cancel an order in the next message. The model needs a menu of things it is allowed to request and enough detail to choose among them. It also needs results that make the next decision possible. Giving it an API hostname is not the same as connecting an executable capability. The application must supply descriptions, schemas, credentials and execution machinery. Some of this is ordinary integration engineering; what makes this boundary particular to an LLM application is that the model chooses its next request from the conversation. We can build that boundary ourselves, and we are going to do exactly that.

## Slide 6. First, teach ChatGPT what the store can do.

For the ChatGPT version, an API-only route is a Custom GPT action described with OpenAPI and configured authentication. We describe our store-facing gateway operation: search products, what it means, which arguments it accepts and what it returns. The diagram is a shortened description, not a complete uploadable schema. ChatGPT can then map Maya’s request to the described action. A custom GPT-backed application using the OpenAI API would instead supply function definitions and its own execution loop; that is a different host implementation, not the ChatGPT product itself. Both illustrate the same boundary: describe a callable operation and arrange for something to execute it. Actual host eligibility and commerce policies must be checked before a real launch.

## Slide 7. The model proposes. Our adapter does the work.

Now we have a real call path. The model proposes search products with a query and color. The ChatGPT host sends the described action request. Our store adapter validates the inputs, calls the catalog API and returns a result. The model can use that result to answer Maya or request the next operation. This is what developers mean by a tool: a named, callable function with a purpose and defined inputs. It can read information, so a search counts as a tool. It can also change state, as placing an order does. The model is not running our backend code and is not holding our provider credentials. In a custom API host, our own application would implement the surrounding model-call loop.

## Slide 8. Maya’s identity cannot be a prompt parameter.

Before quoting a saved address or reading an order, I need to know whose data this is. Maya signs in and grants the intended access. The adapter derives her customer identity from verified credentials rather than trusting a customer identifier generated by the model. It checks whether the token permits the operation. Our server keeps its GeoRoute and ParcelQuote credentials on the trusted side and sends only the data those providers need. This is not a new problem invented by AI, and MCP will not make it disappear. But an assistant taking action on someone’s behalf makes the trust boundary especially important. A tool definition is a description of a capability; it is never proof that Maya authorized the action.

## Slide 9. A quote is information. A purchase is a commitment.

We found a product and shipping estimate. That does not authorize a purchase. I present the ninety-one-dollar quote with the item, destination and validity period. Maya explicitly confirms that specific checkout. The adapter verifies that the quote still exists, has not expired, belongs to Maya and matches what she confirmed. Only then does it request order creation. In this example, confirmation is a trusted host interaction linked to the quote; a model-generated confirmed equals true flag would not prove consent. We are illustrating order creation, not processing real payments. The exact checkout and consent experience depends on the host and its policies. The important design step is to separate reading a quote from committing an order.

## Slide 10. Then Maya says: “Actually, cancel it.”

Maya’s follow-up gives us two more requirements. The host needs to resolve it to the right order using the conversation and verified customer context. The server then checks ownership and the current fulfilment state. Our fictional policy permits cancellation before dispatch. Once dispatched, it returns a clear refusal or next option rather than pretending cancellation succeeded. We also need retry-safe operations. If a network response is lost, repeating purchase creation with the same operation key should not buy a second backpack. A protocol request identifier alone is not a business idempotency guarantee. Cancellation status and payment reversal status must remain separate. These rules belong in the store backend regardless of how an AI calls it.

## Slide 11. Give the model a result it can use.

An API may return a perfectly valid payload that is awkward to use in a conversation. We map provider-specific fields into the facts Maya needs: the quote identifier, currency, total, estimated arrival and expiry. We preserve the details required for the next operation rather than returning a vague success message. Failures also need meaning: quote expired, unknown address and order already dispatched should not all become something went wrong. The protocol can define a response envelope, but it cannot infer our business semantics or automatically remove irrelevant fields. We write that translation in the adapter. Treat external text as data, not as instructions that can change the assistant’s permissions or purchase rules.

## Slide 12. Our ChatGPT integration works. Now add two more AI apps.

At this point we have made the API-only version work. Now a Claude-based application and a Gemini-based application want the same store operations. Each host has its own way of exposing functions, managing context and handling results or approvals. Without a shared AI-facing contract, we write or configure mappings again. The twelve paths are a simplified view of three applications reaching four services; shared gateways, OpenAPI and libraries can reduce duplication, so this is not a claim that twelve independent codebases are unavoidable. It is also a product of two counts, not exponential growth. The maintenance question is still real: how many host-specific places must change when we rename an operation, add an input or expose another capability?

## Slide 13. Extract what every AI application keeps rebuilding.

Here is the first-principles move. We do not standardize how every shop stores inventory or how every courier prices a parcel. We standardize the things an AI application needs at the boundary. How does it find available capabilities? How does it learn their inputs? How does it invoke one and understand the result? We can give those questions a shared answer while keeping the underlying APIs. Good API schemas and reusable integration libraries remain useful; our goal is to reuse the AI-facing contract across compatible hosts. Agreeing that we need a protocol does not derive every detail of MCP mathematically. It explains why a protocol of this kind is useful. Now we can compare our requirements with the existing standard.

## Slide 14. First agreement: ask for the capability menu.

The first agreement is discovery. A connected MCP client can ask the server for its available tools using tools slash list. Each tool provides a name, description and input schema, so the application has a defined way to obtain the menu. The host chooses which tools to make available to the model and may transform their definitions into the model provider’s format. The server must still filter or authorize capabilities appropriately, and a listed tool does not grant permission to use it. Discovery is a protocol operation, not the model guessing API URLs and not a marketplace search. Connection and capability details depend on the protocol version and host. We are focusing on the common discovery and execution concepts rather than implementing a wire protocol by hand.

## Slide 15. Second agreement: one way to request a function.

The next agreement is invocation. The host’s MCP client sends a tools slash call request with the tool name and arguments. This is an illustrative fragment, not a complete JSON-RPC message or SDK example. Our server receives quote delivery, validates the request and calls the same catalog, routing and delivery APIs we already had. It then returns an MCP result containing the relevant quote information. A common envelope makes transport and parsing more reusable, but the store defines the actual quote fields and business errors. Request IDs associate protocol messages; our checkout idempotency key solves a different business problem. Notice that the model still proposes operations through its host. It is not directly opening a network connection to the MCP server.

## Slide 16. That reusable boundary is the MCP server.

Now the label has a reason to exist. The store MCP server publishes a shared AI-facing interface over the capabilities we already built. A host is the AI application Maya uses. Its MCP client communicates with our server. Our server executes the store operation through existing adapters and APIs. ChatGPT and the other applications still have their own product behavior, permissions and supported features. The diagram assumes each host has an appropriate MCP connection configured; deployment and listing are separate tasks. In this example the store aggregates its four services behind one server. Another design could expose multiple servers. There is no universal MCP hub in the middle and no requirement that the model itself understand or speak the wire protocol.

## Slide 17. The same agreement can carry context and starting points.

Our derivation began with callable functions because Maya wanted something done. MCP also lets a server expose resources and prompts. A resource is readable context, such as the return policy or size guide, which the application can load for the model. A prompt is a reusable message template the user can choose, such as help me choose a backpack. Tools perform requested functions, including read-only searches and state-changing actions. These are complementary capabilities; this picture is not a mandatory pipeline. A server can expose just tools, and host support for resources and prompts differs. We should verify the target host before relying on them. The host controls how context reaches its model and how the user experiences these capabilities.

## Slide 18. Replay Maya’s purchase. Only the connection has changed.

Let’s replay the whole story through the common interface. The host learns the tool menu. It requests a product and delivery quote. Maya sees ninety-one dollars with an estimated Friday delivery and confirms that quote. The store creates order twelve-three-four-five after verifying identity, validity and consent. When she asks to cancel, the host identifies that order and the server checks that it belongs to her and has not dispatched. These are the same business operations we built in the API-only version. What changed is the reusable client-server interface for exposing and invoking them. The assistant still needs conversation context, and the backend still needs durable state and audit records. MCP itself is not the memory of Maya’s order.

## Slide 19. We did not replace the APIs. We extracted a shared interface.

The APIs were never the mistake. They are how the store exposes its operations. We first made those operations usable by one AI application, and that required descriptions, execution, result mapping and access control. Repeating the work across hosts gave us a reason for a shared protocol. MCP standardizes a useful part of that boundary. It does not automatically make checkout safe, provider schemas consistent or every host feature identical. We still own consent, authorization, idempotency, business semantics and operations. We should measure tool latency, validation failures, provider errors and resulting order states while avoiding sensitive data in logs. For a single tightly controlled application, direct functions or an OpenAPI action may be enough. The case for MCP grows when reusable integration across compatible hosts matters.

## Slide 20. Could you build the bridge now?

My question for the room is: if we removed the protocol label again, could you explain what the bridge must do? You need a way to describe capabilities, a way to request one, and a way to return useful results. You also need a trusted application and backend to enforce the things that matter to the customer. That is the intuition I want you to leave with. This experiment explores the architecture; it does not hand-roll a complete MCP implementation. For runnable code, use the existing Python workshop and a maintained SDK that implements the protocol details. The saved final-version-1 deck keeps the publication and marketplace section if we decide to combine the two teaching approaches later.