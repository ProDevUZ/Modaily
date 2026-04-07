import { open, stat } from "fs/promises";
import { NextResponse } from "next/server";

import { getGalleryVideoContentType, getGalleryVideoPath, sanitizeGalleryVideoFilename } from "@/lib/gallery-video-storage";

function parseRangeHeader(rangeHeader: string, fileSize: number) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader);

  if (!match) {
    return null;
  }

  const [, startText, endText] = match;
  let start = startText ? Number.parseInt(startText, 10) : NaN;
  let end = endText ? Number.parseInt(endText, 10) : NaN;

  if (Number.isNaN(start) && Number.isNaN(end)) {
    return null;
  }

  if (Number.isNaN(start)) {
    const suffixLength = end;
    start = Math.max(fileSize - suffixLength, 0);
    end = fileSize - 1;
  } else if (Number.isNaN(end)) {
    end = fileSize - 1;
  }

  if (start < 0 || end < start || start >= fileSize) {
    return null;
  }

  return {
    start,
    end: Math.min(end, fileSize - 1)
  };
}

export async function GET(request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  const safeFilename = sanitizeGalleryVideoFilename(filename);

  if (!safeFilename) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const filePath = getGalleryVideoPath(safeFilename);
    const fileStat = await stat(filePath);
    const contentType = getGalleryVideoContentType(safeFilename);
    const rangeHeader = request.headers.get("range");

    if (!rangeHeader) {
      const fileHandle = await open(filePath, "r");
      const buffer = Buffer.alloc(fileStat.size);
      await fileHandle.read(buffer, 0, fileStat.size, 0);
      await fileHandle.close();

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Length": String(fileStat.size),
          "Accept-Ranges": "bytes",
          "Cache-Control": "public, max-age=31536000, immutable"
        }
      });
    }

    const parsedRange = parseRangeHeader(rangeHeader, fileStat.size);

    if (!parsedRange) {
      return new NextResponse("Requested range not satisfiable", {
        status: 416,
        headers: {
          "Content-Range": `bytes */${fileStat.size}`,
          "Accept-Ranges": "bytes"
        }
      });
    }

    const { start, end } = parsedRange;
    const chunkSize = end - start + 1;
    const fileHandle = await open(filePath, "r");
    const buffer = Buffer.alloc(chunkSize);
    await fileHandle.read(buffer, 0, chunkSize, start);
    await fileHandle.close();

    return new NextResponse(buffer, {
      status: 206,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(chunkSize),
        "Content-Range": `bytes ${start}-${end}/${fileStat.size}`,
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
