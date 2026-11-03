# The same two-function server, three submission routes

Open index.html for the side-by-side viewer. chatgpt-upload/ is the exact ChatGPT ZIP content. claude-plugin-repo/ is the native GitHub plugin folder (including hidden manifests). claude-connector/ is a portal worksheet, not a plugin. review-evidence/ contains actual HTTP fixture outputs and preparation cases. See DIFFERENCES.md, PRESENTING.md and REPLACE-BEFORE-SUBMIT.md.

Live code: https://github.com/eff-kay/atlas-mcp-python-tutorials/tree/main/store/simple-demo

Run from that folder: uv run python server.py. Local endpoint: http://127.0.0.1:8770/mcp. For ngrok: ngrok http http://127.0.0.1:8770 --host-header=127.0.0.1:8770, then use the current HTTPS URL with /mcp. The packaged HTTPS .example URL is deliberately a placeholder; it will not connect until replaced.

Exactly two tools: search_products(color) and quote_delivery(product_id). No orders, cancellation, OAuth, database or external APIs. The packages reference the hosted server; they do not deploy it. The complete kit ZIP is a presenter artifact, not a universal marketplace upload.
