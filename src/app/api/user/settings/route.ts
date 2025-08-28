import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { saveUserSettings, getUserSettings } from "@/lib/userSettings";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { cc, lang } = await req.json().catch(() => ({} as any));
  const country = typeof cc === "string" ? cc.toUpperCase() : undefined;
  const language = typeof lang === "string" ? lang.toLowerCase() : undefined;
  if (!country || !language) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  await saveUserSettings(session.user.email, country, language);
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ cc: null, lang: null }, { status: 200 });
  }
  const settings = await getUserSettings(session.user.email);
  if (!settings) return NextResponse.json({ cc: null, lang: null }, { status: 200 });
  return NextResponse.json({ cc: settings.country, lang: settings.language }, { status: 200 });
}
