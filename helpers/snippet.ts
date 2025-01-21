"use server"

import prisma from "@/lib/prisma";
import { Snippet } from "@/types";

export async function createSnippet({ title, content, description, userId }: { title: string; content: string; description: string; userId: number }) {
  // Create snippet
  await prisma.snippet.create({
    data: {
      title: title,
      content: content,
      description: description,
      userId: userId,
    },
  });
}


export async function getSnippetByUserId(id: number) {
    return await prisma.snippet.findMany({
        where: {
        userId: id,
        },
    });
}

export async function getSnippetBySnipId({snipId ,userId}:{snipId : number , userId : number}) {
  return await prisma.snippet.findFirst({
    where:{
      id: snipId,
      userId : userId
    }
  })
}


export async function updateSnippet(snippet : Snippet , userId : number){
  return await prisma.snippet.update({
    where: {
      id: snippet.id,
      userId : userId 
    },
    data: {
      title: snippet.title,
      content: snippet.content,
      description: snippet.description,
    },
  });
}

export async function deleteSnippetbyId(snipId : number , userId : number){
  return await prisma.snippet.delete({
    where: {
      id: snipId,
      userId : userId
    },
  });
}

export async function getShareLink({snipId ,userId}:{snipId : number , userId : number}){
  return await prisma.snippet.update({
    where: {
      id: snipId,
      userId : userId
    },
    data: {
      shareId: Math.random().toString(36).substring(7),
    },
  });
  
}

export async function getSnippetByShareId({snipId ,shareId}:{snipId : number , shareId : string}){
  return await prisma.snippet.findFirst({
    where:{
      shareId: shareId,
      id: snipId
    }
  })
}