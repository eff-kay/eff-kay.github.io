# Browser chatbot provider API framing

Reviewed November 3, 2026. The active combined preview supersedes its source edition’s Custom GPT/Actions opening.

The example is our own browser UI and backend. OpenAI/Claude model APIs are called by that backend; store tools are executed by trusted backend code. The provider switch is OpenAI Responses API → Claude Messages API in the same chatbot.

Primary references:

- [OpenAI function calling](https://developers.openai.com/api/docs/guides/function-calling): function definitions under tools, JSON Schema in parameters; Responses function_call requests and function_call_output replies keyed by call ID.
- [Claude tool definitions](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools): name, description and input_schema; Messages API tool configuration.
- [Claude tool-call handling](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls): tool_use blocks, tool_result feedback and associated tool-use IDs.
- [MCP architecture](https://modelcontextprotocol.io/docs/learn/architecture): the host owns model integration and context handling; MCP is its server-facing capability protocol.

Both examples can reuse the same domain input schema while their API envelopes differ. The on-slide calls are partial backend templates with configured clients/model variables; the JSON in slide 5 is a normalized explanatory call, not a full provider response. No paid model API calls or browser deployment were performed.

A model change within one provider may retain its API contract. Changing providers requires handling their request/conversation/call/result formats, either directly or through an abstraction. MCP does not automatically normalize the two model APIs. Consumer ChatGPT/Claude directory distribution is introduced later as a different host/onboarding path.
