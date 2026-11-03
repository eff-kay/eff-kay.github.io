# Same store; different submission artifacts

Checked November 3, 2026. This kit chooses the Agent Plugins root format for ChatGPT; OpenAI also documents a Codex compatibility format.

| Difference | ChatGPT plugin | Claude plugin | Claude connector |
|---|---|---|---|
| What you send | Plugin ZIP, with manifests at its root | GitHub repo + plugin folder + tracked branch/tag | Hosted HTTPS MCP URL + portal listing |
| Identity file | plugin.json | .claude-plugin/plugin.json | Listing fields in the portal |
| MCP connection file | mcp.json · type: streamable-http | .mcp.json · type: http | The URL is entered in the portal |
| Platform metadata | extensions.com.openai.interface, review, publication | Native manifest plus README; data handling in portal | Documentation, privacy, support, icon, use cases |
| Sign-in configuration | OpenAI auth extension declares OAuth client/scopes; secrets in portal | Remote connector handles account sign-in; no secret in .mcp.json | Configure OAuth for user-account access in portal |
| Review evidence | Initial MCP review: 5 positive + 3 negative cases and walkthrough | Repository scan, directory checks and any reviewer requests | Test every tool; supply populated reviewer account |
| Skills | Shared skills/ folder in this sample | Same shared skills/ folder | Not a standalone skill submission |
| Publishing | Resolve findings → review → publish approved ZIP | Scan → possible review → applicable publishing gate | Auto-screened Community by default; exceptions exist |
| What this sample lacks | Real endpoint, publisher setup, OAuth, recording and review | Real connected service, production policies and directory checks | Live URL, real auth and portal submission |

## What stays the same

The store workflow, hosted MCP URL, server-side tool schemas, shared skill, customer ownership checks and order-state rules. The protocol does not require rebuilding the business service for each listing. The plugin file formats and platform review/setup requirements differ.

## What belongs outside public plugin files

Reviewer credentials, OAuth client secrets, production tokens, databases and customer data. Deployment, domain verification, sign-in, working privacy/support pages, actual host testing and publication happen outside the ZIP. Review material may be packaged where supported, but secrets use private portal fields.

## Changes worth pointing out in the code

- ChatGPT listing fields live under extensions.com.openai.interface.
- ChatGPT review cases and recording URL live under extensions.com.openai.review.
- ChatGPT release notes live under extensions.com.openai.publication.release_notes.
- The chosen ChatGPT MCP entry uses streamable-http and an OpenAI auth extension; Claude uses http in .mcp.json. These are configuration dialects for the remote MCP connection, not different store APIs.
- Claude's plugin folder is the submitted repository subfolder, not the entire workshop repository. Its remote server also needs the connector route.

See SOURCES.md for official references and REPLACE-BEFORE-SUBMIT.md for the actual release work. Local checks do not establish acceptance or commerce eligibility.
