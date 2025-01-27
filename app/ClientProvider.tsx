'use client';

import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import { RecoilRoot } from 'recoil';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RecoilRoot>
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
    </RecoilRoot>
  );
}
