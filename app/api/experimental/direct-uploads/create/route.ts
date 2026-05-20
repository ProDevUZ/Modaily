import { NextResponse } from "next/server";

import { assertDirectUploadRequestAllowed, createDirectUploadSession } from "@/lib/direct-uploads/server";
import type { DirectUploadCreateRequest } from "@/lib/direct-uploads/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseBody(body: unknown): DirectUploadCreateRequest | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const payload = body as Record<string, unknown>;
  const kind = typeof payload.kind === "string" ? payload.kind.trim() : "";
  const filename = typeof payload.filename === "string" ? payload.filename.trim() : "";
  const contentType = typeof payload.contentType === "string" ? payload.contentType.trim() : "";
  const size = typeof payload.size === "number" ? payload.size : Number(payload.size);

  if (!kind || !filename || !contentType || !Number.isFinite(size)) {
    return null;
  }

  return {
    kind: kind as DirectUploadCreateRequest["kind"],
    filename,
    contentType,
    size
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

  let payload: DirectUploadCreateRequest | null = null;

  try {
    payload = parseBody(await request.json());
  } catch {
    return NextResponse.json({ error: "Request body must be JSON." }, { status: 400 });
  }

  if (!payload) {
    return NextResponse.json({ error: "kind, filename, contentType and size are required." }, { status: 400 });
  }

  try {
    const response = await createDirectUploadSession(payload);
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Direct upload session creation failed."
      },
      { status: 400 }
    );
  }
}
