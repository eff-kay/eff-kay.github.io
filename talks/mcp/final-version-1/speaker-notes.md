# MCP from first principles — 15-minute speaking draft

20 slides: biography + 15 one-minute content slides + three supporting slides + Q&A. Notes are a pacing draft, not a guarantee of delivery speed.

## Slide 1. Faizan Khan

**Presenter / supporting notes.**

I’m Faizan, and at Docsalot we create and host MCP servers. We’ve built read-only access to more than 300 documentation sites. That’s the experience behind my interest in this topic. But today I want to start with something familiar: buying a backpack. I’ll use that one question to explain why MCP exists, how a request works, and how we can publish an integration in ChatGPT and Claude. The main walkthrough is fifteen minutes, and I have working Python examples we can explore afterward.

## Slide 2. Give your AI a way to reach the work.

**Minute 1 of 15.**

I want to start with a question someone might actually ask our ecommerce store: find me a blue carry-on backpack under a hundred dollars that arrives by Friday. A model can understand that sentence. But it doesn’t know our stock, where the shopper needs it delivered, or what shipping will cost. Those facts live in our catalog and connected services. So before I think about a protocol, I need a way to reach the systems that know the answer. We’ll use a fictional store and sample values, then follow Maya when she buys the backpack and later asks to cancel. Keep the product, the budget and the delivery deadline in mind.

## Slide 3. One store. Several connected services.

**Minute 2 of 15.**

This is our ecommerce store exposing its own capabilities. Our catalog knows the products and prices. An independent address service, GeoRoute, resolves the destination and calculates a route distance from our warehouse. ParcelQuote uses the relevant route and parcel information to estimate shipping. Our order system handles the purchase and cancellation. These services have different jobs, so I need to coordinate them to answer one shopper. I’m assuming Maya supplies a destination or authorizes use of her saved address. We’re using fictional providers here, not her real location. The distance alone doesn’t guarantee arrival; the delivery provider still needs to check its service and estimate.

## Slide 4. Three AI apps. Four services. Twelve custom connections.

**Minute 3 of 15.**

I now want to offer the same shopping journey in three places: ChatGPT, Claude and Gemini. Each application needs our catalog, address service, delivery quote and order system. Three times four gives me twelve custom integration paths. This is a simplified picture of the work, not a claim that every model requires twelve separate codebases: shared libraries can help. But somebody still has to adapt tool definitions, request formats, authentication and errors for each application. Add a fifth service or another application, and the maintenance keeps growing. That is the motivating problem. Wouldn’t it be useful if these applications and tools could agree on one way to describe capabilities, discover them and call them?

## Slide 5. One common language. Many applications. Many tools.

**Minute 4 of 15.**

That common language is the Model Context Protocol, or MCP. Instead of inventing a new AI-facing interface for every application and every service, I expose capabilities through MCP, and compatible applications know how to discover and call them. The center of this picture represents an agreement, not a central service that all data must pass through. In a real system, an application has an MCP client and connects to one or more MCP servers. A service can publish its own server, or our store can expose a server that coordinates its existing services. That is what our example does. MCP does not replace the catalog API, solve authorization automatically or remove the underlying adapters. It standardizes the connection at the AI boundary. Now let me show what the store actually exposes.

## Slide 6. MCP carries more than tools.

**Minute 5 of 15.**

Before I use the word tool again, let me unpack it. A tool is a function that the AI application can ask the server to run. It has a name, a description, defined inputs and a result. Search products is a tool even though it only reads information; place order is another tool that changes something. Calling a tool does not mean the model itself runs our backend code: the host sends the request and the server executes it under its authorization rules. MCP also lets a server offer resources: named, readable pieces of context, such as our return policy or backpack size guide. The application decides what to load into the conversation. And prompts are reusable message templates the user can select, such as help me choose a backpack. In this example Maya selects that starting request, the application loads the relevant guide, and the model proposes searching or quoting through tools. These are complementary capabilities, not a mandatory three-step pipeline. A server can offer just tools, and host support for resources and prompts varies. Purchasing still needs the host’s confirmation experience and server-side authorization. The detailed store tool menu is in the supporting slides.

## Slide 7. The store exposes the tools. The host coordinates the requests.

**Minute 6 of 15.**

