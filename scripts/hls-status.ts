import { config } from "dotenv";

import { prisma } from "../lib/prisma";

config({ path: ".env", quiet: true });
config({ path: ".env.local", override: true, quiet: true });

function has360p(assetsJson: string | null) {
  if (!assetsJson) {
    return false;
  }

  try {
    const assets = JSON.parse(assetsJson) as Array<{ key?: string }>;
    return assets.some((asset) => asset.key?.includes("/360p/"));
  } catch {
    return false;
  }
}

async function main() {
  const groups = await prisma.experimentalHlsJob.groupBy({
    by: ["status"],
    _count: {
      _all: true
    }
  });
  const ready = await prisma.experimentalHlsJob.findMany({
    where: {
      status: "ready"
    },
    select: {
      videoId: true,
      assetsJson: true,
      updatedAt: true
    },
    orderBy: {
      updatedAt: "desc"
    }
  });
  const with360p = ready.filter((job) => has360p(job.assetsJson)).length;

  console.info(
    JSON.stringify(
      {
        groups,
        ready: ready.length,
        readyWith360p: with360p,
        readyMissing360p: ready.length - with360p,
        latestReady: ready.slice(0, 5).map((job) => ({
          videoId: job.videoId,
          has360p: has360p(job.assetsJson),
          updatedAt: job.updatedAt
        }))
      },
      null,
      2
    )
  );
}

main()
  .catch((error) => {
    console.error("[hls-status] failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
