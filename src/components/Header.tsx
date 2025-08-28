"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profilePage, setProfilePage] = useState<"overview" | "account">("overview");
  const [localeOpen, setLocaleOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const localeRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  function getCookie(name: string) {
    if (typeof document === "undefined") return null;
    const m = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\/\+^])/g, "\\$1") + "=([^;]*)"));
    return m ? decodeURIComponent(m[1]) : null;
  }
  const [currentCc, setCurrentCc] = useState<string>(((searchParams.get("cc") ?? getCookie("cc") ?? "US")).toUpperCase());
  const [currentLang, setCurrentLang] = useState<string>(((searchParams.get("lang") ?? getCookie("lang") ?? "en")).toLowerCase());
  // Keep flag state in sync when URL query changes (guest flow) or cookies change
  useEffect(() => {
    const spCc = ((searchParams.get("cc") ?? getCookie("cc") ?? "US")).toUpperCase();
    const spLang = ((searchParams.get("lang") ?? getCookie("lang") ?? "en")).toLowerCase();
    setCurrentCc(spCc);
    setCurrentLang(spLang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.toString()]);
  useEffect(() => {
    setMounted(true);
  }, []);
  const appliedDbLocaleRef = useRef(false);
  useEffect(() => {
    // After sign-in, always mirror DB settings to cookies/state and normalize URL
    if (session && !appliedDbLocaleRef.current) {
      appliedDbLocaleRef.current = true;
      fetch("/api/user/settings")
        .then((r) => r.json())
        .then((j: { cc: string | null; lang: string | null }) => {
          if (j?.cc && j?.lang) {
            const maxAge = 60 * 60 * 24 * 180; // ~6 months
            document.cookie = `cc=${j.cc}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
            document.cookie = `lang=${j.lang}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
            setCurrentCc(j.cc.toUpperCase());
            setCurrentLang(j.lang.toLowerCase());
            // Clear any stale query params so header/content remain consistent
            router.replace("/");
          }
        })
        .catch(() => {});
    }
  }, [session, router]);
  const flagSrc = currentCc === "DE" ? "/flags/de.svg" : currentCc === "UK" ? "/flags/uk.svg" : "/flags/us.svg";
  function closeProfileDrawer() {
    setProfileOpen(false);
    setProfilePage("overview");
  }
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setProfileOpen(false);
        setLocaleOpen(false);
      }
    }
    function onClick(e: MouseEvent) {
      const target = e.target as Node;
      const panel = profileRef.current;
      const button = profileButtonRef.current;
      if (!panel) return;
      // Ignore clicks inside the panel or on the profile toggle button
      if (panel.contains(target)) return;
      if (button && button.contains(target)) return;
      closeProfileDrawer();
    }
    if (profileOpen) {
      document.addEventListener("keydown", onKey);
      document.addEventListener("mousedown", onClick);
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [profileOpen]);

  // Close locale dropdown on outside click
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLocaleOpen(false);
    }
    function onClick(e: MouseEvent) {
      const el = localeRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setLocaleOpen(false);
    }
    if (localeOpen) {
      document.addEventListener("keydown", onKey);
      document.addEventListener("mousedown", onClick);
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [localeOpen]);

  // Block background scroll when any header drawer is open
  useEffect(() => {
    if (open || profileOpen || localeOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => document.body.classList.remove("no-scroll");
  }, [open, profileOpen, localeOpen]);

  // Toggle subtle drop shadow when page is scrolled behind the fixed header
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ensure drawers are mutually exclusive
  useEffect(() => {
    if (open) setProfileOpen(false);
    if (open) setLocaleOpen(false);
  }, [open]);
  useEffect(() => {
    if (profileOpen) setOpen(false);
    if (profileOpen) setLocaleOpen(false);
  }, [profileOpen]);
  useEffect(() => {
    if (localeOpen) setOpen(false);
    if (localeOpen) setProfileOpen(false);
  }, [localeOpen]);

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-[60] bg-brand-grey-tiles transition-shadow duration-200 ${
        scrolled ? "shadow-[0_5px_5px_rgba(0,0,0,0.15)]" : ""
      }`}
    >
      <div className="content h-14 flex items-center gap-4">
        {/* Left: Logo */}
        <div className="shrink-0">
          <Link href="/" className="text-xl font-bold tracking-tight text-brand-text">
            klymb
          </Link>
        </div>

        {/* Center/Right: Nav */}
        <nav className="ml-2 hidden items-center gap-6 text-sm text-brand-text/80 md:flex relative top-[2px]">
          <Link href="#" className="hover:text-brand-text focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded">
            For Job Seekers
          </Link>
          <Link href="#" className="hover:text-brand-text focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded">
            For Employers
          </Link>
          <Link href="#" className="hover:text-brand-text focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded">
            Insights & Resources
          </Link>
          <Link href="#" className="hover:text-brand-text focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded">
            About
          </Link>
        </nav>

        {/* Right: Auth + Mobile toggle */}
        <div className="ml-auto flex items-center gap-3">
          {/* Country flag selector */}
          <div className="relative" ref={localeRef}>
            <button
              type="button"
              aria-label="Select region and language"
              aria-expanded={localeOpen}
              onClick={() => setLocaleOpen((v) => !v)}
              className="inline-flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary h-6 w-6 overflow-hidden relative top-[1px]"
            >
              <span suppressHydrationWarning>
                {mounted ? (
                  <Image src={flagSrc} alt={`${currentCc}-${currentLang}`} width={19} height={19} className="block h-[19px] w-[19px] rounded-full object-cover" />
                ) : (
                  <span className="block h-[19px] w-[19px] rounded-full bg-brand-muted" aria-hidden />
                )}
              </span>
            </button>
            {/* Dropdown */}
            <div className={`absolute right-0 mt-2 w-64 rounded-md bg-white shadow-lg ring-1 ring-brand-muted transition ${localeOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
              <div className="py-2 text-sm text-brand-text">
                {[
                  { cc: "US", lang: "en", label: "United States — English", flag: "/flags/us.svg" },
                  { cc: "UK", lang: "en", label: "United Kingdom — English", flag: "/flags/uk.svg" },
                  { cc: "DE", lang: "de", label: "Deutschland — Deutsch", flag: "/flags/de.svg" },
                ].map((opt) => (
                  <button
                    key={`${opt.cc}-${opt.lang}`}
                    onClick={async () => {
                      // If signed-in, persist server-side via API; else cookies
                      try {
                        if (session?.user?.email) {
                          await fetch("/api/user/settings", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ cc: opt.cc, lang: opt.lang }),
                          });
                          // Also mirror to cookies so client header stays in sync
                          const maxAge = 60 * 60 * 24 * 180; // ~6 months
                          document.cookie = `cc=${opt.cc}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
                          document.cookie = `lang=${opt.lang}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
                        } else {
                          const maxAge = 60 * 60 * 24 * 180; // ~6 months
                          document.cookie = `cc=${opt.cc}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
                          document.cookie = `lang=${opt.lang}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
                          // Update local state immediately for guest flow
                          setCurrentCc(opt.cc.toUpperCase());
                          setCurrentLang(opt.lang.toLowerCase());
                        }
                      } catch {}
                      const params = new URLSearchParams(Array.from(searchParams?.entries() ?? []));
                      params.set("cc", opt.cc);
                      params.set("lang", opt.lang);
                      router.push(`/?${params.toString()}`);
                      setLocaleOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 hover:bg-brand-grey-tiles text-left"
                  >
                    <Image src={opt.flag} alt="" width={20} height={20} className="h-5 w-5 rounded-full" />
                    <span>{opt.label}</span>
                    {mounted && currentCc === opt.cc && currentLang === opt.lang && (
                      <span className="ml-auto text-xs text-brand-text/60">Current</span>
                    )}
                  </button>
                ))}
                <div className="px-3 pt-1 text-xs text-brand-text/60">Note: EN content differs by country.</div>
              </div>
            </div>
          </div>
          {/* User avatar button opens profile drawer */}
          <button
            ref={profileButtonRef}
            type="button"
            aria-label={profileOpen ? "Close profile" : "Open profile"}
            aria-expanded={profileOpen}
            onClick={() => {
              // Toggle drawer; reset subpage to overview when opening
              setProfileOpen((v) => {
                if (v) return false;
                setProfilePage("overview");
                return true;
              });
              // Close other drawers
              setOpen(false);
            }}
            className="inline-flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary relative -top-[1px]"
          >
            <span className="relative block h-6 w-6 pointer-events-none">
              {/* User icon fades out when drawer is open */}
              <Image
                src="/images/user-outline.svg"
                alt="Profile"
                width={24}
                height={24}
                className={`absolute inset-0 h-6 w-6 transition-opacity duration-200 ${profileOpen ? "opacity-0" : "opacity-100"}`}
              />
              {/* X icon fades in and is drawn with two bars, similar to hamburger morph */}
              <span
                aria-hidden
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${profileOpen ? "opacity-100" : "opacity-0"}`}
              >
                <span
                  className={`absolute left-1 top-1/2 h-0.5 w-4 -translate-y-1/2 bg-current transition-transform duration-200 ${profileOpen ? "rotate-45" : "rotate-0"}`}
                />
                <span
                  className={`absolute left-1 top-1/2 h-0.5 w-4 -translate-y-1/2 bg-current transition-transform duration-200 ${profileOpen ? "-rotate-45" : "rotate-0"}`}
                />
              </span>
            </span>
          </button>
          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => {
              // Close other drawers and toggle mobile menu
              setProfileOpen(false);
              setOpen((v) => !v);
            }}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-brand-text focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <span className="relative block h-4 w-4">
              <span
                className={`absolute left-0 top-0 h-0.5 w-4 bg-current transition-transform duration-200 ${open ? "translate-y-1.5 rotate-45" : ""}`}
              />
              <span
                className={`absolute left-0 top-1.5 h-0.5 w-4 bg-current transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`}
              />
              <span
                className={`absolute left-0 top-3 h-0.5 w-4 bg-current transition-transform duration-200 ${open ? "-translate-y-1.5 -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>
      
    </header>
    {/* Mobile top drawer (moved outside header for smoothness) */}
    <div className={`md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      {/* Backdrop below header */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-x-0 top-14 bottom-0 z-30 bg-white/0 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
      />
      {/* Panel from top */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        className={`fixed left-0 right-0 top-14 z-40 h-[56vh] max-h-[56vh] transform bg-brand-grey-tiles transition-transform duration-200 shadow-[0_10px_10px_rgba(0,0,0,0.15)] ${open ? "translate-y-0" : "-translate-y-[100vh]"}`}
      >
        <div className="h-full overflow-auto">
          <div className="content py-4">
            <nav className="flex flex-col gap-1 text-brand-text">
              <Link href="#" className="rounded px-2 py-2 hover:bg-brand-grey-tiles" onClick={() => setOpen(false)}>
                For Job Seekers
              </Link>
              <Link href="#" className="rounded px-2 py-2 hover:bg-brand-grey-tiles" onClick={() => setOpen(false)}>
                For Employers
              </Link>
              <Link href="#" className="rounded px-2 py-2 hover:bg-brand-grey-tiles" onClick={() => setOpen(false)}>
                Insights & Resources
              </Link>
              <Link href="#" className="rounded px-2 py-2 hover:bg-brand-grey-tiles" onClick={() => setOpen(false)}>
                About
              </Link>
              {/* Auth actions moved to profile drawer; none in hamburger menu */}
            </nav>
          </div>
        </div>
      </div>
    </div>
    {/* Profile top drawer */}
    <div className={`${profileOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
      {/* Backdrop with blur only (no darkening), keep header visible */}
      <div
        className={`fixed inset-x-0 top-14 bottom-0 z-30 bg-white/0 backdrop-blur-sm transition-opacity ${profileOpen ? "opacity-100" : "opacity-0"}`}
        onClick={closeProfileDrawer}
      />
      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={`fixed left-0 right-0 top-14 z-40 h-[56vh] max-h-[56vh] transform bg-brand-grey-tiles transition-transform duration-200 shadow-[0_10px_10px_rgba(0,0,0,0.15)] ${profileOpen ? "translate-y-0" : "-translate-y-[100vh]"}`}
      >
        <div ref={profileRef} className="h-full overflow-auto">
          <div className="content py-4 h-full">
            {profilePage === "overview" ? (
              <>
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-semibold text-brand-text">Your profile</h2>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <Image
                    src="/images/user-outline.svg"
                    alt="User avatar"
                    width={48}
                    height={48}
                    className="h-12 w-12"
                  />
                  <div>
                    <p className="text-base font-medium text-brand-text">{session?.user?.name ?? "Guest"}</p>
                    <p className="text-sm text-brand-text/70">{session?.user?.email ?? "Not signed in"}</p>
                  </div>
                </div>
                <div className="mt-6 flex flex-col gap-2 text-sm">
                  {session ? (
                    <>
                      <button
                        onClick={() => setProfilePage("account")}
                        className="text-left text-brand-text hover:underline focus:outline-none"
                      >
                        Account
                      </button>
                      <button
                        onClick={() => {
                          signOut();
                          closeProfileDrawer();
                        }}
                        className="text-left text-brand-text hover:underline focus:outline-none"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        signIn("google", { prompt: "select_account" });
                        closeProfileDrawer();
                      }}
                      className="text-left text-brand-text hover:underline focus:outline-none"
                    >
                      Sign in
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="relative h-full">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-semibold text-brand-text">Account</h2>
                  <button
                    onClick={() => setProfilePage("overview")}
                    className="text-xs text-brand-text/70 hover:text-brand-text focus:outline-none"
                  >
                    &lt; Back
                  </button>
                </div>
                <div className="mt-4">
                  <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-brand-muted">
                    <div className="flex items-center gap-4 p-6">
                      <Image
                        src="/images/user-generic.svg"
                        alt={session?.user?.name ?? session?.user?.email ?? "User avatar"}
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-full ring-1 ring-brand-muted object-cover"
                      />
                      <div>
                        <p className="text-lg font-medium text-brand-text">{session?.user?.name ?? "Unnamed"}</p>
                        <p className="text-sm text-brand-text/70">{session?.user?.email ?? ""}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
