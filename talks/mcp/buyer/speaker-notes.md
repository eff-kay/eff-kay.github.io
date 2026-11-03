# MCP from first principles — 15-minute speaking draft

17 slides: biography + 15 one-minute content slides + Q&A. Notes are a pacing draft, not a guarantee of delivery speed.

## Slide 1. Faizan Khan

**Outside the 15-minute plan.**

I’m Faizan, and at Docsalot we create and host MCP servers. We’ve built read-only access to more than 300 documentation sites. That’s the experience behind my interest in this topic. But today I want to start with something familiar: buying a backpack. I’ll use that one question to explain why MCP exists, how a request works, and how we can publish an integration in ChatGPT and Claude. The main talk is fifteen minutes; this introduction and our questions sit outside that.

## Slide 2. Give your AI a way to reach the work.

**Minute 1 of 15.**

I want to start with a question someone might actually ask: find me a blue carry-on backpack under a hundred dollars that arrives by Friday. A model can understand that sentence. But understanding it doesn’t tell us which shops have stock, what delivery costs, or when a parcel is expected to arrive. Those facts live outside the model. So before I think about a protocol, I need a way to reach the systems that know the answer. I’m going to use fictional shops and sample prices, so we can follow the whole journey without getting distracted by a particular retailer. Keep those three constraints in mind: the product, the total budget, and the deadline.

## Slide 3. One answer depends on three different providers.

**Minute 2 of 15.**

Let’s say TrailShop and CityBags both sell suitable backpacks. They are separate businesses, with separate catalogs and APIs. ParcelQuote is a third provider that gives us delivery estimates. Neither shop’s product list, on its own, answers Maya’s full question. I need to search both catalogs, carry the product and shipping details into the delivery lookup, and combine the results. If a provider doesn’t return enough information, I need to say what’s missing. The important point is that the user asked one question, but the application needs several capabilities from several providers. That’s why I want to explain MCP through a buyer assistant rather than through one isolated function.

## Slide 4. Now connect every app to every provider.

**Minute 3 of 15.**

I can absolutely build this with the providers’ APIs. The mess starts when I repeat the descriptions, input handling, authentication and response handling inside several applications. Shared libraries already help, so I’m not claiming every model change forces a full rewrite. But I’d still like a common way for an AI application to ask what capabilities exist and request them. Imagine adding another assistant, or another shopping provider. I want to reuse the interface instead of rebuilding that part each time. That’s the question that leads us to MCP: wouldn’t it be useful if supporting applications and servers agreed on how to describe and use capabilities?

## Slide 5. MCP is a common language. Your APIs stay.

**Minute 4 of 15.**

MCP stands for Model Context Protocol. I think of it as a common language between an AI application and a server exposing useful capabilities. The short version is: MCP is not a replacement for APIs. The shops still have their own APIs. Somebody still implements the adapters that call them. What changes is the interface I offer to supporting AI applications: they can discover the tools and request them through the same protocol. MCP doesn’t create stock, unlock permissions, or make a delivery estimate more certain. It standardizes the capability exchange. In our example, I’m choosing to put the three provider adapters behind one buyer server. That’s our design, not a requirement that every MCP system has one central gateway.

## Slide 6. First discover the tools. Then make a specific request.

**Minute 5 of 15.**

Before I ask the buyer server to do anything, my application can ask which tools it offers. Here it learns about product search and delivery quotes, along with the inputs those tools need. That’s discovery. I don’t have to invent a tool definition inside each application. I still decide which tools the host makes available, and the server still validates every request. Discovering a tool is not permission to use it. I also want a focused menu: search products and quote delivery are easier to understand than a universal tool that accepts any arbitrary API request. The protocol gives us the mechanism; clear tool design makes that mechanism useful.

## Slide 7. The host coordinates. The server connects to providers.

**Minute 6 of 15.**

Let me name the parts. The host is the buyer application. Inside it, an MCP client handles the connection to our server. The model can propose a tool call, but the host coordinates that call. The server validates it, applies its policies, and talks to the providers. On the right, we still have three independent systems. The model isn’t opening its own connection to every shop. And the server isn’t the model. This is one possible aggregation design; I could also use separate MCP servers and clients for separate providers. What stays common is the protocol between the application and each server. That’s the first major point: a reusable interface with clear responsibilities.

## Slide 8. Search both shops. Keep the user’s constraints.

**Minute 7 of 15.**

Now let’s run Maya’s question through that design. The host can propose searches of TrailShop and CityBags for blue carry-on backpacks. In a real product, I’d also need a clear interpretation of carry-on size and the relevant destination. I shouldn’t silently guess missing requirements. For this example, assume we already have those details. Both searches can be independent, so our application can run them together if its implementation supports that. TrailShop returns one candidate and CityBags returns two. We keep the shop, item identifier, price and stock information attached to each result. MCP carries the calls, but our application still owns planning the workflow and deciding what to do with the results.

## Slide 9. A cheap product can still be the wrong answer.

**Minute 8 of 15.**

