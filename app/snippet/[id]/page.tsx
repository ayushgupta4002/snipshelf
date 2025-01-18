"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CodeIcon,
  SaveIcon,
  ClipboardCopyIcon,
  ArrowLeftIcon,
  Cross,
  X,
  Github,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

import Loader from "@/app/_components/Loader";
import { signIn, useSession } from "next-auth/react";
import { getSnippetBySnipId, updateSnippet } from "@/helpers/snippet";
import { Snippet } from "@/types";
import { useRecoilState } from "recoil";
import { snippetAtom } from "@/app/atom";

export default function SnippetPage({ params }: { params: { id: string } }) {
    const [ snippets , setSnippets] = useRecoilState<snippetAtom[]>(snippetAtom);
  const thisSnippet = snippets.find((s) => s.id === Number(params.id));
  const [isEditing, setIsEditing] = useState(false);
  const [snippet, setSnippet] = useState<Snippet>(thisSnippet || { id: 0, title: '', content: '', description: '', userId: 0, createdAt: new Date(), updatedAt: new Date() });
  const [prevSnippet, setPrevSnippet] = useState<Snippet>({});
  const { data: session, status } = useSession();
  const { toast } = useToast();

  const handleSave = async () => {
    console.log("Save snippet:", snippet);
    await updateSnippet(snippet);
    setIsEditing(false);
  };
  const pushToGitHub = async () => {
    await fetch("/api/github/create-gist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filename: snippet.title,
        content: snippet.content,
      }),
    })
      .then((res) => {
        console.log(res);
        toast({
          title: "Successful",
          description: "data pushed successfully to github",
        });
      })
      .catch((err) => {
        console.error(err);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
      });
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.content);
  };
  useEffect(() => {
    const fetchData = async () => {
      if (status === "authenticated" && session?.user?.userId) {
        console.log("Session authenticated:", session);

        try {
          const data = await getSnippetBySnipId({
            snipId: Number(params.id),
            userId: Number(session.user.userId),
          });
          console.log("Data:", data);

          if (data) {
            setSnippet(data);
          }
        } catch (err) {
          console.error("Fetch error:", err);
        }
      } else {
        console.log("Session not authenticated or missing userId");
      }
    };
    fetchData();
  }, [params.id, session, status]);
  if (status === "loading") {
    // Show a loading spinner or message while the session is being fetched
    return <Loader />;
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
              {isEditing ? (
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setSnippet(prevSnippet);
                  }}
                  className="bg-primary hover:bg-primary/90"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  className="text-muted-foreground hover:text-primary"
                >
                  <ClipboardCopyIcon className="h-4 w-4 mr-2" />
                  Copy Code
                </Button>
              )}

              {isEditing ? (
                <Button
                  onClick={handleSave}
                  className="bg-primary hover:bg-primary/90"
                >
                  <SaveIcon className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setIsEditing(true);
                    setPrevSnippet(snippet);
                  }}
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
                    onChange={(e) =>
                      setSnippet({ ...snippet, title: e.target.value })
                    }
                    className="text-3xl font-bold bg-background/50 backdrop-blur-sm border-primary/20 w-[600px]"
                  />
                ) : (
                  <h1 className="text-4xl font-bold text-primary">
                    {snippet.title}
                  </h1>
                )}
              </div>
              <button
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-black  font-semibold py-2 px-3 rounded-3xl transition-colors duration-200 shadow-md hover:shadow-lg active:scale-95 transform"
                onClick={() => pushToGitHub()}
              >
                <Github className="w-5 h-5 text-black" />
                <span>Push to GitHub</span>
              </button>
              <div className=" pt-3 space-y-4">
                <h2 className="text-lg font-semibold text-primary">
                  Description
                </h2>
                {isEditing ? (
                  <Textarea
                    value={snippet.description || ""}
                    onChange={(e) =>
                      setSnippet({ ...snippet, description: e.target.value })
                    }
                    className="min-h-[120px] text-muted-foreground"
                  />
                ) : (
                  <p className="text-muted-foreground leading-relaxed">
                    {snippet.description}
                  </p>
                )}
              </div>

              {/* <div className="bg-card rounded-lg border border-border/50 p-6 space-y-4">
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
              </div> */}
            </div>

            {/* Right Column - Code */}
            <div className="bg-card rounded-lg border h-[60vh] border-zinc-100 overflow-hidden">
              <div className="bg-muted p-4 border-b border-border/50 flex items-center justify-between">
                <span className="text-sm font-medium">Code</span>
                {/* <span className="text-xs text-muted-foreground">{snippet.language}</span> */}
              </div>
              {isEditing ? (
                <Textarea
                  value={snippet.content}
                  onChange={(e) =>
                    setSnippet({ ...snippet, content: e.target.value })
                  }
                  className="font-mono text-sm min-h-[500px] rounded-none border-0 resize-none"
                />
              ) : (
                <pre className="p-4 overflow-auto max-h-[500px]">
                  <code className="text-sm font-mono">{snippet.content}</code>
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