Here’s the ownership picture. The host is the application Maya is using. Its model can propose a step, and its MCP client handles the connection to our store’s server. The server validates the request, enforces our policy and talks to the underlying services. On the right are our catalog and orders, plus the external address and delivery providers. The customer-facing tool can coordinate a workflow across them; it doesn’t have to expose every raw provider operation. We can reuse that interface in our own chatbot and in other supporting applications. The server is our ecommerce store’s integration surface. It’s not the model, and the protocol doesn’t replace our business logic.

## Slide 8. Find the item. Resolve the address. Quote delivery.

**Minute 7 of 15.**

Let’s run Maya’s question. Our catalog returns a suitable blue carry-on for 79 dollars. With her authorized destination, GeoRoute resolves the address and gives us a 12-kilometre route from the warehouse. Then ParcelQuote uses the route and parcel details to return a 12-dollar delivery quote with a Friday estimate. That gives us a 91-dollar total in this fixture, including tax and delivery. These are dependent steps: I don’t get a valid delivery quote just by knowing the product name. The application or server coordinates them. Now I can show Maya the item, total and estimate, and explain what the result is based on. Nothing has been ordered yet.

## Slide 9. “I’ll take it.” Review, confirm, place the order.

**Minute 8 of 15.**

Maya follows up: I’ll take it. Now we’re moving from getting information to changing something. I show her the exact product, the current total and the delivery destination, and obtain the required confirmation. The store rechecks price, stock, identity and the checkout conditions when it executes the order. Payment details belong in the appropriate secure checkout flow, not in a model prompt. Once the backend confirms the outcome, we return order 12345. If the connection drops, I need a way to recover that outcome without blindly creating a second order or charge. That reliability is our implementation responsibility. MCP carries the request; it doesn’t make a purchase automatically safe.

## Slide 10. “Actually, cancel my order.” Check the state before acting.

**Minute 9 of 15.**

Then Maya changes her mind: actually, cancel my order. The host can use the conversation to identify order 12345, but the server still verifies that it belongs to her and checks its fulfilment state. In our example it hasn’t been dispatched, so the backend accepts the cancellation and we report the confirmed result. If it has already shipped, we explain the permitted next step instead of pretending cancellation succeeded. Any payment reversal or refund has its own status; I don’t promise it completed just because the order was cancelled. We’ve now exposed a useful store journey through MCP. The next question is where shoppers should be able to use it.

## Slide 11. Your store’s assistant works. Let customers find it.

**Minute 10 of 15.**

This works in our store’s chatbot. But a shopper may already be asking ChatGPT or Claude to help them find something. I don’t want to make them start the whole conversation again on our website. Publishing helps them discover and connect our store’s capabilities inside the applications they already use, including buying and cancelling when those actions are supported and permitted. That’s why distribution matters. The directory doesn’t host our backend or transfer permissions automatically. I still prepare a stable HTTPS service, account access, accurate tool descriptions, privacy and support information, and realistic reviewer cases. I test in each host. Then I follow that platform’s separate submission and review process.

## Slide 12. ChatGPT: submit the package. Prove the connected experience.

**Minute 11 of 15.**

For ChatGPT, I use the Plugins portal with the correct organization permissions and verified publisher identity. I upload the package with our remote MCP configuration, connect the endpoint, verify the domain and complete authentication and scans. I include five positive cases, three negative cases and a walkthrough, with reviewer access when required. For this store, I’d demonstrate finding an item, placing one confirmed order, and cancelling an eligible order. I’d also test another customer’s order and an ineligible cancellation. I resolve findings, submit for review and publish after approval. Uploading is not approval, and checkout has separate rules: the usual route completes payment on our own domain; embedded checkout needs the permitted setup. Listing approval doesn’t itself enable Instant Checkout. We continue operating the service behind the listing.

## Slide 13. Claude: choose connector or plugin bundle.

**Minute 12 of 15.**

For Claude, I can submit our remote server as an MCP connector through the directory portal. I test it in Claude and provide the endpoint, authentication, listing details and reviewer access. The tools need accurate titles and the appropriate read or write hints, especially for placing and cancelling orders. The current portal supports paid plans with relevant account permissions. If I also distribute reusable workflow instructions, I can submit a GitHub plugin bundle; our remote server still needs its connector submission. I address the findings and publish after approval. Approval doesn’t transfer from ChatGPT, and I don’t assume every host permits the same commerce experience. I verify the supported flow in each one.

## Slide 14. A working server is useful. Make it easy to discover.

