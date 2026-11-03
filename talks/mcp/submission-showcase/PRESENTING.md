# A three-minute first-person walkthrough

## 0:00 — One server, different distribution

“This is still Maya's store. I haven't rebuilt the store three times. I have the same hosted MCP interface, but each directory asks me to describe and deliver it differently. The .example address makes this an inspectable teaching sample.”

## 0:30 — Open the ChatGPT ZIP

“I'll open plugin.json. Here is the identity, the listing, and the review evidence. Notice the five positive and three negative cases. Release notes are under publication. In mcp.json, I point to the hosted server and declare the OAuth setup. The client ID is public configuration; the secret is entered privately. Uploading this ZIP doesn't deploy the server.”

## 1:20 — Switch to Claude

“Now look at the hidden .claude-plugin/plugin.json and .mcp.json files. The skill is the same. I submit a GitHub repository and plugin path, rather than this ZIP. That ZIP is just an export for us to inspect. For the hosted server, the connector route asks for the URL, sign-in and listing details.”

## 2:00 — Show the evidence

“These are real outputs from our fictional local fixture: successful search, quote, order, status and cancellation; plus three requests that must not succeed. This proves the lesson ran. It doesn't prove that a marketplace or production OAuth accepted it. I'd rerun the cases in the target app with the review account and record that experience.”

## 2:40 — Show what must change

“I replace the placeholder endpoint, policies and recording, configure real authentication, verify the publisher and permitted commerce flow, and finish the portal's checks. The package is one artifact in submission. A reviewed, live customer experience requires the service and the evidence too.”
