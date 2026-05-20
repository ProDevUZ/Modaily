import { NextResponse } from "next/server";

export function getHlsExperimentToken() {
  return process.env.HLS_EXPERIMENT_TOKEN?.trim() || null;
}

export function verifyHlsExperimentRequest(request: Request) {
  const expectedToken = getHlsExperimentToken();

  if (!expectedToken) {
    return NextResponse.json(
      {
        error: "HLS_EXPERIMENT_TOKEN is required before using the experimental HLS API."
      },
      { status: 503 }
    );
  }

  const actualToken = request.headers.get("x-hls-experiment-token")?.trim();

  if (actualToken !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized experimental HLS request." }, { status: 401 });
  }

  return null;
}
