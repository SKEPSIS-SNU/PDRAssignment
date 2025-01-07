export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full min-h-screen bg-background flex justify-center items-center">
      <section className="flex flex-col items-center bg-background rounded-2xl overflow-hidden mx-2 shadow-2xl shadow-primary/40 border-2 border-primary/30 transition-all pt-1">
        {children}
      </section>
    </main>
  );
}
