export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="max-w-6xl mx-auto p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}