**Minute 13 of 15.**

Let me close with why I’d submit at all. MCP compatibility lets an application connect, but it doesn’t make our store discoverable. A directory listing gives customers another way to find us where they already ask for help. The connection flow then needs to make account access and our capabilities understandable. Finally, the workflow has to deliver what the listing promises: find the item, complete a permitted order, or cancel an eligible one. I can still use private connections without a public listing. Publication is a distribution choice, not a requirement of the protocol, and it doesn’t guarantee traffic or certify the whole service. The point is to turn a useful connection into an experience new customers can actually adopt.

## Slide 15. What blocks submission or gets rejected in review.

**Minute 14 of 15.**

The gotchas fall into six buckets. First, reviewers can’t connect or sign in: I verify the real endpoint and a populated test account. Second, the tools are misleading or incomplete: I separate read and write operations and supply accurate metadata. Third, privacy or API ownership is unclear. Fourth, the tool instructions or actions violate platform policy. Fifth, the listing and evidence don’t let someone reproduce the promised workflow. Sixth, I’ve used the wrong packaging, screenshot rules or checkout route for that host. Some of these block submission automatically; others lead to review rejection. Claude explicitly rejects mixed read/write catch-all tools and unrelated behavioral instructions. OpenAI checks its domain challenge, current scan and required tool annotations. I follow the reported finding, not a guessed workaround. Passing validation is not approval.

## Slide 16. Submit a complete experience. Keep the promise after launch.

**Minute 15 of 15.**

My final takeaway is that I’m submitting an experience, not just an MCP endpoint. Before submission, I test the same account and customer journey the reviewer will use, including denied and failed requests. During review, I reproduce each finding, correct the right artifact and check it again: a package change and a hosted-tool change are not always the same release. After approval, I deliberately publish, verify the listing and connection flow, and keep the service healthy. I preserve compatible tools and safe purchase and cancellation outcomes. That brings our talk together: connect the store’s capabilities, make the shopping journey work, and publish it responsibly. The submission checklist is also a useful product-readiness checklist, whether or not I choose a public directory.

## Slide 17. Discover the store’s tools. Then make a specific request.

**Presenter / supporting notes.**

My application first asks the store’s MCP server what it can do. The menu includes finding products, quoting delivery, placing an order and cancelling an order. Each tool has a name, a purpose and defined inputs. That helps the host present the right capabilities to the model. I keep the read operations separate from the actions that change an order or a payment. Discovering a purchase tool doesn’t authorize a purchase, and seeing a cancel tool doesn’t let me cancel somebody else’s order. The server still enforces those boundaries. I’m exposing clear store operations, not a universal tool that lets the model make arbitrary requests against every backend API.

## Slide 18. What goes in the package?

**Presenter / supporting notes.**

Here’s the concrete folder behind the word plugin. The portable starting point has a manifest, an MCP connection file, optional skills, assets and documentation. I’ve built sample ZIPs for the same store and included native layouts for ChatGPT, Claude, Cursor and Factory. They’re labeled examples because the endpoint and listing URLs are fictional. For a real release I replace those values, implement production authorization, test the actual host and complete review. Claude and Cursor take repository submissions; Muse has its own connector intake. The same ZIP isn’t a universal submission. I also linked Anthropic’s real productivity plugin as a working reference. Keep credentials, databases and local dependencies out of the archive.

## Slide 19. One store. A wider ecosystem.

**Presenter / supporting notes.**

These are places I’d investigate for distributing or connecting the same store, not eighteen identical marketplaces. ChatGPT, Claude, Meta Muse, Cursor and Hermes have documented public review routes. Factory supports Git plugin marketplaces, with official curation separate. The MCP Registry, Smithery, Glama, Docker and Cline provide other discovery paths. Gemini, VS Code, Zed and Continue have their own extension or MCP configuration ecosystems. I’ve included Instinct because it is relevant to this conversation, but I haven’t verified a public MCP submission route at instinct.com. I check each route before promising availability. The companion table records the format and link for every logo; this isn’t a complete census or a claim that all accept ZIPs.

## Slide 20. What should your store let an assistant do?

**Presenter / supporting notes.**

I’m happy to take questions. If you have an example, let’s start with the customer’s request, the services needed to fulfil it, and the actions the store is willing to expose. We can trace it through the same picture: host, store MCP server and underlying systems. We can also talk about hosting, permissions or the publication paths. 