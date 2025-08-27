"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-brand-grey-tiles border-b border-brand-muted">
      <div className="content flex items-center gap-4 py-3">
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
        </nav>

        {/* Right: Auth + Mobile toggle */}
        <div className="ml-auto flex items-center gap-3">
          {!session ? (
            <button
              onClick={() => signIn("google", { prompt: "select_account" })}
              className="inline-flex items-center rounded-md bg-brand-primary px-3 py-2 text-sm font-medium text-white shadow-sm hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              aria-label="Sign in"
            >
              Sign in
            </button>
          ) : (
            <div className="flex items-center gap-3">
              {session.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user?.name ?? "User avatar"}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full border border-brand-muted object-cover"
                />
              ) : null}
              {/* TODO: Profile dropdown (profile, settings, etc.) */}
              <button
                onClick={() => signOut()}
                className="inline-flex items-center rounded-md border border-brand-muted bg-white px-3 py-2 text-sm font-medium text-brand-text hover:bg-brand-muted/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                aria-label="Sign out"
              >
                Sign out
              </button>
            </div>
          )}
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
          <nav className="flex h-full flex-col gap-1 p-4 text-brand-text">
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
  );
}
