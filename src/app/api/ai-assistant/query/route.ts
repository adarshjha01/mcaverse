import { NextRequest, NextResponse } from "next/server";

const RAG_SERVER_URL = process.env.RAG_SERVER_URL || "http://localhost:8000";
const ALLOWED_HOSTS = ["localhost", "127.0.0.1"];

interface QueryRequestBody {
  question: string;
  subject_filter?: string;
  topic_filter?: string;
  top_k?: number;
}

export async function POST(request: NextRequest) {
  try {
    // Validate RAG server URL to prevent SSRF
    const url = new URL(RAG_SERVER_URL);
    if (!ALLOWED_HOSTS.includes(url.hostname)) {
      return NextResponse.json(
        { error: "Invalid RAG server configuration" },
        { status: 500 }
      );
    }

    const body: QueryRequestBody = await request.json();

    if (!body.question || body.question.trim().length === 0) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${RAG_SERVER_URL}/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: body.question.trim(),
        subject_filter: body.subject_filter || null,
        topic_filter: body.topic_filter || null,
        top_k: body.top_k || 5,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          error:
            errorData.detail ||
            "AI assistant is currently unavailable. Please try again later.",
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("AI Assistant query error:", error);
    return NextResponse.json(
      {
        error:
          "Unable to connect to the AI assistant. Make sure the RAG server is running (uvicorn retrieval_server:app --port 8000).",
      },
      { status: 503 }
    );
  }
}
