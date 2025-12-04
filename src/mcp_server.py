from mcp.server.fastmcp import FastMCP
from src.rag_service import GeminiRAG
import os

# Initialize FastMCP server
mcp = FastMCP("Antigravity RAG")

# Initialize RAG service
# We assume GEMINI_API_KEY is set in the environment where this server runs
try:
    rag = GeminiRAG()
except Exception as e:
    print(f"Warning: Failed to initialize GeminiRAG: {e}")
    rag = None

@mcp.tool()
def list_knowledge_bases() -> list[str]:
    """List all available RAG knowledge bases."""
    if not rag:
        return ["Error: RAG service not initialized (check API key)"]
    return rag.list_stores()

@mcp.tool()
def query_knowledge_base(query: str, store_name: str = "antigravity-codebase") -> str:
    """
    Query a specific knowledge base using RAG.
    
    Args:
        query: The question or query to ask.
        store_name: The name of the knowledge base to query (default: antigravity-codebase).
    """
    if not rag:
        return "Error: RAG service not initialized (check API key)"
        
    try:
        model = rag.get_chat_model(store_name)
        # We use generate_content for a single turn query
        response = model.generate_content(query)
        return response.text
    except Exception as e:
        return f"Error querying knowledge base: {str(e)}"

def run():
    """Runs the MCP server."""
    mcp.run()

if __name__ == "__main__":
    mcp.run()
