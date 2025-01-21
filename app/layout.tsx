"use client"
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster"
import {
  RecoilRoot,
} from 'recoil';
const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'Snipshelf - Your Code Snippet Shelf',
//   description: 'Store and manage your code snippets with ease',
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <RecoilRoot>
      <body className={`${inter.className} dark`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          forcedTheme="dark"
        >
          <SessionProvider>
          {children}
          <Toaster />


          </SessionProvider>
        </ThemeProvider>
      </body>
      </RecoilRoot>
    </html>
  );
}