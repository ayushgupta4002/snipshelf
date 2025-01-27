import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster"
import {
  RecoilRoot,
} from 'recoil';
import ClientProviders from './ClientProvider';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Snipshelf',
  description: 'Give your code a shelf',
  icons: [{ rel: 'icon', url: "/faviconPNG.png" }],

};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <link rel="icon" href="/favicon.ico" sizes="any" />

    <body className={`${inter.className} dark`}>
      {/* Wrap the children with the client-side providers */}
      <ClientProviders>{children}</ClientProviders>
    </body>
  </html>
  );
}