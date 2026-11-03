# Publish the store MCP: links, blockers and timing

Checked November 3, 2026. This is preparation guidance for the fictional store example, not a report of our own marketplace approvals. [Readable web version](publication-guide.html).

## Where to submit

| Route | Submit here | Official instructions | What is submitted |
|---|---|---|---|
| ChatGPT plugin | [Plugins portal](https://platform.openai.com/plugins) | [Submission guide](https://developers.openai.com/plugins/deploy/submission) · [Review checklist](https://developers.openai.com/plugins/deploy/app-review) | Plugin ZIP plus hosted MCP connection |
| Claude remote MCP connector | [Directory portal](https://claude.ai/directory/manage) → MCP connector | [Connector guide](https://claude.com/docs/connectors/building/submission) · [Tool checklist](https://claude.com/docs/connectors/building/review-criteria) | Public HTTPS endpoint, authentication and listing |
| Claude plugin bundle | [Same portal](https://claude.ai/directory/manage) → Plugin | [Plugin guide](https://claude.com/docs/plugins/submit) | GitHub repository/folder, tracked branch or tag |

For ChatGPT: upload, connect and test, submit for review, then publish the approved version. For an initial MCP review, prepare five positive and three negative cases, a walkthrough and private reviewer access. Use the current portal for publisher, domain, sign-in and scan requirements. Credentials belong in the secure review form, never the public ZIP. [Official process](https://developers.openai.com/plugins/deploy/submission).

For Claude: a standard remote connector is screened automatically and normally listed as Community without another action. Some submissions need human review; per-customer URLs need Verified before listing. A plugin bundle follows repository scanning and a publishing gate; the portal identifies who publishes. If a bundle references your remote server, submit the server as a connector too. [Connector flow](https://claude.com/docs/connectors/building/submission), [plugin flow](https://claude.com/docs/plugins/submit).

## Three avoidable blockers

1. **Reviewers cannot connect.** Test the public endpoint and a populated reviewer account from outside your network. Keep access working throughout review.
2. **Tools or evidence fail.** Rehearse the promised journey and refusal cases. Separate read/write operations; make titles, descriptions and hints accurate. For Maya: quoting must not buy, cancellation must respect ownership and order state. [ChatGPT checks](https://developers.openai.com/plugins/deploy/app-review), [Claude tool criteria](https://claude.com/docs/connectors/building/review-criteria).
3. **The scope does not fit.** Make privacy, API rights and checkout behavior explicit. The simulated purchase workflow does not establish marketplace eligibility. Confirm the host’s permitted commerce experience before submitting. [ChatGPT policies](https://developers.openai.com/plugins/plugin-guidelines), [Claude scope criteria](https://claude.com/docs/connectors/building/review-criteria).

## Rough approval timing

These are **our scheduling buffers**, not vendor promises, measured averages or upper bounds. Rework and queues can extend them.

| Route | What I would allow | What the platform actually promises |
|---|---|---|
| ChatGPT MCP-backed plugin | **2–6+ weeks** after a complete submission | No fixed deadline; review duration varies |
| Claude Community connector | Automated path first; no defensible fixed duration. A human hold can add weeks. | Default automatic policy screening/listing, with exceptions; no fixed deadline |
| Claude plugin needing review | **Several weeks** | Scans and potential human review, followed by the applicable publishing gate; no fixed deadline |

Official timing statements: [OpenAI review FAQ](https://developers.openai.com/plugins/deploy/app-review), [Claude status guide](https://claude.com/docs/directory/submission-status). [Claude verification](https://claude.com/docs/connectors/verification) is separate from an ordinary Community listing; there is no application for the label.

### Why those buffers, rather than a promised date?

- [October developer reports](https://www.reddit.com/r/mcp/comments/1wvazmg/submitted_to_claudes_connector_directory_or/) include self-reported ChatGPT approvals around two to three weeks. These are a small, self-selected sample, not a representative average.
- [An OpenAI Community submitter](https://community.openai.com/t/system-bug-plugin-v3-0-0-never-reviewed-stuck-in-review-since-sep-18-while-the-list-shows-not-submitted/1407083) reported a wait exceeding five weeks, alongside much faster earlier versions. This illustrates possible delays, not a normal duration.
- [Elastic’s firsthand Claude plugin account](https://www.elastic.co/search-labs/blog/publish-claude-plugin-directory) reports three weeks **from first commit to live**, including development. It is not a three-week approval measurement. The several-week plugin allowance is our scheduling judgment, not a derived median.

## During review and after launch

Track each finding, fix the specific package/server/listing issue, and recheck. Keep the review account populated. Monitor the portal and follow its resubmission or appeal path. Confirm **Published**, then test the live listing and new-user connection. Track sign-in failures, tool outcomes and safe order state changes after launch. Approval does not host or operate the server for us.
