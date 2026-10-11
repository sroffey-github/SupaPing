import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import { createClient } from "@/lib/supabase/server";

function DashboardFallback() {
  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <header className="h-[76px] animate-pulse border-b border-slate-200 bg-white" />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="h-8 w-56 animate-pulse rounded-lg bg-slate-200" />
        <div className="mt-6 h-32 animate-pulse rounded-2xl bg-slate-200" />
        <div className="mt-6 h-64 animate-pulse rounded-2xl bg-slate-200" />
      </main>
    </div>
  );
}

async function DashboardRequestContent({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const metadata = user.user_metadata ?? {};

  const name =
    metadata.full_name ||
    metadata.name ||
    metadata.user_name ||
    metadata.preferred_username ||
    user.email?.split("@")[0] ||
    "Account";

  const avatarUrl =
    metadata.avatar_url ||
    metadata.picture ||
    metadata.photo_url ||
    undefined;

  return (
    <>
      <DashboardNavbar
        name={name}
        email={user.email ?? undefined}
        avatarUrl={avatarUrl}
      />
      {children}
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardRequestContent>{children}</DashboardRequestContent>
    </Suspense>
  );
}