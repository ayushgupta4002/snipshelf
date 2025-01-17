"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
 
  EyeOff,
  Eye,
  LogOut,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { getSession, signIn, signOut, useSession } from "next-auth/react";

function Nav() {
    const { data: session, status } =  useSession();

  // const [snippets, setSnippets] = useState<Snippet[]>(snippetsData);
  const [showApiKey, setShowApiKey] = useState(false);
  const profileData = {
    name: "John Doe",
    email: "john.doe@example.com",
    apiKey: "sk-12345-abcde-67890",
  };

  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey);
  };
  return (
    <nav className="border-b border-border">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <Link href={"/"}>
          {" "}
          <div className="flex items-center">
            <CodeIcon className="h-8 w-8 text-primary" />
            <span className="ml-2 text-2xl font-bold text-primary">
              Snipit {session.user?.userId}
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

                <div className="space-y-2">
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
                </div>

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => signOut()}
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
  )
}

export default Nav