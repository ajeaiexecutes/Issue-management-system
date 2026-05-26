import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import NextTopLoader from 'nextjs-toploader';
import { LayoutDashboard } from "lucide-react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Minimal Issue Manager",
  description: "A clean and modern issue management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col`}>
        <NextTopLoader color="#4f46e5" showSpinner={false} height={3} />
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl tracking-tight transition-opacity hover:opacity-80">
              <LayoutDashboard className="w-6 h-6" />
              <span>IssueManager</span>
            </Link>
            <nav className="flex gap-4">
              <Link href="/issues/new" className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors shadow-sm">
                + New Issue
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
