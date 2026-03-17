import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Brutally Honest Productivity OS",
  description: "A personal agent to park your thoughts and keep you on track.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`bg-dark-bg text-text-main flex min-h-screen selection:bg-neon selection:text-black antialiased relative`}>
        <div className="fixed inset-0 bg-grid pointer-events-none z-0"></div>
        <Navigation />
        <main className="flex-1 overflow-auto relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
