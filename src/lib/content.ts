import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export type HomeContent = {
  hero: { title: string; subtitle: string; cta1: string; cta2: string };
  tiles: {
    seekers: { title: string; bullets: string[] };
    employers: { title: string; bullets: string[] };
  };
  values?: { title: string; body: string };
};

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepMerge<T>(base: T, patch: DeepPartial<T>): T {
  // Replace arrays wholesale when provided in patch
  if (Array.isArray(patch)) return patch as unknown as T;
  if (!isPlainObject(base)) return (patch as T) ?? base;
  if (!isPlainObject(patch)) return base;

  const result: Record<string, unknown> = { ...(base as unknown as Record<string, unknown>) };
  const patchObj = patch as unknown as Record<string, unknown>;
  for (const [k, v] of Object.entries(patchObj)) {
    if (v === undefined) continue;
    const baseVal = (base as unknown as Record<string, unknown>)[k];
    if (isPlainObject(v) && isPlainObject(baseVal)) {
      result[k] = deepMerge(baseVal, v as unknown as DeepPartial<unknown>) as unknown;
    } else {
      result[k] = v as unknown;
    }
  }
  return result as T;
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

export type CommonContent = {
  nav: {
    seekers: string;
    employers: string;
    insights: string;
    about: string;
  };
  footer: {
    about: string;
    contact: string;
    privacy: string;
  };
};

export async function getCommonContent(cc: string, lang: string): Promise<CommonContent> {
  const rel = (a: string, b: string) => `src/content/${a}/${b}/common.json`;
  const master = (await readJSON<CommonContent>(rel("US", "en")))!;
  const ccEn = await readJSON<DeepPartial<CommonContent>>(rel(cc, "en"));
  const ccLang = await readJSON<DeepPartial<CommonContent>>(rel(cc, lang));
  let merged = master;
  if (ccEn) merged = deepMerge(merged, ccEn);
  if (ccLang) merged = deepMerge(merged, ccLang);
  return merged;
}
