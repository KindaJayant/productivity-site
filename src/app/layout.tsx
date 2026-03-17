import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} bg-jedi text-martini flex min-h-screen selection:bg-english/40 selection:text-martini antialiased`}>
        <Navigation />
        <main className="flex-1 overflow-auto relative">
          {children}
        </main>
      </body>
    </html>
  );
}
