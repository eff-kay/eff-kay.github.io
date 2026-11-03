# Marketplace submission — presenter’s working checklist

This supplements the three closing slides. It summarizes documented requirements and practical preparation; it is not a record of our own approvals or rejections, a complete error-code catalog, or an approval guarantee. Rechecked November 3, 2026. Platform-specific rules can change.

## Why submit

A compatible MCP endpoint enables a connection. A public directory adds a discovery and onboarding path. Decide whether that helps the intended customer; a private connector may be enough. A listing does not host the backend, confer every permission, guarantee traffic, or make both ecosystems behave identically.

## Before opening the portal

- State the user job and limits clearly. For the store: find an item, review and place a permitted order, then cancel an eligible order.
- Rehearse as a new customer, not an administrator. Exercise sign-in, tool selection, normal outcomes, missing data, denied access and recovery.
- Keep a populated review account available. Do not submit a real customer account or place credentials inside a public package.
- Confirm ownership of the service and permission to use downstream APIs. Publish appropriate data-use, support and product information.
- Keep backend authorization real. A “read-only” label is not access enforcement. Treat order cancellation and payment reversal as distinct outcomes.

## Gotchas by failure stage

| Stage | What can go wrong | Preparation |
|---|---|---|
| Package/setup validation | Wrong manifest or path, incomplete fields, unreachable endpoint, auth or domain setup failure | Use the correct route; resolve the exact portal error and recheck |
| Tool scan/review | Definitions misdescribe behavior; hints or justifications are missing | Inspect the scanned inventory and test every operation |
| Product review | Reviewers cannot reproduce the listing; unsupported scope or privacy issues | Match the promise to tested behavior and permitted data use |
| Publication | Upload or approval mistaken for a live release | Complete the publication step and verify from a fresh user context |
| Updates | Package changes confused with hosted-server changes | Follow each platform’s update route and preserve existing contracts |

## ChatGPT details to remember

The current remote path requires publisher/access setup, a ZIP, HTTPS, domain verification and a current MCP scan. Check required annotation values and justifications. Review evidence includes five positive cases, three negative cases, release notes and an accessible walkthrough. Screenshots have UI-dependent eligibility and dimensions; follow the current portal rather than reusing another marketplace’s assets. Verify checkout eligibility separately from directory approval.

## Claude details to remember

Use the connector portal for a remote MCP server; GitHub source is the plugin-bundle route. Supply accurate titles and applicable hints. A single catch-all tool mixing reads and writes is explicitly rejected. Tool descriptions must describe the operation, not give unrelated instructions. Valid calls must work and errors should be actionable. Use first-party APIs or legitimate proxies. Review unsupported use cases before promising cross-platform parity.

## During and after review

Keep a finding log: platform, version, failing scenario, expected result, actual result, correction and recheck. Treat a passing scan as one stage, not approval. After rejection, follow the stated feedback and the platform’s resubmission or appeal process. After approval, publish deliberately and monitor connection failures, tool outcomes, access boundaries and compatibility. Keep reviewer access current for subsequent checks.

Supporting primary links are retained in research.md rather than on projected slides.
