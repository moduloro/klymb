import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export type HomeContent = {
  hero: { title: string; subtitle: string; cta1: string; cta2: string };
  tiles: {
    seekers: { title: string; bullets: string[] };
    employers: { title: string; bullets: string[] };
  };
};

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

function deepMerge<T>(base: T, patch: DeepPartial<T>): T {
  const out: any = Array.isArray(base) ? [...(base as any)] : { ...(base as any) };
  for (const [k, v] of Object.entries(patch ?? {})) {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      out[k] = deepMerge((out[k] ?? {}) as any, v as any);
    } else if (v !== undefined) {
      out[k] = v;
    }
  }
  return out as T;
}

async function readJSON<T>(p: string): Promise<T | null> {
  try {
    const fp = resolve(process.cwd(), p);
    const raw = await readFile(fp, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function getHomeContent(cc: string, lang: string): Promise<HomeContent> {
  // Fallback order: cc/lang -> cc/en -> US/en
  const rel = (a: string, b: string) => `src/content/${a}/${b}/home.json`;
  const master = (await readJSON<HomeContent>(rel("US", "en")))!;
  const ccEn = await readJSON<DeepPartial<HomeContent>>(rel(cc, "en"));
  const ccLang = await readJSON<DeepPartial<HomeContent>>(rel(cc, lang));
  let merged = master;
  if (ccEn) merged = deepMerge(merged, ccEn);
  if (ccLang) merged = deepMerge(merged, ccLang);
  return merged;
}

