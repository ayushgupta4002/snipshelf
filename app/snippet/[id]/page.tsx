"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CodeIcon, SaveIcon, ClipboardCopyIcon, ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import Loader from "@/app/_components/Loader";
import { signIn, useSession } from "next-auth/react";

export default function SnippetPage({ params }: { params: { id: string } }) {
  const [isEditing, setIsEditing] = useState(false);
  const [snippet, setSnippet] = useState({
    id: parseInt(params.id),
    title: "React useEffect Hook",
    description: "Common useEffect patterns in React with detailed examples and best practices for handling side effects in React components. Includes cleanup patterns and dependency array optimization techniques.",
    code: `// Basic useEffect with cleanup
useEffect(() => {
  const subscription = api.subscribe(data => {
    console.log(data);
  });

  // Cleanup function
  return () => {
    subscription.unsubscribe();
  };
}, []);

// useEffect with dependencies
useEffect(() => {
  const handler = async () => {
    const data = await fetchData(userId);
    setUserData(data);
  };
  
  handler();
}, [userId]);`,
    language: "javascript",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1200&h=400",
  });
const {data: session, status}= useSession();
  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
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
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link 
                href="/dashboard" 
                className="flex items-center text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={handleCopy}
                className="text-muted-foreground hover:text-primary"
              >
                <ClipboardCopyIcon className="h-4 w-4 mr-2" />
                Copy Code
              </Button>
              {isEditing ? (
                <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                  <SaveIcon className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              ) : (
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="bg-primary hover:bg-primary/90"
                >
                  Edit Snippet
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          {/* Hero Image */}
          {/* <div className="rounded-lg overflow-hidden mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent z-10" />
            <img 
              src={snippet.image} 
              alt={snippet.title} 
              className="w-full h-[300px] object-cover"
            />
            <div className="absolute bottom-8 left-8 z-20">
              {isEditing ? (
                <Input 
                  value={snippet.title}
                  onChange={(e) => setSnippet({ ...snippet, title: e.target.value })}
                  className="text-3xl font-bold bg-background/50 backdrop-blur-sm border-primary/20 w-[600px]"
                />
              ) : (
                <h1 className="text-4xl font-bold text-primary">{snippet.title}</h1>
              )}
            </div>
          </div> */}
   
          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
            
            {/* Left Column - Details */}
            <div className="space-y-6">
            <div className="z-20">
              {isEditing ? (
                <Input 
                  value={snippet.title}
                  onChange={(e) => setSnippet({ ...snippet, title: e.target.value })}
                  className="text-3xl font-bold bg-background/50 backdrop-blur-sm border-primary/20 w-[600px]"
                />
              ) : (
                <h1 className="text-4xl font-bold text-primary">{snippet.title}</h1>
              )}
            </div>
              <div className=" pt-3 space-y-4">
                
              
                <h2 className="text-lg font-semibold text-primary">Description</h2>
                {isEditing ? (
                  <Textarea 
                    value={snippet.description}
                    onChange={(e) => setSnippet({ ...snippet, description: e.target.value })}
                    className="min-h-[120px] text-muted-foreground"
                  />
                ) : (
                  <p className="text-muted-foreground leading-relaxed">
                    {snippet.description}
                  </p>
                )}
              </div>

              <div className="bg-card rounded-lg border border-border/50 p-6 space-y-4">
                <h2 className="text-lg font-semibold text-primary">Details</h2>
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <div>
                        <label className="text-sm text-muted-foreground">Language</label>
                        <Input 
                          value={snippet.language}
                          onChange={(e) => setSnippet({ ...snippet, language: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Image URL</label>
                        <Input 
                          value={snippet.image}
                          onChange={(e) => setSnippet({ ...snippet, image: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-primary/10 rounded-full text-sm text-primary">
                        {snippet.language}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Code */}
            <div className="bg-card rounded-lg border border-zinc-100 overflow-hidden">
              <div className="bg-muted p-4 border-b border-border/50 flex items-center justify-between">
                <span className="text-sm font-medium">Code</span>
                <span className="text-xs text-muted-foreground">{snippet.language}</span>
              </div>
              {isEditing ? (
                <Textarea 
                  value={snippet.code}
                  onChange={(e) => setSnippet({ ...snippet, code: e.target.value })}
                  className="font-mono text-sm min-h-[500px] rounded-none border-0 resize-none"
                />
              ) : (
                <pre className="p-4 overflow-auto max-h-[500px]">
                  <code className="text-sm font-mono">{snippet.code}</code>
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}