"""
retrieval_server.py — FastAPI server for the MCAverse RAG system.

Provides a /query endpoint that:
1. Retrieves relevant NIMCET questions from ChromaDB
2. Constructs a prompt with retrieved context
3. Calls Ollama Qwen for a response
4. Returns the AI answer with source references

Usage:
    cd rag/
    uvicorn retrieval_server:app --port 8000 --reload

Requires:
    - ChromaDB index built (run build_retrieval_system.py first)
    - Ollama running locally with Qwen model pulled
"""

from pathlib import Path

import chromadb
import ollama
from chromadb.utils import embedding_functions
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# --- Configuration ---
CHROMA_PERSIST_DIR = Path(__file__).parent / "chroma_db"
COLLECTION_NAME = "nimcet_questions"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
OLLAMA_MODEL = "qwen2.5"  # Change to your specific Qwen model (e.g., qwen2.5:7b)
TOP_K = 5  # Number of relevant documents to retrieve

# --- FastAPI App ---
app = FastAPI(
    title="MCAverse RAG API",
    description="Retrieval-Augmented Generation for NIMCET exam preparation",
    version="1.0.0",
)

# CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Models ---
class QueryRequest(BaseModel):
    question: str
    subject_filter: str | None = None
    topic_filter: str | None = None
    top_k: int = TOP_K


class SourceDocument(BaseModel):
    question_id: str
    subject: str
    topic: str
    year: int
    difficulty: str
    snippet: str


class QueryResponse(BaseModel):
    answer: str
    sources: list[SourceDocument]
    model_used: str


# --- Initialize ChromaDB ---
def get_collection():
    """Get the ChromaDB collection (lazy init)."""
    if not CHROMA_PERSIST_DIR.exists():
        raise HTTPException(
            status_code=503,
            detail="Vector index not found. Run build_retrieval_system.py first.",
        )

    client = chromadb.PersistentClient(path=str(CHROMA_PERSIST_DIR))
    embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name=EMBEDDING_MODEL
    )

    try:
        return client.get_collection(
            name=COLLECTION_NAME, embedding_function=embedding_fn
        )
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Collection '{COLLECTION_NAME}' not found: {e}",
        )


# --- Prompt Template ---
SYSTEM_PROMPT = """You are an expert NIMCET exam preparation assistant for MCAverse.
Your role is to help students understand concepts, solve problems, and prepare for MCA entrance exams.

Guidelines:
- Answer based on the provided context from NIMCET question bank
- Explain concepts step-by-step, suitable for exam preparation
- Reference question IDs and years when citing specific questions
- If the context doesn't contain relevant information, say so honestly
- Use clear, concise language appropriate for competitive exam students
- For math questions, show the solution approach clearly"""

USER_PROMPT_TEMPLATE = """Student's Question: {question}

Here are relevant questions and explanations from the NIMCET question bank:

{context}

---
Based on the above context, provide a helpful and detailed answer to the student's question.
If citing specific questions, mention their ID and year."""


def build_context(results: dict) -> str:
    """Build context string from ChromaDB results."""
    context_parts = []
    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]

    for i, (doc, meta) in enumerate(zip(documents, metadatas), 1):
        q_id = meta.get("question_id", "Unknown")
        year = meta.get("year", "Unknown")
        context_parts.append(f"--- Source {i} (ID: {q_id}, Year: {year}) ---\n{doc}")

    return "\n\n".join(context_parts)


def extract_sources(results: dict) -> list[SourceDocument]:
    """Extract source document references from results."""
    sources = []
    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]

    for doc, meta in zip(documents, metadatas):
        sources.append(
            SourceDocument(
                question_id=meta.get("question_id", ""),
                subject=meta.get("subject", "Unknown"),
                topic=meta.get("topic", "Unknown"),
                year=int(meta.get("year", 0)),
                difficulty=meta.get("difficulty", "Unknown"),
                snippet=doc[:200] + "..." if len(doc) > 200 else doc,
            )
        )

    return sources


# --- Endpoints ---
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "model": OLLAMA_MODEL}


@app.post("/query", response_model=QueryResponse)
async def query(request: QueryRequest):
    """
    Main RAG endpoint:
    1. Retrieve relevant documents from ChromaDB
    2. Build prompt with context
    3. Query Ollama Qwen
    4. Return response with sources
    """
    collection = get_collection()

    # Build where filter for metadata
    where_filter = None
    conditions = []
    if request.subject_filter:
        conditions.append({"subject": request.subject_filter})
    if request.topic_filter:
        conditions.append({"topic": request.topic_filter})

    if len(conditions) == 1:
        where_filter = conditions[0]
    elif len(conditions) > 1:
        where_filter = {"$and": conditions}

    # Retrieve relevant documents
    try:
        results = collection.query(
            query_texts=[request.question],
            n_results=request.top_k,
            where=where_filter if where_filter else None,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Retrieval error: {e}")

    # Build context and sources
    context = build_context(results)
    sources = extract_sources(results)

    # Build prompt
    user_prompt = USER_PROMPT_TEMPLATE.format(
        question=request.question, context=context
    )

    # Call Ollama Qwen
    try:
        response = ollama.chat(
            model=OLLAMA_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
        )
        answer = response["message"]["content"]
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Ollama error (is '{OLLAMA_MODEL}' running?): {e}",
        )

    return QueryResponse(answer=answer, sources=sources, model_used=OLLAMA_MODEL)


@app.get("/stats")
async def stats():
    """Return index statistics."""
    collection = get_collection()
    return {
        "collection": COLLECTION_NAME,
        "total_documents": collection.count(),
        "embedding_model": EMBEDDING_MODEL,
        "llm_model": OLLAMA_MODEL,
    }
