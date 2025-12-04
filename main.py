import argparse
import os
from src.rag_service import GeminiRAG

def main():
    parser = argparse.ArgumentParser(description="Antigravity Boots CLI")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # RAG Command
    rag_parser = subparsers.add_parser("rag", help="RAG commands")
    rag_subparsers = rag_parser.add_subparsers(dest="rag_command", help="RAG subcommands")
    
    # rag create
    create_parser = rag_subparsers.add_parser("create", help="Create a knowledge base")
    create_parser.add_argument("--name", required=True, help="Name of the knowledge base")
    create_parser.add_argument("--path", required=True, help="Path to documents (file or directory)")

    # rag list
    rag_subparsers.add_parser("list", help="List available knowledge bases")

    # rag delete
    delete_parser = rag_subparsers.add_parser("delete", help="Delete a knowledge base")
    delete_parser.add_argument("--name", required=True, help="Name of the knowledge base to delete")

    # Chat Command
    chat_parser = subparsers.add_parser("chat", help="Chat with a knowledge base")
    chat_parser.add_argument("--store", required=True, help="Name of the knowledge base to chat with")

    args = parser.parse_args()

    if args.command == "rag":
        if args.rag_command == "create":
            rag = GeminiRAG()
            files = []
            if os.path.isdir(args.path):
                # Recursively find files
                # The issue says "PDFs, MD, TXT".
                extensions = ['.pdf', '.md', '.txt']
                for root, dirs, filenames in os.walk(args.path):
                    for filename in filenames:
                        if os.path.splitext(filename)[1].lower() in extensions:
                            files.append(os.path.join(root, filename))
            elif os.path.isfile(args.path):
                files.append(args.path)
            else:
                print(f"Error: Path {args.path} not found.")
                return

            if not files:
                print("No valid files found (looking for .pdf, .md, .txt).")
                return

            print(f"Found {len(files)} files.")
            try:
                rag.create_knowledge_base(args.name, files)
                print(f"Knowledge base '{args.name}' created successfully.")
            except Exception as e:
                print(f"Error creating knowledge base: {e}")

        elif args.rag_command == "list":
            rag = GeminiRAG()
            stores = rag.list_stores()
            if not stores:
                print("No knowledge bases found.")
            else:
                print("Available Knowledge Bases:")
                for store in stores:
                    print(f"- {store}")

        elif args.rag_command == "delete":
            rag = GeminiRAG()
            try:
                rag.delete_store(args.name)
            except Exception as e:
                print(f"Error deleting knowledge base: {e}")

    elif args.command == "chat":
        rag = GeminiRAG()
        try:
            model = rag.get_chat_model(args.store)
            chat = model.start_chat()
            print(f"Starting chat with store '{args.store}'. Type 'exit' to quit.")
            while True:
                try:
                    user_input = input("You: ")
                    if user_input.lower() in ['exit', 'quit']:
                        break
                    
                    response = chat.send_message(user_input)
                    print(f"Gemini: {response.text}")
                except KeyboardInterrupt:
                    print("\nExiting chat.")
                    break
                except Exception as e:
                    print(f"Error during chat: {e}")
        except Exception as e:
            print(f"Error: {e}")

    else:
        parser.print_help()

if __name__ == "__main__":
    main()
