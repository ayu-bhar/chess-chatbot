import { NextResponse } from "next/server";
import { getAnswer } from "../../../utils/rag.js";
import { rateLimit } from "../../../lib/rateLimint.js";

export async function POST(request) {
  const { query, userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: "UserId is required for rate limiting" }, { status: 400 });
  }

  if (!rateLimit(userId)) {
    return NextResponse.json({ error: "Rate limit exceeded. Max 4 requests per minute." }, { status: 429 });
  }

  const answer = await getAnswer(query);
  return NextResponse.json({ answer });
}
