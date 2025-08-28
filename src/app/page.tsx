import Image from "next/image";

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section
        className="bg-brand-primary text-white"
        /* To use a background image later: add 'bg-cover bg-center' and style={{ backgroundImage: "url('/path/to/image.jpg')" }} */
      >
        <div className="content py-16 sm:py-24 text-white">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl text-center sm:text-center">
              Your Career Agent,<br /> always by your side.
            </h1>
            <p className="mt-4 text-base leading-7 text-white/90 sm:text-lg text-center sm:text-center">
              We guide people and teams through the moments that matter – with clarity,
              empathy, and practical support, so you can move forward with confidence.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row justify-center">
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand-primary shadow-sm transition hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                I’m looking for a job
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-full border border-white px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Grow the best team
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
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-6 bg-brand-grey-tiles">
                <h2 className="text-xl font-semibold text-brand-text">For Job Seekers</h2>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-brand-text/80">
                  <li>Guidance tailored to your goals</li>
                  <li>Less stress through each step</li>
                  <li>Confidence in every application</li>
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
                  src="/images/corp-hr4.jpg"
                  alt="For Employers"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 bg-brand-grey-tiles">
                <h2 className="text-xl font-semibold text-brand-text">For Employers</h2>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-brand-text/80">
                  <li>Faster hiring with better fit</li>
                  <li>Lower cost through smart pipelines</li>
                  <li>Retention from day one</li>
                </ul>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Shared Values */}
      <section className="mt-12 bg-white">
        <div className="content">
          <h3 className="text-2xl font-semibold text-brand-text">Work is about people.</h3>
          <p className="mt-3 text-brand-text/80">
            We believe careers and companies flourish when people feel supported.
            That’s why we focus on the human experience behind every role and every hire.
          </p>
        </div>
      </section>
    </main>
  );
}
