import { NextResponse } from "next/server";

import { assertDirectUploadRequestAllowed, completeDirectUploadSession } from "@/lib/direct-uploads/server";
import type { DirectUploadCompleteRequest } from "@/lib/direct-uploads/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseBody(body: unknown): DirectUploadCompleteRequest | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const payload = body as Record<string, unknown>;
  const uploadId = typeof payload.uploadId === "string" ? payload.uploadId.trim() : "";
  const uploadToken = typeof payload.uploadToken === "string" ? payload.uploadToken.trim() : "";

  if (!uploadId || !uploadToken) {
    return null;
  }

  return {
    uploadId,
    uploadToken
  };
}

export async function POST(request: Request) {
  try {
    assertDirectUploadRequestAllowed(request);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Direct uploads are not allowed."
      },
      { status: 403 }
    );
  }

  let payload: DirectUploadCompleteRequest | null = null;

  try {
    payload = parseBody(await request.json());
  } catch {
    return NextResponse.json({ error: "Request body must be JSON." }, { status: 400 });
  }

  if (!payload) {
    return NextResponse.json({ error: "uploadId and uploadToken are required." }, { status: 400 });
  }

  try {
    const response = await completeDirectUploadSession(payload);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Direct upload completion failed."
      },
      { status: 400 }
    );
  }
}
