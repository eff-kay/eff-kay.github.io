# MCP from first principles — 15-minute speaking draft

17 slides: biography + 15 one-minute content slides + Q&A. Notes are a pacing draft, not a guarantee of delivery speed.

## Slide 1. Faizan Khan

**Outside the 15-minute plan.**

I’m Faizan, and at Docsalot we create and host MCP servers. We’ve built read-only access to more than 300 documentation sites. That’s the experience behind my interest in this topic. But today I want to start with something familiar: buying a backpack. I’ll use that one question to explain why MCP exists, how a request works, and how we can publish an integration in ChatGPT and Claude. The main talk is fifteen minutes; this introduction and our questions sit outside that.

## Slide 2. Give your AI a way to reach the work.

**Minute 1 of 15.**

I want to start with a question someone might actually ask our ecommerce store: find me a blue carry-on backpack under a hundred dollars that arrives by Friday. A model can understand that sentence. But it doesn’t know our stock, where the shopper needs it delivered, or what shipping will cost. Those facts live in our catalog and connected services. So before I think about a protocol, I need a way to reach the systems that know the answer. We’ll use a fictional store and sample values, then follow Maya when she buys the backpack and later asks to cancel. Keep the product, the budget and the delivery deadline in mind.

## Slide 3. One store. Several connected services.

**Minute 2 of 15.**

This is our ecommerce store exposing its own capabilities. Our catalog knows the products and prices. An independent address service, GeoRoute, resolves the destination and calculates a route distance from our warehouse. ParcelQuote uses the relevant route and parcel information to estimate shipping. Our order system handles the purchase and cancellation. These services have different jobs, so I need to coordinate them to answer one shopper. I’m assuming Maya supplies a destination or authorizes use of her saved address. We’re using fictional providers here, not her real location. The distance alone doesn’t guarantee arrival; the delivery provider still needs to check its service and estimate.

## Slide 4. Now repeat those connections for every AI application.

**Minute 3 of 15.**

I can build all of this with the underlying APIs, and the store probably already uses some of them. The mess is the repeated AI-facing integration: describing operations, handling inputs, interpreting results and connecting the same workflow to different assistants. Shared code can reduce that work, so I’m not saying APIs are broken or that every model needs a complete rewrite. But I don’t want one bespoke tool interface for my store chatbot, another for ChatGPT and another for Claude. Wouldn’t it help if supporting applications agreed on how to discover and request our store’s capabilities? That’s the problem MCP addresses. The backend APIs stay; the capability interface becomes reusable.

## Slide 5. MCP is a common language. Your APIs stay.

**Minute 4 of 15.**

MCP stands for Model Context Protocol. I think of it as a common language between an AI application and the server exposing our store’s capabilities. MCP is not a replacement for APIs. Our catalog, address, delivery and order APIs still do the underlying work. We still implement those adapters and the business rules. What changes is the interface we offer to supporting AI applications: they can discover tools and request them through the same protocol. MCP doesn’t grant purchasing permission or calculate shipping by itself. In this example, the ecommerce store owns the MCP server. It offers useful shopping operations rather than making each application assemble raw calls to all our services.

## Slide 6. Discover the store’s tools. Then make a specific request.

**Minute 5 of 15.**

My application first asks the store’s MCP server what it can do. The menu includes finding products, quoting delivery, placing an order and cancelling an order. Each tool has a name, a purpose and defined inputs. That helps the host present the right capabilities to the model. I keep the read operations separate from the actions that change an order or a payment. Discovering a purchase tool doesn’t authorize a purchase, and seeing a cancel tool doesn’t let me cancel somebody else’s order. The server still enforces those boundaries. I’m exposing clear store operations, not a universal tool that lets the model make arbitrary requests against every backend API.

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

## Slide 14. One store. Three lessons.

**Minute 13 of 15.**

Let me bring the journey together. First, we exposed our store through a common capability interface while keeping the underlying APIs. Second, we used our catalog, an address service and a delivery provider to answer Maya’s request, then followed her through a confirmed purchase and an eligible cancellation. Third, we made the reason for publishing explicit: shoppers already use ChatGPT and Claude, and we want them to discover and connect our store there. Those are three different responsibilities. MCP is the connection layer. The ecommerce workflow is our product. The directory is a distribution channel. The protocol makes reuse easier, but our implementation still owns permission checks and truthful outcomes.

## Slide 15. After publication, you still own the service.

**Minute 14 of 15.**

After publication, I still operate the store’s MCP server. If the address service fails, delivery estimates stop working, or checkout loses a response, I need to detect that and help the customer recover. For purchases and cancellations, I also need to preserve the actual outcome so retries don’t create duplicate orders or misleading status messages. I want useful observability without unnecessarily collecting addresses or payment data. And I keep published tools compatible while changes roll out. A tool described as a lookup must not quietly start placing an order. Platform review and update checks help, but they don’t replace our release discipline. We own the experience after the customer connects.

## Slide 16. Start with one real question. Ship one useful connection.

**Minute 15 of 15.**

If I were starting tomorrow, I’d begin with the customer’s request, not with a giant menu of tools. Which system knows our products? Which service resolves the address and route? Which provider can quote delivery? I’d connect those capabilities into one useful answer, then add explicit, well-controlled actions for buying and cancelling when the product needs them. I’d test the whole customer journey before publishing it where customers already work. That’s the approach I wanted to share: keep the APIs that do the work, expose a clear MCP interface, verify the real outcomes, and distribute it deliberately. Start with one journey someone actually needs and make the next capability earn its place.

## Slide 17. What should your store let an assistant do?

**Outside the 15-minute plan.**

I’m happy to take questions. If you have an example, let’s start with the customer’s request, the services needed to fulfil it, and the actions the store is willing to expose. We can trace it through the same picture: host, store MCP server and underlying systems. We can also talk about hosting, permissions or the publication paths. This discussion sits outside the fifteen-minute content plan.