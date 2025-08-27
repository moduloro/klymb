export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section
        className="bg-brand-primary text-white"
        /* To use a background image later: add 'bg-cover bg-center' and style={{ backgroundImage: "url('/path/to/image.jpg')" }} */
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl text-center sm:text-left">
              Your Career Agent, always by your side.
            </h1>
            <p className="mt-4 text-base leading-7 text-white/90 sm:text-lg text-center sm:text-left">
              We guide people and teams through the moments that matter – with clarity,
              empathy, and practical support, so you can move forward with confidence.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center justify-center sm:justify-start">
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-brand-primary shadow-sm transition hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                I’m looking for a job
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-md border border-white px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                I need talent
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Audience cards */}
      <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-brand-muted bg-white p-6 shadow-sm/0 transition hover:shadow-md">
            <h2 className="text-xl font-semibold text-brand-text">For Job Seekers</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-brand-text/80">
              <li>Guidance tailored to your goals</li>
              <li>Less stress through each step</li>
              <li>Confidence in every application</li>
            </ul>
          </div>
          <div className="rounded-xl border border-brand-muted bg-white p-6 shadow-sm/0 transition hover:shadow-md">
            <h2 className="text-xl font-semibold text-brand-text">For Employers</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-brand-text/80">
              <li>Faster hiring with better fit</li>
              <li>Lower cost through smart pipelines</li>
              <li>Retention from day one</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Shared Values */}
      <section className="mx-auto mt-12 max-w-5xl px-4 sm:px-6">
        <h3 className="text-2xl font-semibold text-brand-text">Work is about people.</h3>
        <p className="mt-3 text-brand-text/80">
          We believe careers and companies flourish when people feel supported.
          That’s why we focus on the human experience behind every role and every hire.
        </p>
      </section>
    </main>
  );
}
