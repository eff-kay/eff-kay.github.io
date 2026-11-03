"""Backend API-call templates used by the presentation.
Pass configured OpenAI/Anthropic client objects, model IDs and provider-formatted conversations.
Importing this file performs no API calls. These are not a complete browser chatbot.
"""

QUOTE_SCHEMA = {'type': 'object', 'properties': {'product_id': {'type': 'string'}, 'address_ref': {'type': 'string'}}, 'required': ['product_id', 'address_ref'], 'additionalProperties': False}
PURPOSE = "Estimate shipping and arrival."

def ask_openai(openai, openai_model, openai_input):
    return openai.responses.create(
        model=openai_model,
        input=openai_input,
        tools=[{
            "type": "function",
            "name": "quote_delivery",
            "description": PURPOSE,
            "parameters": QUOTE_SCHEMA,
        }],
    )


def ask_claude(claude, claude_model, claude_messages):
    return claude.messages.create(
        model=claude_model,
        max_tokens=1024,
        messages=claude_messages,
        tools=[{
            "name": "quote_delivery",
            "description": PURPOSE,
            "input_schema": QUOTE_SCHEMA,
        }],
    )
