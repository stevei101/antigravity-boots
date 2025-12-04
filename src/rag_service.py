import google.generativeai as genai
import os
import json
import time
from typing import List, Optional

# Configuration
# Ensure GEMINI_API_KEY is set in environment
if "GEMINI_API_KEY" not in os.environ:
    raise ValueError("GEMINI_API_KEY environment variable not set.")

genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# Configuration Defaults
DEFAULT_CONFIG_FILE = "rag_store.json"
DEFAULT_MODEL_NAME = "models/gemini-2.0-flash-001"
DEFAULT_TTL = 3600

# Load Config from Env
CONFIG_FILE = os.environ.get("RAG_STORE_FILE", DEFAULT_CONFIG_FILE)
MODEL_NAME = os.environ.get("GEMINI_MODEL_NAME", DEFAULT_MODEL_NAME)
CACHE_TTL = int(os.environ.get("RAG_TTL", DEFAULT_TTL))

class GeminiRAG:
    def __init__(self):
        self.config_file = CONFIG_FILE
        self._load_config()

    def _load_config(self):
        if os.path.exists(self.config_file):
            with open(self.config_file, 'r') as f:
                self.stores = json.load(f)
        else:
            self.stores = {}

    def _save_config(self):
        with open(self.config_file, 'w') as f:
            json.dump(self.stores, f, indent=2)

    def create_knowledge_base(self, name: str, file_paths: List[str]) -> str:
        """Creates a persistent store (CachedContent) and indexes files."""
        print(f"Creating knowledge base '{name}' with {len(file_paths)} files...")
        
        # 1. Upload Files
        uploaded_files = []
        for path in file_paths:
            if not os.path.exists(path):
                print(f"Warning: File {path} does not exist. Skipping.")
                continue
                
            print(f"Uploading {path}...")
            try:
                # Specify mime_type for code files if needed, but auto-detection usually works for common types.
                # For .ts, .py, .json, text/plain or application/json might be safer if auto-detect fails.
                mime_type = None
                ext = os.path.splitext(path)[1].lower()
                if ext in ['.ts', '.py', '.js', '.md', '.txt', '.toml']:
                    mime_type = "text/plain"
                elif ext == '.json':
                    mime_type = "application/json"

                f = genai.upload_file(path=path, mime_type=mime_type)
                uploaded_files.append(f)
            except Exception as e:
                print(f"Failed to upload {path}: {e}")

        if not uploaded_files:
            raise ValueError("No files were successfully uploaded.")

        # Wait for files to be processed
        print("Waiting for files to be processed...")
        active_files = []
        for f in uploaded_files:
            while f.state.name == "PROCESSING":
                print(f"Processing {f.name}...", end=' ', flush=True)
                time.sleep(2)
                f = genai.get_file(f.name)
            
            if f.state.name != "ACTIVE":
                print(f"\nWarning: File {f.name} is not active (State: {f.state.name}). Skipping.")
            else:
                active_files.append(f)

        if not active_files:
            raise ValueError("No files became ACTIVE.")

        # 2. Create CachedContent
        # Note: CachedContent is associated with a specific model.
        print(f"Creating CachedContent with model {MODEL_NAME}...")
        try:
            cache = genai.caching.CachedContent.create(
                model=MODEL_NAME,
                display_name=name,
                contents=active_files,
                ttl=CACHE_TTL
            )
            
            print(f"Created Cache: {cache.name}")
            
            # 3. Persist Store ID
            self.stores[name] = {
                "name": cache.name,
                "model": MODEL_NAME,
                "created_at": time.time(),
                "files": [f.name for f in uploaded_files]
            }
            self._save_config()
            
            return cache.name
        except Exception as e:
            print(f"Failed to create CachedContent: {e}")
            raise

    def get_chat_model(self, store_name: str):
        """Returns a model configured with the specific store."""
        if store_name not in self.stores:
            raise ValueError(f"Store '{store_name}' not found in local config.")
            
        store_info = self.stores[store_name]
        cache_name = store_info["name"]
        
        print(f"Retrieving cache {cache_name} for store '{store_name}'...")
        try:
            # Retrieve the cache object
            cache = genai.caching.CachedContent.get(cache_name)
            
            # Create model from cache
            model = genai.GenerativeModel.from_cached_content(cached_content=cache)
            return model
        except Exception as e:
            print(f"Failed to retrieve cache or create model: {e}")
            # Maybe the cache expired?
            print("The cache might have expired (TTL). You may need to recreate it.")
            raise

    def list_stores(self):
        return list(self.stores.keys())

    def delete_store(self, name: str):
        """Deletes a store and its associated cached content."""
        if name not in self.stores:
            raise ValueError(f"Store '{name}' not found.")

        store_info = self.stores[name]
        cache_name = store_info["name"]

        print(f"Deleting cache {cache_name}...")
        try:
            # Attempt to delete the cached content from Gemini
            # Note: The library might throw if it's already expired/gone.
            try:
                cache = genai.caching.CachedContent.get(cache_name)
                cache.delete()
                print("Remote cache deleted.")
            except Exception as e:
                print(f"Warning: Could not delete remote cache (maybe expired?): {e}")

            # Remove from local config
            del self.stores[name]
            self._save_config()
            print(f"Store '{name}' removed from local config.")
            
        except Exception as e:
            print(f"Failed to delete store: {e}")
            raise
