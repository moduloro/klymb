"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setProfileOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(e.target as Node)) setProfileOpen(false);
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

  return (
    <>
    <header className="sticky top-0 z-[60] bg-brand-grey-tiles">
      <div className="content h-14 flex items-center gap-4">
        {/* Left: Logo */}
        <div className="shrink-0">
          <Link href="/" className="text-xl font-bold tracking-tight text-brand-text">
            klymb
          </Link>
        </div>

        {/* Center/Right: Nav */}
        <nav className="ml-2 hidden items-center gap-6 text-sm text-brand-text/80 md:flex">
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
          {session && (
            <Link href="/profile" className="hover:text-brand-text focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded">
              Profile
            </Link>
          )}
        </nav>

        {/* Right: Auth + Mobile toggle */}
        <div className="ml-auto flex items-center gap-3">
          {/* User avatar button opens profile drawer */}
          <button
            type="button"
            aria-label="Open profile"
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen(true)}
            className="inline-flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <Image
              src="/images/user-outline.svg"
              alt="Profile"
              width={24}
              height={24}
              className="h-6 w-6"
            />
          </button>
          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent text-brand-text focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
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
      {/* Mobile drawer */}
      <div className={`md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
        {/* Backdrop */}
        <div
          onClick={() => setOpen(false)}
          className={`fixed inset-0 bg-black/30 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        />
        {/* Panel */}
        <div
          id="mobile-menu"
          className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85%] transform bg-white shadow-xl transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-end p-2">
            <button
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-brand-text text-2xl leading-none hover:bg-brand-grey-tiles focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              ×
            </button>
          </div>
          <nav className="flex h-[calc(100%-44px)] flex-col gap-1 px-4 pb-4 text-brand-text">
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
            {session && (
              <Link href="/profile" className="rounded px-2 py-2 hover:bg-brand-grey-tiles" onClick={() => setOpen(false)}>
                Profile
              </Link>
            )}
            <div className="mt-auto pt-4">
              {!session ? (
                <button
                  onClick={() => {
                    setOpen(false);
                    signIn("google", { prompt: "select_account" });
                  }}
                  className="w-full rounded-md bg-brand-primary px-3 py-2 text-sm font-medium text-white"
                >
                  Sign in
                </button>
              ) : (
                <button
                  onClick={() => {
                    setOpen(false);
                    signOut();
                  }}
                  className="w-full rounded-md border border-brand-muted bg-white px-3 py-2 text-sm font-medium text-brand-text"
                >
                  Sign out
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
    {/* Profile top drawer */}
    <div className={`${profileOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
      {/* Backdrop with blur only (no darkening), keep header visible */}
      <div
        className={`fixed inset-x-0 top-14 bottom-0 z-30 bg-white/0 backdrop-blur-sm transition-opacity ${profileOpen ? "opacity-100" : "opacity-0"}`}
        onClick={() => setProfileOpen(false)}
      />
      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={`fixed left-0 right-0 top-14 z-40 h-[80vh] max-h-[80vh] transform bg-brand-grey-tiles transition-transform duration-200 ${profileOpen ? "translate-y-0" : "-translate-y-[100vh]"}`}
      >
        <div ref={profileRef} className="h-full overflow-auto">
          <div className="content py-4">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-semibold text-brand-text">Your profile</h2>
              <button
                aria-label="Close"
                onClick={() => setProfileOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-brand-text text-2xl leading-none hover:bg-brand-grey-tiles focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                ×
              </button>
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
                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="text-brand-text hover:underline"
                  >
                    Account
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setProfileOpen(false);
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
                    setProfileOpen(false);
                  }}
                  className="text-left text-brand-text hover:underline focus:outline-none"
                >
                  Sign in
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
