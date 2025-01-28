"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Suspense, useState, useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";
import { deleteSnippetbyId, getSnippetByUserId } from "@/helpers/snippet";
import {
  CodeIcon,
  Delete,
  ExternalLinkIcon,
  LogOut,
  PlusIcon,
  SearchIcon,
  EyeOff,
  Eye,
  Trash2Icon,
  Check,
  Copy
} from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Loader from "../_components/Loader";

import { deleteUserbyId, getUserByUserId } from "@/helpers/users";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useRecoilState, useSetRecoilState } from "recoil";
import { snippetAtom, userAtom } from "../atom";
import Profile from "./_components/Profile";

export default function DashboardWrapper() {
  return (
    <Suspense fallback={<Loader />}>
      <Dashboard />
    </Suspense>
  );
}

function Dashboard() {
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const { data: session, status } = useSession();
  const router = useRouter();

  // const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [showApiKey, setShowApiKey] = useState(false);
  const [user, setUser] = useRecoilState<userAtom>(userAtom);
  const[apiCopy , setApiCopy] = useState(false);

  const [snippets, setSnippets] = useRecoilState<snippetAtom[]>(snippetAtom);
  const [searchQuery, setSearchQuery] = useState("");
  const[loading , setLoading] = useState(false);
  const filteredSnippets = snippets.filter((snippet) => {
    const matchesSearch =
      searchQuery === "" ||
      snippet.title.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey);
  };
  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "oauth_success") {
      toast({
        title: "Account Connected",
        description: "Your account has been connected successfully",
      });
      const params = new URLSearchParams(searchParams);
      params.delete("status");

      router.replace(`/dashboard?${params.toString()}`);
    }
  }, [searchParams]);

  useEffect(() => {
    console.log("Session:", session);
    const fetchData = async () => {
      if (status === "authenticated" && session?.user?.userId) {
        console.log("Session authenticated:", session);
        // if(snippets.length >0 ){setLoading(true)}
        if(snippets.length>0){
          return;
        }
        try {
setLoading(true);
          const data = await getSnippetByUserId(session.user.userId);
          const user = await getUserByUserId(session.user.userId);
          if (user) {
            setUser(user);
          }
          console.log("Data:", data);

          setSnippets(data);
        } catch (err) {
          console.error("Fetch error:", err);
        }finally{
          setLoading(false);
        }
      } else {
        console.log("Session not authenticated or missing userId");
        setLoading(false);
      }
    };
    fetchData();
  }, [session]);

  const deleteAccount = async () => {
    if (!session || !session.user.userId) {
      console.error("Session not authenticated or missing userId");
      return;
    }
    console.log("Deleting Account");
    await deleteUserbyId(session.user.userId)
      .then(() => {
        console.log("Account Deleted");
        toast({
          title: "We will miss you `😢`",
          description: "Your account has been deleted!",
        });
        signOut();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const deleteSnippet = async (id: number) => {
    if (!session || !session.user.userId) {
      console.error("Session not authenticated or missing userId");
      return;
    }
    const targetSnippet = snippets.find(
      (snippet) => snippet.id === Number(id)
    );
    if(!targetSnippet){
      return;
    }
    try {    
      const newSnippets = snippets.filter(
        (snippet) => snippet.id !== Number(id)
      );
      setSnippets(newSnippets);

      await deleteSnippetbyId(Number(id), session.user.userId)
        .then(() => {
          // toast({
          //   title: "Success",
          //   description: "Snippet deleted successfully",
          // });
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
    }
  };

  if(loading){
    return <Loader />
  }

  if (status === "loading") {
    // Show a loading spinner or message while the session is being fetched
    return <Loader />;
  }

  if (!session) {
    // If no session, trigger the sign-in process
    signIn();
    return null; // Prevent rendering anything else while signing in
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(
      user.apiKey
    );
    setApiCopy(true);
    setTimeout(() => setApiCopy(false), 2000);
  };
  //bg-gradient-to-b from-[#1b1a1a] to-black
  return (
    <div className="min-h-screen bg-zinc-900">
      <nav className="border-b border-border bg-gradient-to-l from-[hsl(0,0%,13%)] to-zinc ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href={"/"}>
              {" "}
              <div className="flex items-center space-x-2 group">
            <div className="p-2 rounded-full bg-zinc-600/90 group-hover:bg-zinc-400/80 transition-all duration-300">
              <CodeIcon className="w-7 h-7 text-gray-200 group-hover:text-white transform rotate-12 group-hover:rotate-[-12] transition-all duration-300" />
            </div>
            <span className="text-3xl font-bold font-display bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">
              Snipshelf
            </span>
          </div>
            </Link>
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
                      <label className="text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <Input
                        value={session.user?.name ??""}
                        readOnly
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <Input
                        value={session.user?.email ?? ""}
                        readOnly
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2 sm:hidden">
                      <label className="text-sm font-medium text-gray-700">
                        API Key
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type={showApiKey ? "text" : "password"}
                          value={user.apiKey}
                          readOnly
                          className="w-full font-mono"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={toggleApiKeyVisibility}
                          className="flex-shrink-0"
                        >
                          {showApiKey ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                              type="submit"
                              size="sm"
                              className="px-2"
                              onClick={handleCopy}
                            >
                              {apiCopy ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                      </div>
                    </div>
                    <div className="flex flex-row space-x-2">
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => signOut()}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => deleteAccount()}
                      >
                        <Delete className="mr-2 h-4 w-4" />
                        Delete Account{" "}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Link href={"/integration/vscode"} className="hidden md:block" target="blank">
                <Button>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  New Snippet
                </Button>
              </Link>
             { session.user.isGuest && <Button
            variant="outline"
            className="w-full bg-white/5 hover:bg-white/10 backdrop-blur-sm border-white/20 text-white hover:text-white transition-all duration-300"
            onClick={() => signIn("google")}
          >
            <div className="flex items-center justify-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </div>
          </Button>}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Profile session={session} handleCopy={handleCopy} apiCopy={apiCopy} />
        <div className="flex justify-between max-xs:flex-col  space-y-2 items-center mb-8">
          <h1 className="text-3xl font-bold">Your Snips</h1>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10 w-[300px]"
              placeholder="Search snippets..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(searchQuery.length > 0 ? filteredSnippets : snippets).map(
            (snippet) => (
              <div className="relative group" key={snippet.id}>
                <button
                  onClick={() => deleteSnippet(snippet.id)}
                  style={{ right: "2.5rem" }}
                  className="absolute z-50 mt-1 right-8 p-2 rounded-full hover:bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-all"
                  aria-label="Delete snippet"
                >
                  <Trash2Icon className="h-5 w-5" />
                </button>

                <Link href={`/snippet/${snippet.id}`} className="block">
                  <Card className="overflow-hidden cursor-pointer bg-gradient-to-br from-[#2a2929] to-black hover:border-primary/50 transition-colors">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    </div>
                    <CardHeader className="relative">
                      <div
                        className="absolute z-50 top-3"
                        style={{ right: "1rem" }}
                      >
                        <ExternalLinkIcon className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors flex flex-row">
                      {snippet.title?.substring(0, 20)}
                      {snippet.title && snippet.title.length > 20 ? ".." : ""}                      </CardTitle>
                      <CardDescription className="h-10 ">
                        {snippet.description?.substring(0, 120)}
                        {snippet.description && snippet.description.length > 120 ? "..." : ""}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-2">
                      <div className="bg-muted p-4 rounded-lg border shadow-sm overflow-hidden relative">
                        <pre className="overflow-hidden h-24 max-h-24">
                          <code className="text-sm">{snippet.content}</code>
                        </pre>
                        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-muted to-transparent" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}
