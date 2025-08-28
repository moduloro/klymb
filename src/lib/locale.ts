import { cookies } from "next/headers";

export type Audience = { cc: string; lang: string };

// Resolve audience from (in order): explicit params -> cookies -> defaults
export async function resolveAudience(params?: { cc?: string | null; lang?: string | null }): Promise<Audience> {
  const c = await cookies();
  const cc = (params?.cc ?? c.get("cc")?.value ?? "US").toUpperCase();
  const lang = (params?.lang ?? c.get("lang")?.value ?? "en").toLowerCase();
  return { cc, lang };
}
