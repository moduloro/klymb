"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading…</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      {!session ? (
        <>
          <h1 className="text-2xl font-semibold">Welcome to Klymb</h1>
          <p className="opacity-80">You are not signed in.</p>
          <button
            onClick={() => signIn("google", { prompt: "select_account" })}
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Sign in with Google
          </button>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-semibold">
            Hi, {session.user?.name?.split(" ")[0]}
          </h1>
          <p className="opacity-80">Signed in as {session.user?.email}</p>
          <button
            onClick={() => signOut()}
            className="rounded bg-red-600 px-4 py-2 text-white"
          >
            Sign out
          </button>
        </>
      )}
    </main>
  );
}
