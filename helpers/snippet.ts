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


export async function updateSnippet(snippet : Snippet){
  return await prisma.snippet.update({
    where: {
      id: snippet.id,
    },
    data: {
      title: snippet.title,
      content: snippet.content,
      description: snippet.description,
    },
  });
}