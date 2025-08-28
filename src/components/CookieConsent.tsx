"use client";

import { useEffect, useState } from "react";
import PrivacyPolicyContent from "@/components/PrivacyPolicyContent";

// Helper to bind media query change listeners across browsers (modern and legacy)
function bindMediaQuery(
  mq: MediaQueryList,
  cb: (ev: { matches: boolean }) => void
): () => void {
  const handler = (e: MediaQueryListEvent) => cb(e);
  if ("addEventListener" in mq) {
    mq.addEventListener("change", handler as unknown as EventListener);
    return () => mq.removeEventListener("change", handler as unknown as EventListener);
  }
  type MediaQueryListLegacy = {
    addListener: (listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void) => void;
    removeListener: (listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void) => void;
  };
  (mq as unknown as MediaQueryListLegacy).addListener(handler);
  return () => (mq as unknown as MediaQueryListLegacy).removeListener(handler);
}

type Consent = {
  necessary: true; // always true
  analytics: boolean;
  marketing: boolean;
};

function readConsent(): Consent | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )cookie_consent=([^;]*)/);
  if (!match) return null;
  try {
    const val = JSON.parse(decodeURIComponent(match[1]));
    if (
      val &&
      typeof val === "object" &&
      val.necessary === true &&
      typeof val.analytics === "boolean" &&
      typeof val.marketing === "boolean"
    ) {
      return val as Consent;
    }
  } catch {}
  return null;
}

function writeConsent(consent: Consent) {
  if (typeof document === "undefined") return;
  const sixMonths = 60 * 60 * 24 * 30 * 6; // seconds
  document.cookie = `cookie_consent=${encodeURIComponent(
    JSON.stringify(consent)
  )}; Max-Age=${sixMonths}; Path=/; SameSite=Lax`;
}

