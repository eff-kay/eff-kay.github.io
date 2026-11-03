"""Two synchronous MCP tools. Fictional prices; no orders or external APIs."""

from mcp.server import MCPServer

mcp = MCPServer("Maya's simple store")


@mcp.tool()
def search_products(color: str = "blue") -> dict:
    """Find a carry-on backpack by color. Prices are in USD."""
    print(f"[search_products] color={color!r}", flush=True)
    result = {
        "products": [{"id": "backpack", "color": "blue", "price_usd": 79}]
        if color == "blue"
        else []
    }
    print(f"[search_products] returned {result}", flush=True)
    return result


@mcp.tool()
def quote_delivery(product_id: str) -> dict:
    """Get the delivery cost and total for the backpack. Does not place an order."""
    print(f"[quote_delivery] product_id={product_id!r}", flush=True)
    result = (
        {"shipping_usd": 12, "total_usd": 91, "arrival": "Friday (demo estimate)"}
        if product_id == "backpack"
        else {"error": "Product not found"}
    )
    print(f"[quote_delivery] returned {result}", flush=True)
    return result


if __name__ == "__main__":
    print("Store ready at http://127.0.0.1:8770/mcp", flush=True)
    mcp.run(transport="streamable-http", host="127.0.0.1", port=8770)
