"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CodeIcon, PlusIcon, SearchIcon, ExternalLinkIcon, EyeOff, Eye, LogOut } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import Loader from "../_components/Loader";

export default function Dashboard() {
  
  const { data: session, status } = useSession();
  const [snippets, setSnippets] = useState([
    {
      id: 1,
      title: "React useEffect Hook",
      description: "Common useEffect patterns in React",
      code: "useEffect(() => {\n  // Effect code here\n  return () => {\n    // Cleanup code here\n  };\n}, []); useEffect(() => {\n  // Effect code here\n  return () => {\n    // Cleanup code here\n  };\n}, []);useEffect(() => {\n  // Effect code here\n  return () => {\n    // Cleanup code here\n  };\n}, []);",
      language: "javascript",
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=300&h=200",
    },
    {
      id: 2,
      title: "Tailwind Flex Center",
      description: "Center elements with Tailwind CSS",
      code: '<div className="flex items-center justify-center">\n  <!-- Content here -->\n</div>',
      language: "html",
      image:
        "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=300&h=200",
    },
    {
      id: 1,
      title: "React useEffect Hook",
      description: "Common useEffect patterns in React",
      code: "useEffect(() => {\n  // Effect code here\n  return () => {\n    // Cleanup code here\n  };\n}, []);",
      language: "javascript",
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=300&h=200",
    },
    {
      id: 2,
      title: "Tailwind Flex Center",
      description: "Center elements with Tailwind CSS",
      code: '<div className="flex items-center justify-center">\n  <!-- Content here -->\n</div>',
      language: "html",
      image:
        "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=300&h=200",
    },
    {
      id: 1,
      title: "React useEffect Hook",
      description: "Common useEffect patterns in React",
      code: "useEffect(() => {\n  // Effect code here\n  return () => {\n    // Cleanup code here\n  };\n}, []);",
      language: "javascript",
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=300&h=200",
    },
    {
      id: 2,
      title: "Tailwind Flex Center",
      description: "Center elements with Tailwind CSS",
      code: '<div className="flex items-center justify-center">\n  <!-- Content here -->\n</div>',
      language: "html",
      image:
        "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=300&h=200",
    },
  ]);
  const [showApiKey, setShowApiKey] = useState(false);
  const profileData = {
    name: "John Doe",
    email: "john.doe@example.com",
    apiKey: "sk-12345-abcde-67890"
  };

  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey);
  };

  const handleSignOut = () => {
    // Handle sign out logic here
    console.log("Signing out...");
  };
  if (status === "loading") {
    // Show a loading spinner or message while the session is being fetched
    return <Loader/>;
  }

  if (!session) {
    // If no session, trigger the sign-in process
    signIn();
    return null; // Prevent rendering anything else while signing in
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1b1a1a] to-black">
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
          <Link href={"/"}> <div className="flex items-center">
              <CodeIcon className="h-8 w-8 text-primary" />
              <span className="ml-2 text-2xl font-bold text-primary">
                Snipit
              </span>
            </div></Link>
            <div className="flex items-center space-x-4">
            <Dialog>
                <DialogTrigger asChild>
                <Avatar className="cursor-pointer">
                <AvatarImage src={session.user?.image} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
                </DialogTrigger>
                <DialogContent>
                  
                <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <Input 
              value={session.user?.name}
              readOnly
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <Input 
              value={session.user?.email}
              readOnly
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">API Key</label>
            <div className="flex gap-2">
              <Input
                type={showApiKey ? "text" : "password"}
                value={profileData.apiKey}
                readOnly
                className="w-full font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={toggleApiKeyVisibility}
                className="flex-shrink-0"
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button
            variant="destructive"
            className="w-full"
            onClick={()=>signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
                  
                </DialogContent>
              </Dialog>
           
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    New Snippet
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Snippet</DialogTitle>
                    <DialogDescription>
                      Add a new code snippet to your collection
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input placeholder="Snippet Title" />
                    <Input placeholder="Description" />
                    <Textarea
                      placeholder="Paste your code here"
                      className="font-mono"
                      rows={6}
                    />
                    <Input placeholder="Image URL (optional)" />
                  </div>
                  <DialogFooter>
                    <Button>Save Snippet</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Snips</h1>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10 w-[300px]"
              placeholder="Search snippets..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {snippets.map((snippet) => (
            <Link href={`/snippet/${snippet.id}`} key={snippet.id}>
              <Card className="overflow-hidden  bg-gradient-to-br from-[#2a2929] to-black group hover:border-primary/50 transition-colors">
                {/* <div className="relative left-70 top-2">
                      <ExternalLinkIcon className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div> */}
                <div className="relative">
                  {/* <img src={snippet.image} alt={snippet.title} className="w-full h-48 object-cover" /> */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors flex flex-row">
                    {snippet.title}{" "}
                  </CardTitle>
                  <CardDescription>{snippet.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-lg border shadow-sm overflow-hidden relative">
                    <pre className="overflow-hidden h-24 max-h-24">
                      <code className="text-sm">{snippet.code}</code>
                    </pre>
                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-muted to-transparent" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
