# MCAverse RAG System

A local Retrieval-Augmented Generation (RAG) pipeline for the MCAverse AI Study Buddy. Uses ChromaDB for vector storage and Ollama Qwen for AI responses.

## Prerequisites

- Python 3.10+
- [Ollama](https://ollama.ai/) installed and running
- Qwen model pulled: `ollama pull qwen2.5`

## Setup

```bash
cd rag/

# Install Python dependencies
pip install -r requirements.txt

# Build the vector index (one-time, ~5-10 min)
python build_retrieval_system.py

# Start the retrieval server
uvicorn retrieval_server:app --port 8000 --reload
```

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│  Next.js App    │────▶│  FastAPI Server   │────▶│  ChromaDB   │
│  /api/ai-asst   │     │  (port 8000)      │     │  (vectors)  │
└─────────────────┘     └────────┬───────────┘     └─────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │  Ollama Qwen    │
                        │  (local LLM)    │
                        └─────────────────┘
```

## Files

| File | Purpose |
|------|---------|
| `build_retrieval_system.py` | One-time script to index all 5,384 NIMCET questions into ChromaDB |
| `retrieval_server.py` | FastAPI server with `/query`, `/health`, and `/stats` endpoints |
| `requirements.txt` | Python dependencies |
| `chroma_db/` | Generated vector store (gitignored) |

## API Endpoints

### `POST /query`
```json
{
  "question": "Explain virtual memory paging",
  "subject_filter": "Computer Awareness",
  "topic_filter": null,
  "top_k": 5
}
```

### `GET /health`
Returns server status and model info.

### `GET /stats`
Returns index statistics (document count, models used).

## Configuration

Edit the constants at the top of `retrieval_server.py`:

- `OLLAMA_MODEL` — Change to match your Qwen model (e.g., `qwen2.5:7b`, `qwen2.5:14b`)
- `TOP_K` — Number of retrieved documents (default: 5)
- `EMBEDDING_MODEL` — Sentence transformer model for embeddings

## Environment Variables (Next.js)

Add to `.env.local`:
```
RAG_SERVER_URL=http://localhost:8000
```
