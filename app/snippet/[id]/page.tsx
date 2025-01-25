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
  ExternalLink,
  Trash2Icon,
  Copy,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

import Loader from "@/app/_components/Loader";
import { signIn, useSession } from "next-auth/react";
import {
  deleteShareLink,
  deleteSnippetbyId,
  getShareLink,
  getSnippetByShareId,
  getSnippetBySnipId,
  updateSnippet,
} from "@/helpers/snippet";
import { Snippet } from "@/types";
import { useRecoilState } from "recoil";
import { snippetAtom } from "@/app/atom";
import { ToastAction } from "@/components/ui/toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";
import prisma from "@/lib/prisma";

export default function SnippetPage({ params }: { params: { id: string } }) {
  const [snippets, setSnippets] = useRecoilState<snippetAtom[]>(snippetAtom);
  const thisSnippet = snippets.find((s) => s.id === Number(params.id));
  const [isEditing, setIsEditing] = useState(false);
  const [snippet, setSnippet] = useState<Snippet>(
    thisSnippet || {
      id: 0,
      title: "",
      content: "",
      description: "",
      userId: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      gistId: "",
      gistUrl: "",
      shareId: "",
    }
  );
  const [prevSnippet, setPrevSnippet] = useState<Snippet>({});
  const [isPushing, setIsPushing] = useState(false);
  const { data: session, status } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const searchParams = useSearchParams();
  const shareId = searchParams.get("shareId");
  const [Loading, setLoading] = useState(false);
  const [snippetExists, setSnippetExists] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      if (shareId) {
        setLoading(true);

        const data = await getSnippetByShareId({
          snipId: Number(params.id),
          shareId: shareId,
        });
        if (!data) {
          setSnippetExists(false);
        } else {
          setSnippetExists(true);
          setSnippet(data);
        }
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  const { toast } = useToast();

  const handleSave = async () => {
    console.log("Save snippet:", snippet);
    if (session && session.user.userId) {
      await updateSnippet(snippet, session.user.userId);
    } else {
      console.error("Session not authenticated or missing userId");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Session not authenticated or missing userId",
      });
      setSnippet(prevSnippet);
    }
    setIsEditing(false);
  };

  const pushToGitHub = async () => {
    setIsPushing(true);
    await fetch("/api/github/create-gist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filename: snippet.title,
        content: snippet.content,
        snippetId: snippet.id,
      }),
    })
      .then(async (res) => {
        const response = await res.json();
        if (res.status === 200) {
          setSnippet({
            ...snippet,
            gistId: response.gist.id,
            gistUrl: response.gistUrl,
          });

          toast({
            title: "Successful",
            description: "data pushed successfully to github",
          });
        } else {
          console.log(response);
          toast({
            title: "Error",
            description: response.error || "Error in pushing data to github",
            action:
              response.key === "GITHUB_NOT_CONNECTED" ? (
                <Link href={"/api/github/oauthGithub"}>
                  <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-black font-semibold py-1 px-2 rounded-3xl transition-colors duration-200 shadow-md hover:shadow-lg active:scale-95 transform">
                    <Github className="w-5 h-5 text-black" />
                    <span>Connect</span>
                  </button>
                </Link>
              ) : undefined,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
      });
    setIsPushing(false);
  };

  const updateGist = async () => {
    setIsPushing(true);
    // if(!snippet.gistId){
    //   setIsPushing(false);
    //   return;
    // }
    await fetch("/api/github/update-gist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filename: snippet.title,
        content: snippet.content,
        gistId: snippet.gistId,
        snippetId: snippet.id,
      }),
    })
      .then(async (res) => {
        const response = await res.json();
        if (res.status === 200) {
          toast({
            title: "Successful",
            description: "data updated successfully to github gists",
          });
        } else {
          if (response.key === "NOT_FOUND") {
            setSnippet({ ...snippet, gistId: "", gistUrl: "" });
          }

          console.log(response);
          toast({
            title: "Error",
            description: response.error || "Error in pushing data to github",
            action:
              response.key === "GITHUB_NOT_CONNECTED" ? (
                <Link href={"/api/github/oauthGithub"}>
                  <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-black font-semibold py-1 px-2 rounded-3xl transition-colors duration-200 shadow-md hover:shadow-lg active:scale-95 transform">
                    <Github className="w-5 h-5 text-black" />
                    <span>Connect</span>
                  </button>
                </Link>
              ) : undefined,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
      });
    setIsPushing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.content);
  };
  useEffect(() => {
    console.log("called");

    const fetchData = async () => {
      // if share id exists then we will fetch snippets in diff useEffect
      if (shareId) {
        return;
      }
      if (snippet.id != 0) {
        return;
      }
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

  const deleteSnippet = async (id: number) => {
    if (!session || !session.user.userId) {
      console.error("Session not authenticated or missing userId");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Session not authenticated or missing userId",
      });
      return;
    }
    const targetSnippet = snippets.find((snippet) => snippet.id === Number(id));
    if (!targetSnippet) {
      return;
    }
    try {
      const newSnippets = snippets.filter(
        (snippet) => snippet.id !== Number(id)
      );
      setSnippets(newSnippets);

      await deleteSnippetbyId(Number(id), session.user.userId)
        .then(() => {
          toast({
            title: "Success",
            description: "Snippet deleted successfully",
          });
        })
        .catch((err) => {
          snippets.push(targetSnippet);
          console.error(err);
          toast({
            title: "Error",
            description: "Failed to delete snippet",
          });
        });
    } catch (err) {
      snippets.push(targetSnippet);
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to delete snippet",
      });
    } finally {
      setIsDialogOpen(false);
      window.location.href = "/dashboard";
    }
  };

  const generateShareLink = async (id: number) => {
    if (!session || !session.user.userId) {
      console.error("Session not authenticated or missing userId");
      return;
    }

    try {
      await getShareLink({ snipId: Number(id), userId: session.user.userId })
        .then((resp) => {
          setSnippet({ ...snippet, shareId: resp.shareId });
          toast({
            title: "Success",
            description: "Snippet deleted successfully",
          });
        })
        .catch((err) => {
          console.error(err);
          toast({
            title: "Error",
            description: "Failed to generate link",
          });
        });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to generate link",
      });
    }
  };


  const deleteSnippetShareLink = async (id: number) => {
    if (!session || !session.user.userId) {
      console.error("Session not authenticated or missing userId");
      return;
    }

    try {
      await deleteShareLink({ snipId: Number(id), userId: session.user.userId })
        .then(() => {
          setSnippet({ ...snippet, shareId: "" });
          toast({
            title: "Success",
            description: "Link deleted successfully",
          });
        })
        .catch((err) => {
          console.error(err);
          toast({
            title: "Error",
            description: "Failed to delete link",
          });
        });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to delete link",
      });
    }
  }

  if (status === "loading" || Loading) {
    return <Loader />;
  }

  if (snippetExists === false && shareId) {
    return <>No snippet found</>;
  }

  if (!session && !shareId) {
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
              {!shareId ? (
                <Link
                  href="/dashboard"
                  className="flex items-center text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              ) : (
                <Link href={"/"}>
                  <div className="flex items-center">
                    <CodeIcon className="h-8 w-8 text-primary" />
                    <span className="ml-2 text-2xl font-bold text-primary">
                      Snipshelf
                    </span>
                  </div>
                </Link>
              )}
            </div>

            {!shareId && (
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={handleCopy}
                        className="text-muted-foreground hover:text-primary"
                      >
                        <ClipboardCopyIcon className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Share link</DialogTitle>
                        <DialogDescription>
                          Anyone who has this link will be able to view this.
                        </DialogDescription>
                      </DialogHeader>
                      {snippet.shareId ? (
                        <>
                          <div className="flex items-center space-x-2">
                            <div className="grid flex-1 gap-2">
                              <Label htmlFor="link" className="sr-only">
                                Link
                              </Label>
                              <Input
                                id="link"
                                defaultValue={`${
                                  process.env.NEXT_PUBLIC_NEXTAUTH_URL ?? ""
                                }/snippet/${snippet.id}?shareId=${
                                  snippet.shareId
                                }`}
                                readOnly
                              />
                            </div>
                            <Button
                              type="submit"
                              size="sm"
                              className="px-2"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `${
                                    process.env.NEXT_PUBLIC_NEXTAUTH_URL ?? ""
                                  }/snippet/${snippet.id}?shareId=${
                                    snippet.shareId
                                  }`
                                );
                              }}
                            >
                              <span className="sr-only">Copy</span>
                              <Copy size={20} />
                            </Button>
                          </div>
                          <DialogFooter className="sm:justify-start">
                            <DialogClose asChild>
                              <Button type="button" variant="secondary">
                                Close
                              </Button>
                            </DialogClose>
                            <Button onClick={()=>{deleteSnippetShareLink(snippet.id)}} type="button" variant="secondary">
                              Delete Link
                            </Button>
                          </DialogFooter>
                        </>
                      ) : (
                        <>
                          <div
                            onClick={() => generateShareLink(snippet.id)}
                            className="flex items-center text-yellow-400 space-x-2 underline underline-offset-2 cursor-pointer"
                          >
                            Generate Link
                          </div>
                        </>
                      )}
                    </DialogContent>
                  </Dialog>
                )}

                {!isEditing && (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="text-muted-foreground  hover:text-primary"
                      >
                        <Trash2Icon className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <div className="space-y-4 py-4">
                        <h2 className="text-lg font-semibold text-primary">
                          Are you sure you want to delete this snippet?
                        </h2>

                        <div className="flex flex-row space-x-2">
                          <Button
                            variant="secondary"
                            className="w-full"
                            onClick={() => {
                              setIsDialogOpen(false);
                            }}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            className="w-full"
                            onClick={() => deleteSnippet(snippet.id)}
                          >
                            <Trash2Icon className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
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
            )}
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
              {!shareId && (
                <>
                  {" "}
                  {isPushing ? (
                    <button className="flex items-center gap-2 cursor-not-allowed bg-green-500 hover:bg-green-600 text-black  font-semibold py-2 px-3 rounded-3xl transition-colors duration-200 shadow-md hover:shadow-lg active:scale-95 transform">
                      <Github className="w-5 h-5 text-black" />
                      <span>Pushing...</span>
                    </button>
                  ) : (
                    <div className="flex flex-row space-x-3">
                      <button
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-black  font-semibold py-2 px-3 rounded-3xl transition-colors duration-200 shadow-md hover:shadow-lg active:scale-95 transform"
                        onClick={() => {
                          if (snippet.gistId) {
                            updateGist();
                          } else {
                            pushToGitHub();
                          }
                        }}
                      >
                        <Github className="w-5 h-5 text-black" />
                        {snippet.gistId ? (
                          <span>Update Gist</span>
                        ) : (
                          <span>Push to GitHub Gists</span>
                        )}
                      </button>
                      {snippet.gistUrl && (
                        <button
                          className={`flex items-center gap-1.5 text-green-500 hover:text-green-600 font-medium transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed group`}
                          onClick={() =>
                            snippet.gistUrl &&
                            window.open(snippet.gistUrl, "_blank")
                          }
                          disabled={!snippet.gistId}
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span className="border-b border-dashed border-gray-400 group-hover:border-gray-900 transition-colors duration-200">
                            Visit
                          </span>
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
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
            <div className="bg-card rounded-lg border h-[70vh] border-zinc-100 overflow-hidden">
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
                <pre className="relative overflow-auto max-h-[500px] text-sm font-mono">
                <code className="block pr-4 pb-4 [counter-reset:line]">
                  {snippet.content.split('\n').map((line, i) => (
                    <div key={i} className="relative pl-12 hover:bg-slate-700">
                      <span className="absolute left-0 w-8 bg-gray-800 h-full flex items-center justify-end pr-2 text-gray-600 select-none [counter-increment:line] before:content-[counter(line)]" />
                      {line || '\n'}
                    </div>
                  ))}
                </code>
              </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
