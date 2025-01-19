"use client";

import { use, useEffect, useState } from "react";
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
import {
  CodeIcon,
  PlusIcon,
  SearchIcon,
  ExternalLinkIcon,
  EyeOff,
  Eye,
  LogOut,
  Delete,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import Loader from "../_components/Loader";
import { getSnippetByUserId } from "@/helpers/snippet";

import { Snippet } from "@/types";
import Profile from "./_components/Profile";
import { deleteUserbyId, getUserByUserId } from "@/helpers/users";
import { useRecoilState, useSetRecoilState } from "recoil";
import { snippetAtom, userAtom } from "../atom";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";

export default function Dashboard() {
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const { data: session, status } =  useSession();
  const router = useRouter();


  // const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [showApiKey, setShowApiKey] = useState(false);
  const setUser = useSetRecoilState<userAtom>(userAtom)
  const [ snippets , setSnippets] = useRecoilState<snippetAtom[]>(snippetAtom);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = 
      searchQuery === "" ||
      snippet.title.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch ;
  });


  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey);
  };
  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'oauth_success') {
      toast({
        title: "Account Connected",
        description: "Your account has been connected successfully",
      });
      const params = new URLSearchParams(searchParams);
      params.delete('status');

      router.replace(`/dashboard?${params.toString()}`);
    }
  }, [searchParams]);


  useEffect(() => {
    console.log("Session:", session);
    const fetchData = async () => {if (status === "authenticated" && session?.user?.userId) {
      console.log("Session authenticated:", session);
      
      try {
        const data = await getSnippetByUserId(session.user.userId);
        const user = await getUserByUserId(session.user.userId);
        if (user) {
          setUser(user);
        }
        console.log("Data:", data);

        setSnippets(data);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    } else {
      console.log("Session not authenticated or missing userId");
    }
  }
  fetchData();

  },[ session]);
  const deleteAccount = async( )=>{
    if(!session || !session.user.userId) {
      console.error("Session not authenticated or missing userId");
      return;
    };
    console.log("Deleting Account")
    await deleteUserbyId(session.user.userId).then(()=>{
      console.log("Account Deleted")
      toast({
        title: "We will miss you `😢`",
        description: "Your account has been deleted!",
      });
      signOut();
    }).catch((err)=>{console.error(err)});
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
//bg-gradient-to-b from-[#1b1a1a] to-black
  return (
    <div className="min-h-screen bg-zinc-900">
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href={"/"}>
              {" "}
              <div className="flex items-center">
                <CodeIcon className="h-8 w-8 text-primary" />
                <span className="ml-2 text-2xl font-bold text-primary">
                  Snipit
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
                        value={session.user?.name}
                        readOnly
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <Input
                        value={session.user?.email}
                        readOnly
                        className="w-full"
                      />
                    </div>

                    {/* <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        API Key
                      </label>
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
                          {showApiKey ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div> */}
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
Delete Account                    </Button>
                    </div>
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
        <Profile session={session}/>
        <div className="flex justify-between items-center mb-8">
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
          {(searchQuery.length > 0 ? filteredSnippets : snippets).map((snippet) => (
            <Link href={`/snippet/${snippet.id}`} key={snippet.id}>
              <Card  className="overflow-hidden  bg-gradient-to-br from-[#2a2929] to-black group hover:border-primary/50 transition-colors">

                <div className="relative">
                  {/* <img src={snippet.image} alt={snippet.title} className="w-full h-48 object-cover" /> */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
                <CardHeader className="relative">
                <div className="absolute top-2" style={{right: "1rem"}} >
                      <ExternalLinkIcon className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  <CardTitle className="group-hover:text-primary transition-colors flex flex-row">
                    {snippet.title}{" "}
                  </CardTitle>
                  <CardDescription>{snippet.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-lg border shadow-sm overflow-hidden relative">
                    <pre className="overflow-hidden h-24 max-h-24">
                      <code className="text-sm">{snippet.content}</code>
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
