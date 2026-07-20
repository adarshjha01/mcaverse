"""
build_retrieval_system.py — One-time script to build the ChromaDB vector index
for the MCAverse NIMCET question bank.

Usage:
    cd rag/
    pip install -r requirements.txt
    python build_retrieval_system.py

This will:
1. Load fresh_database_dump.json (5,384 questions)
2. Create rich text documents from each question
3. Embed them using sentence-transformers (all-MiniLM-L6-v2)
4. Store in a persistent ChromaDB collection at ./chroma_db/
"""

import json
import sys
from pathlib import Path

import chromadb
from chromadb.utils import embedding_functions

# --- Configuration ---
DATABASE_PATH = Path(__file__).parent.parent / "fresh_database_dump.json"
CHROMA_PERSIST_DIR = Path(__file__).parent / "chroma_db"
COLLECTION_NAME = "nimcet_questions"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
BATCH_SIZE = 100


def load_questions(path: Path) -> list[dict]:
    """Load questions from the JSON database dump."""
    print(f"Loading questions from {path}...")
    with open(path, "r", encoding="utf-8") as f:
        questions = json.load(f)
    print(f"  Loaded {len(questions)} questions.")
    return questions


def build_document(question: dict) -> str:
    """
    Create a rich text document from a question for embedding.
    Combines question text, options, explanation, and metadata.
    """
    parts = []

    # Subject and topic context
    subject = question.get("subject", "Unknown")
    topic = question.get("topic", "Unknown")
    year = question.get("year", "Unknown")
    difficulty = question.get("difficulty", "Unknown")

    parts.append(f"[Subject: {subject} | Topic: {topic} | Year: {year} | Difficulty: {difficulty}]")

    # Question text
    q_text = question.get("question_text", "")
    if q_text:
        parts.append(f"Question: {q_text}")

    # Options
    options = question.get("options", [])
    if options:
        option_labels = "ABCD"
        options_str = " | ".join(
            f"({option_labels[i]}) {opt}" for i, opt in enumerate(options) if i < 4
        )
        parts.append(f"Options: {options_str}")

    # Correct answer
    correct = question.get("correct_answers", [])
    if correct and options:
        option_labels = "ABCD"
        correct_text = ", ".join(
            f"({option_labels[i]}) {options[i]}" for i in correct if i < len(options)
        )
        parts.append(f"Correct Answer: {correct_text}")

    # Explanation
    explanation = question.get("explanation", "")
    if explanation:
        parts.append(f"Explanation: {explanation}")

    return "\n".join(parts)


def build_metadata(question: dict) -> dict:
    """Extract metadata fields for ChromaDB filtering."""
    return {
        "question_id": question.get("question_id", question.get("id", "")),
        "subject": question.get("subject", "Unknown"),
        "topic": question.get("topic", "Unknown"),
        "year": int(question.get("year", 0)) if question.get("year") else 0,
        "difficulty": question.get("difficulty", "Unknown"),
        "exam_id": question.get("exam_id", "nimcet"),
    }


def build_index():
    """Main function to build the ChromaDB vector index."""
    # Validate database exists
    if not DATABASE_PATH.exists():
        print(f"ERROR: Database not found at {DATABASE_PATH}")
        sys.exit(1)

    # Load questions
    questions = load_questions(DATABASE_PATH)

    # Initialize ChromaDB with persistent storage
    print(f"Initializing ChromaDB at {CHROMA_PERSIST_DIR}...")
    client = chromadb.PersistentClient(path=str(CHROMA_PERSIST_DIR))

    # Use sentence-transformers embedding function
    print(f"Using embedding model: {EMBEDDING_MODEL}")
    embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name=EMBEDDING_MODEL
    )

    # Delete existing collection if it exists (fresh rebuild)
    try:
        client.delete_collection(COLLECTION_NAME)
        print(f"  Deleted existing collection '{COLLECTION_NAME}'.")
    except Exception:
        pass

    # Create collection
    collection = client.get_or_create_collection(
        name=COLLECTION_NAME,
        embedding_function=embedding_fn,
        metadata={"description": "NIMCET exam questions with explanations"},
    )

    # Process questions in batches
    print(f"Building documents and embeddings (batch size: {BATCH_SIZE})...")
    total = len(questions)

    for batch_start in range(0, total, BATCH_SIZE):
        batch_end = min(batch_start + BATCH_SIZE, total)
        batch = questions[batch_start:batch_end]

        ids = []
        documents = []
        metadatas = []

        for q in batch:
            q_id = q.get("question_id", q.get("id", ""))
            if not q_id:
                continue

            doc = build_document(q)
            meta = build_metadata(q)

            ids.append(q_id)
            documents.append(doc)
            metadatas.append(meta)

        if ids:
            collection.add(ids=ids, documents=documents, metadatas=metadatas)

        progress = min(batch_end, total)
        print(f"  Indexed {progress}/{total} questions ({progress * 100 // total}%)")

    print(f"\n✅ Successfully built vector index!")
    print(f"   Collection: {COLLECTION_NAME}")
    print(f"   Documents: {collection.count()}")
    print(f"   Stored at: {CHROMA_PERSIST_DIR}")
    print(f"\nYou can now start the retrieval server:")
    print(f"   uvicorn retrieval_server:app --port 8000")


if __name__ == "__main__":
    build_index()