export default function CookieConsent() {
  // Mounted: whether the drawer is rendered at all
  const [mounted, setMounted] = useState(false);
  // Show: controls the slide-in/out animation
  const [show, setShow] = useState(false);
  // Footer offset (desktop): distance from viewport bottom to place the drawer above footer
  const [footerOffset, setFooterOffset] = useState(0);
  // Whether to use footer offset (desktop/tablet); on mobile we stick to viewport bottom
  const [useFooterOffset, setUseFooterOffset] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [returnToCustomize, setReturnToCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  useEffect(() => {
    const saved = readConsent();
    if (!saved) {
      // Mount then animate open
      setMounted(true);
      // ensure next paint before animating to allow transition
      requestAnimationFrame(() => setShow(true));
    } else {
      setAnalytics(saved.analytics);
      setMarketing(saved.marketing);
    }
  }, []);

  // Measure footer height so the drawer sits above it (opens "behind" footer)
  useEffect(() => {
    function measure() {
      const el = document.querySelector('footer') as HTMLElement | null;
      setFooterOffset(el ? el.offsetHeight : 0);
    }
    measure();
    window.addEventListener('resize', measure);
    // Use ResizeObserver for dynamic footer height if available
    let ro: ResizeObserver | undefined;
    const footerEl = document.querySelector('footer') as HTMLElement | null;
    if (footerEl && 'ResizeObserver' in window) {
      ro = new ResizeObserver(() => measure());
      ro.observe(footerEl);
    }
    return () => {
      window.removeEventListener('resize', measure);
      if (ro && footerEl) ro.disconnect();
    };
  }, []);

  // Track breakpoint to decide whether to offset by footer height (>= md)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setUseFooterOffset(mq.matches);
    const cleanup = bindMediaQuery(mq, (e) => setUseFooterOffset(e.matches));
    return cleanup;
  }, []);

  function animateCloseAfter(action: () => void) {
    action();
    // start closing animation
    setShow(false);
    // unmount after transition ends (duration-200)
    setTimeout(() => setMounted(false), 220);
  }

  function acceptAll() {
    const val: Consent = { necessary: true, analytics: true, marketing: true };
    animateCloseAfter(() => writeConsent(val));
  }
  function rejectAll() {
    const val: Consent = { necessary: true, analytics: false, marketing: false };
    animateCloseAfter(() => writeConsent(val));
  }
  function savePrefs() {
    const val: Consent = { necessary: true, analytics, marketing };
    animateCloseAfter(() => writeConsent(val));
  }

  function openPolicy() {
    setReturnToCustomize(customize);
    setPolicyOpen(true);
  }
  function closePolicy() {
    setPolicyOpen(false);
    setCustomize(returnToCustomize);
  }

  // Prevent page scroll when the cookie drawer requires focus (policy or customize)
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (mounted && show && (policyOpen || customize)) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = prev || "";
    }
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [mounted, show, policyOpen, customize]);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop: only when policy or customize is open. Blur only for policy. */}
      {(policyOpen || customize) && (
        <div
          className={`fixed inset-x-0 top-0 z-30 ${policyOpen ? "backdrop-blur-sm" : ""} transition-opacity ${
            show ? "opacity-100" : "opacity-0"
          }`}
          style={{ bottom: useFooterOffset ? footerOffset : 0 }}
          onClick={policyOpen ? closePolicy : undefined}
        />
      )}
      <div className="fixed inset-x-0" style={{ bottom: useFooterOffset ? footerOffset : 0, zIndex: useFooterOffset ? 40 : 70 }}>
      <div
        className={`mx-auto max-w-none bg-brand-grey-tiles shadow-[0_-10px_10px_rgba(0,0,0,0.15)] transform transition-transform duration-200 ${
          show ? "translate-y-0" : "translate-y-full"
        } ${policyOpen ? "h-[80vh] max-h-[80vh]" : ""}`}
      >
        <div className={`content py-4 ${policyOpen ? "h-[80vh] max-h-[80vh]" : ""}`}>
          {policyOpen ? (
            <div className="relative flex h-full flex-col">
              <div className="flex items-start justify-between">
                <h2 className="text-base font-semibold text-brand-text">Privacy Policy</h2>
                <button
                  aria-label="Close privacy policy"
                  onClick={closePolicy}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md text-brand-text hover:bg-brand-grey-tiles focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                >
                  <span className="relative block h-4 w-4" aria-hidden>
                    <span className="absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 rotate-45 bg-current" />
                    <span className="absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 -rotate-45 bg-current" />
                  </span>
                </button>
              </div>
              <div className="mt-3 min-h-0 flex-1 overflow-auto pr-1">
                <PrivacyPolicyContent />
              </div>
            </div>
          ) : !customize ? (
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-brand-text/80 md:max-w-3xl">
                <p>
                  We use cookies to enhance your experience, analyze usage, and
                  provide tailored content. You can accept all, reject
                  non-essential, or manage your preferences.
                </p>
                <p className="mt-2">
                  See our
                  <button
                    type="button"
                    onClick={openPolicy}
                    className="ml-1 underline underline-offset-2 hover:no-underline"
                  >
                    Privacy Policy
                  </button>{" "}
                  for details.
                </p>
              </div>
              <div className="flex flex-row flex-wrap items-center justify-center gap-2 sm:flex-nowrap md:justify-start">
                <button
                  onClick={rejectAll}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-brand-primary bg-transparent px-4 py-2 text-sm font-medium text-brand-primary"
                >
                  Reject all
                </button>
                <button
                  onClick={() => setCustomize(true)}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-brand-text hover:underline"
                >
                  Custom
                </button>
                <button
                  onClick={acceptAll}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-white"
                >
                  Accept all
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h2 className="text-base font-semibold text-brand-text">Cookie preferences</h2>
                <button
                  onClick={() => setCustomize(false)}
                  className="text-xs text-brand-text/70 hover:text-brand-text focus:outline-none"
                >
                  &lt; Back
                </button>
              </div>
              <div className="grid gap-3">
                <CategoryRow
                  title="Strictly necessary"
                  description="Required for basic site functionality."
                  locked
                  value
                  onChange={() => {}}
                />
                <CategoryRow
                  title="Analytics"
                  description="Helps us understand usage to improve the site."
                  value={analytics}
                  onChange={setAnalytics}
                />
                <CategoryRow
                  title="Marketing"
                  description="Used to deliver more relevant ads and content."
                  value={marketing}
                  onChange={setMarketing}
                />
              </div>
              <div className="flex flex-row flex-wrap items-center justify-center gap-2 sm:flex-nowrap sm:justify-end">
                <button
                  onClick={rejectAll}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-brand-primary bg-transparent px-4 py-2 text-sm font-medium text-brand-primary"
                >
                  Reject all
                </button>
                <button
                  onClick={acceptAll}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-white"
                >
                  Accept all
                </button>
                <button
                  onClick={savePrefs}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-brand-text hover:underline"
                >
                  Save preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}

function CategoryRow({
  title,
  description,
  locked,
  value,
  onChange,
}: {
  title: string;
  description: string;
  locked?: boolean;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white p-3 ring-1 ring-brand-muted">
      <div className="pr-3">
        <p className="text-sm font-medium text-brand-text">{title}</p>
        <p className="text-xs text-brand-text/70">{description}</p>
      </div>
      <div>
        {locked ? (
          <span className="text-xs text-brand-text/50">Always on</span>
        ) : (
          <button
            type="button"
            aria-pressed={value}
            onClick={() => onChange(!value)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              value ? "bg-brand-primary" : "bg-brand-muted"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                value ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        )}
      </div>
    </div>
  );
}
