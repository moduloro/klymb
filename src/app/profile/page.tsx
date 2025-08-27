import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { authOptions } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const user = session.user ?? {};

  return (
    <main className="bg-white">
      <section className="mt-8">
        <div className="content">
          <h1 className="text-2xl font-semibold text-brand-text">Your profile</h1>
          <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-brand-muted">
            <div className="flex items-center gap-4 p-6">
              <Image
                src="/images/user-generic.svg"
                alt={user.name ?? user.email ?? "User avatar"}
                width={64}
                height={64}
                className="h-16 w-16 rounded-full ring-1 ring-brand-muted object-cover"
              />
              <div>
                <p className="text-lg font-medium text-brand-text">{user.name ?? "Unnamed"}</p>
                <p className="text-sm text-brand-text/70">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
