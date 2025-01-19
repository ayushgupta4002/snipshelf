"use client"
import { Button } from "@/components/ui/button";
import { CodeIcon, BookMarkedIcon, ZapIcon } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { FeaturesSectionDemo } from "./_components/Hero";

export default function Home() {
  const {data : session} = useSession();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(0,0%,13%)] to-black">
      <nav className="border-b border-border/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <CodeIcon className="h-8 w-8 text-primary" />
              <span className="ml-2 text-2xl font-bold text-primary">Snipit</span>
            </div>
            <div>
                {session && session.user ? <Link href={"/dashboard"}><Button variant="secondary">Dashboard</Button></Link> : <><Button variant="secondary" onClick={()=>signIn()}>SignIn</Button></>}
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-25">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-primary mb-6">
              Your Personal Code Snippet Library
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              Store, organize, and access your code snippets with ease. Never lose track of your valuable code fragments again.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-white to-cyan-600">
                Start Collecting Snippets
              </Button>
            </Link>
          </div>
<FeaturesSectionDemo/>
          {/* <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <BookMarkedIcon className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Organized Collection</h3>
              <p className="text-muted-foreground">
                Keep your code snippets organized and easily accessible in one place.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="h-12 w-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
                <CodeIcon className="h-6 w-6 text-indigo-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Syntax Highlighting</h3>
              <p className="text-muted-foreground">
                Beautiful syntax highlighting for all major programming languages.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="h-12 w-12 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4">
                <ZapIcon className="h-6 w-6 text-violet-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Access</h3>
              <p className="text-muted-foreground">
                Find and reuse your code snippets instantly when you need them.
              </p>
            </div>
          </div> */}
        </div>
      </main>
    </div>
  );
}