# Same simple server; different packaging

| Difference | ChatGPT plugin | Claude plugin | Claude connector |
|---|---|---|---|
| What you send | Plugin ZIP, with manifests at its root | GitHub repo + plugin folder + tracked branch/tag | Hosted HTTPS MCP URL + portal listing |
| Identity file | plugin.json | .claude-plugin/plugin.json | Listing fields in the portal |
| MCP connection file | mcp.json · type: streamable-http | .mcp.json · type: http | The URL is entered in the portal |
| Platform metadata | extensions.com.openai.interface, review, publication | Native manifest plus README; data handling in portal | Documentation, privacy, support, icon, use cases |
| Sign-in configuration | OpenAI auth extension: type none for this public fixture | No authentication for the referenced public fixture | Choose No authentication for this public fixture |
| Review evidence | Initial MCP review: 5 positive + 3 negative cases and walkthrough | Repository scan, directory checks and any reviewer requests | Test every tool; supply populated reviewer account |
| Skills | Shared skills/ folder in this sample | Same shared skills/ folder | Not a standalone skill submission |
| Publishing | Resolve findings → review → publish approved ZIP | Scan → possible review → applicable publishing gate | Auto-screened Community by default; exceptions exist |
| What this sample lacks | Real stable endpoint, publisher setup, recording and review | Real connected service, production policies and directory checks | Live stable URL, listing and portal submission |

Both plugin folders share identical search-and-quote instructions and point to the same hosted MCP URL. This example uses No authentication because all data is public and fictional. Authenticated account integrations are a different example. ChatGPT review cases and recording metadata live in extensions.com.openai.review; release notes live in extensions.com.openai.publication. Claude reads its native manifest and README and takes a repository/path. A Claude connector takes the URL and portal fields. The two MCP configuration type values are wrapper dialects for the same protocol.
