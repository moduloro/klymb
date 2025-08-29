import { NextResponse } from "next/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const dynamic = "force-dynamic";

function readBuildId(): string | null {
  try {
    const p = join(process.cwd(), ".next", "BUILD_ID");
    const id = readFileSync(p, "utf8").trim();
    return id || null;
  } catch {
    return null;
  }
}

export async function GET() {
  const commit =
    process.env.RENDER_GIT_COMMIT ||
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.GITHUB_SHA ||
    null;
  const buildId = readBuildId();
  const version = {
    commit,
    buildId,
    // Optional fields to aid debugging
    service: process.env.RENDER_SERVICE_ID || null,
    time: new Date().toISOString(),
  };
  return NextResponse.json(version, { headers: { "Cache-Control": "no-cache" } });
}

