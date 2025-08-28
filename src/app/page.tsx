import Image from "next/image";
import HeroLava from "@/components/HeroLava";
import { resolveAudience } from "@/lib/locale";
import { getHomeContent } from "@/lib/content";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserSettings } from "@/lib/userSettings";

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: Promise<{ cc?: string; lang?: string }> }) {
  const sp = await searchParams;
  let audience = await resolveAudience({ cc: sp?.cc ?? null, lang: sp?.lang ?? null });
  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    const settings = await getUserSettings(session.user.email);
    if (settings) {
      audience = { cc: settings.country, lang: settings.language };
    }
  }
  const content = await getHomeContent(audience.cc, audience.lang);
  return (
    <main>
      {/* Hero */}
      <section
        className="relative text-white overflow-hidden"
        /* Animated gradient background replaces solid color */
        style={{ backgroundColor: "var(--brand-primary)" }}
      >
        {/* Animated lava-lamp gradient background (client-rendered for randomness) */}
        <HeroLava />
        <div className="relative z-10 content py-16 sm:py-24 text-white">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl text-center sm:text-center">
              {content.hero.title}
            </h1>
            <p className="mt-4 text-base leading-7 text-white/90 sm:text-lg text-center sm:text-center">
              {content.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row justify-center">
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand-primary shadow-sm transition hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {content.hero.cta1}
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-full border border-white px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {content.hero.cta2}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Audience tiles */}
      <section className="mt-12 bg-white">
        <div className="content">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <a
              href="#"
              className="group block overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              aria-label="For Job Seekers"
            >
              <div className="relative h-40 w-full overflow-hidden md:h-48">
                <Image
                  src="/images/youngwoman_laptop2.jpg"
                  alt="For Job Seekers"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-6 bg-brand-grey-tiles">
                <h2 className="text-xl font-semibold text-brand-text">{content.tiles.seekers.title}</h2>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-brand-text/80">
                  {content.tiles.seekers.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            </a>

            <a
              href="#"
              className="group block overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              aria-label="For Employers"
            >
              <div className="relative h-40 w-full overflow-hidden md:h-48">
                <Image
                  src="/images/corp-hr3.jpg"
                  alt="For Employers"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6 bg-brand-grey-tiles">
                <h2 className="text-xl font-semibold text-brand-text">{content.tiles.employers.title}</h2>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-brand-text/80">
                  {content.tiles.employers.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Shared Values */}
      <section className="mt-12 bg-white">
        <div className="content">
          {content.values ? (
            <>
              <h3 className="text-2xl font-semibold text-brand-text">{content.values.title}</h3>
              <p className="mt-3 text-brand-text/80">{content.values.body}</p>
            </>
          ) : (
            <>
              <h3 className="text-2xl font-semibold text-brand-text">Work is about people.</h3>
              <p className="mt-3 text-brand-text/80">
                We believe careers and companies flourish when people feel supported.
                That’s why we focus on the human experience behind every role and every hire.
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
