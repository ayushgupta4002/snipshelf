"use client"
import { Button } from "@/components/ui/button";
import { CodeIcon, BookMarkedIcon, ZapIcon, Terminal, Code2 , Coffee} from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { FeaturesSectionDemo } from "./_components/Hero";
import { Card } from "@/components/ui/card";
import Footer from "./_components/Footer";
import Image from "next/image";
import FaqSection from "./_components/Faq";

export default function Home() {
  const {data : session} = useSession();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(0,0%,13%)] to-black">
      <nav className="border-b h-[8vh] border-border/10 backdrop-blur-sm">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2 group">
            <div className="p-2 rounded-full bg-zinc-600/90 group-hover:bg-zinc-400/80 transition-all duration-300">
              <CodeIcon className="w-7 h-7 text-gray-200 group-hover:text-white transform rotate-12 group-hover:rotate-[-12] transition-all duration-300" />
            </div>
            <span className="text-3xl font-bold font-display bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">
              Snipshelf
            </span>
          </div>
            <div>
                {session && session.user ? <Link href={"/dashboard"}><Button variant="default">Dashboard</Button></Link> : <><Button variant="default" onClick={()=>signIn()}>SignIn</Button></>}
            </div>
          </div>
        
        </div>
      </nav>

      

      <main className="h-[92vh] mt-5 flex flex-col justify-center">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-25">
          <div className="text-left sm:mt-8">
            <h1 className="text-6xl font-bold flex flex-row items-end space-x-4 font-font1 tracking-tight opacity-0 animate-slidein300 text-primary mb-6">
              <span> Give your code a shelf  </span>  <Coffee  size={45} className="p-1 max-sm:hidden"/>
            </h1>
            <p className="text-xl  font-font1 text-muted-foreground max-w-2xl opacity-0 animate-slidein500 mb-12">
              Store, organize, and access your code snippets with ease. Never lose track of your valuable code fragments again.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className=" opacity-0 animate-slidein700 bg-gradient-to-r from-white to-cyan-600">
                Start Collecting Snippets
              </Button>
            </Link>
          </div>

          
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
      <Card className="w-full max-w-full rounded-none bg-white/10 backdrop-blur-xl border-white/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-black-500/10" />
        <div className="relative p-4">
          <div className="flex justify-center mb-5">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/20">
              <Code2 className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-font1 -tracking-wide  opacity-0 animate-slidein300 font-bold text-center text-white mb-2">
          Save.Share.Reuse
         
          </h1>
          <p className="text-center  text-xl opacity-0 animate-slidein500 text-slate-300 mb-2">
          Your go-to solution for effortlessly managing and reusing your coding components </p>
          <Image
                      src="/oink1.png"
                      alt="header"
                      width={600}
                      height={600}
                      className="w-[80%] mx-auto object-center rounded-sm  transition-all duration-200"
                    />
       
        
        </div>
      </Card>
      <div className="w-full flex my-2 justify-center items-center">
      <Button variant={"outline"} className="mt-5 items-center bg-gradient-to-r from-cyan to-black-200 rounded-3xl w-fit max-w-full">
      <div className=" flex items-center gap-2 justify-center text-white-400">
            <Terminal className="w-4 h-4" />
            <p className="text-lg">Access your snippets anywhere.</p>
          </div>
      </Button>
      </div>
      <FeaturesSectionDemo />
      <FaqSection/>
      <Footer/>
    </div>
  );
}