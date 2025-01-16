"use client"
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'Snipit - Your Code Snippet Shelf',
//   description: 'Store and manage your code snippets with ease',
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} dark`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          forcedTheme="dark"
        >
          <SessionProvider>
          {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}