Next I ask the independent delivery provider for estimates for the three candidate offers. This is where the earlier results become inputs to another tool. The sample totals include delivery and taxes. TrailShop comes to 91 dollars with a Friday estimate. One CityBags option is 92 dollars but arrives Monday; another is 103 dollars and arrives Thursday. So only the first meets both constraints in our fixture. I want the final answer to explain that comparison and identify the shops behind it. Friday is still an estimate, not a guarantee. If a quote is unavailable or stale, I should say so rather than pretend I found a complete answer.

## Slide 10. Recommend with evidence. Don’t quietly turn it into a purchase.

**Minute 9 of 15.**

My answer to Maya can now be concrete: this blue carry-on from TrailShop is 91 dollars in total and is expected Friday. I can explain why the other options didn’t qualify and show the source offer. But I haven’t bought anything. That’s a deliberate boundary for this first version. Finding and comparing products doesn’t authorize a purchase or expose private customer records. If I later add checkout, it needs separate permissions, clear confirmation and reliable handling of the payment outcome. I also keep provider credentials out of model-visible content and validate results on the server. MCP connects the capabilities; my product still owns those controls and the accuracy of the final experience.

## Slide 11. Make the experience reviewable before submitting.

**Minute 10 of 15.**

Before I open a submission portal, I want this experience to work for somebody who isn’t me. I need a stable HTTPS service, correct authentication where needed, clear tool descriptions, and privacy and support information. I test in the target application, not only in my own client. For this buyer assistant I’d test a useful match, no matching offers, a missing delivery quote and a request outside our permissions. I prepare realistic sample data and reviewer access when sign-in is required. A listing is distribution, not hosting, and a private connection isn’t the same as public approval. That’s the foundation for publishing the same underlying service in two different ecosystems.

## Slide 12. ChatGPT: submit the package. Prove the connected experience.

**Minute 11 of 15.**

For ChatGPT, I use the Plugins portal with the right organization permissions and verified publisher identity. I upload the package with its remote MCP configuration, connect the endpoint, verify the domain and complete authentication and scans. I include five positive cases, three negative cases and an accessible walkthrough, with reviewer access when required. For our buyer tool, I show both a useful comparison and honest failure behavior. I resolve the findings, submit for review and publish after approval. Uploading successfully is not approval. I also keep private credentials out of the public package. The listing helps people discover the integration; I continue operating the buyer service behind it.

## Slide 13. Claude: choose connector or plugin bundle.

**Minute 12 of 15.**

For Claude, I can submit this remote server as an MCP connector through the directory portal. I test it in Claude, provide the HTTPS endpoint, authentication, listing information and reviewer access, and make sure the tools have titles and the appropriate hints. The current portal supports paid plans with the relevant account permissions. If I also want to distribute reusable workflow instructions, I can submit a plugin bundle from GitHub; my own remote server still needs its connector submission. I address validation and review findings, then publish after approval. I don’t assume ChatGPT approval transfers here. In either portal, broken access or misleading tools make the experience difficult to review.

## Slide 14. One question. Three lessons.

**Minute 13 of 15.**

Let me bring the three main points back to Maya’s question. First, we connected through a common capability interface instead of making every application learn a different tool protocol. Second, we used that interface to combine two shops and an independent delivery provider into a useful answer, while keeping the evidence and limits visible. Third, we prepared that experience for publication, with separate ChatGPT and Claude submissions. Those are related steps, but they solve different problems. MCP is the connection layer. The buyer assistant is the product. The platform directory is how people discover it. If you can distinguish those three, you can reason about most MCP projects without memorizing all the wire-level messages.

## Slide 15. After publication, you still own the service.

**Minute 14 of 15.**

There’s one final responsibility I don’t want publication to hide. I still operate the service. If a shop changes its API, a sign-in flow breaks, or a delivery provider stops responding, I need to know and handle it. I want enough observability to understand failed operations without collecting unnecessary customer data. I also want published tools to remain compatible while updates roll out. A successful search must not suddenly become a purchase because I changed what a tool means. The directories have their own checks for changes, but they don’t replace our monitoring and release discipline. My responsibility is the experience people get after they click Connect, not just the moment the listing goes live.

## Slide 16. Start with one real question. Ship one useful connection.

**Minute 15 of 15.**

If I were starting tomorrow, I’d begin with the user’s question, not with a giant list of tools. What result would actually help them? Which providers know the facts? What’s the smallest set of capabilities I can expose to get there? For our buyer, searching two shops and checking delivery was already useful. We didn’t need to add checkout to prove the idea. I’d make that one workflow clear, bounded and testable, and then prepare it for the places our users already work. That’s the approach I wanted to share: understand the need, connect the capabilities, verify the experience, and publish it deliberately. From there, the next capability should follow a real user need.

## Slide 17. What would your buyer need to connect to?

**Outside the 15-minute plan.**

I’m happy to take questions. If you have an example in mind, let’s start with the user’s request, the providers that know the answer, and what the assistant is allowed to do. We can trace it through the same picture: application, MCP server and underlying systems. We can also talk about hosting or the publication paths. This discussion is outside the fifteen-minute content plan.