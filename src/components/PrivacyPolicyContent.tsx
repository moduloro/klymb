export default function PrivacyPolicyContent() {
  return (
    <div className="prose prose-sm max-w-none text-brand-text">
      <h1 className="text-xl font-semibold">Privacy Policy</h1>
      <p className="text-brand-text/80">Last updated: {new Date().toLocaleDateString()}</p>

      <p>
        We value your privacy. This policy explains what personal data we
        collect, how we use it, and your rights under GDPR.
      </p>

      <h2 className="text-lg font-semibold">Data Controller</h2>
      <p>
        Klymb is the data controller responsible for your personal data. Contact
        us at privacy@klymb.work regarding any questions or requests.
      </p>

      <h2 className="text-lg font-semibold">What We Collect</h2>
      <ul className="list-disc pl-5">
        <li>Account data: name, email (when you sign in).</li>
        <li>Usage data: pages viewed, interactions, approximate location.</li>
        <li>Cookies: necessary, analytics (optional), and marketing (optional).</li>
      </ul>

      <h2 className="text-lg font-semibold">Why We Use Your Data</h2>
      <ul className="list-disc pl-5">
        <li>Provide and improve our services.</li>
        <li>Authenticate users and prevent fraud.</li>
        <li>Analyze site performance (with consent).</li>
        <li>Personalize content/marketing (with consent).</li>
      </ul>

      <h2 className="text-lg font-semibold">Legal Bases</h2>
      <ul className="list-disc pl-5">
        <li>Contract (to deliver the service you request).</li>
        <li>Legitimate interests (to run and protect our services).</li>
        <li>Consent (for analytics and marketing cookies).</li>
      </ul>

      <h2 className="text-lg font-semibold">Data Sharing</h2>
      <p>
        We may share data with trusted processors (e.g., hosting, analytics)
        under data processing agreements. We do not sell personal data.
      </p>

      <h2 className="text-lg font-semibold">Retention</h2>
      <p>
        We keep personal data only as long as necessary for the purposes stated
        or as required by law.
      </p>

      <h2 className="text-lg font-semibold">Your Rights (GDPR)</h2>
      <ul className="list-disc pl-5">
        <li>Access, rectification, erasure, restriction, and portability.</li>
        <li>Object to processing based on legitimate interests.</li>
        <li>Withdraw consent at any time (affects future processing only).</li>
        <li>Lodge a complaint with your supervisory authority.</li>
      </ul>

      <h2 className="text-lg font-semibold">Cookies</h2>
      <p>
        Necessary cookies enable core functionality and cannot be disabled.
        Analytics and marketing cookies are optional and used only with your
        consent. You can manage your preferences in the cookie drawer.
      </p>

      <h2 className="text-lg font-semibold">Contact</h2>
      <p>privacy@klymb.work</p>
    </div>
  );
}

