"use server"

import prisma from "@/lib/prisma";
import {generateAPIToken} from "./generateAPItoken"
import { User } from "@prisma/client";

const data =[
  {
    id: 1,
    title: "Demo Widget",
    description: "[demo] Common useEffect patterns in React",
    content: "useEffect(() => {\n  // Effect code here\n  return () => {\n    // Cleanup code here\n  };\n}, []);",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=300&h=200",
  },
  {
    id: 2,
    title: "Demo Widget 2",
    description: "[demo] Center elements with Tailwind CSS",
    content: '<div className="flex items-center justify-center">\n  <!-- Content here -->\n</div>',
    image:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=300&h=200",
  },
]

export async function createUser({name, email, isGuest}: {name: string, email: string , isGuest?: boolean}) {
  // console.log("Creating user with name: ", name, " and email: ", email);
  // Create user
 const user= await prisma.user.create({
    data: {
      email : email,
      name : name,
      apiKey : generateAPIToken(),
      isGuest: isGuest != undefined ? isGuest : false
    },
  })
  await prisma.snippet.createMany({
    data: data.map((snippet) => ({
      title: snippet.title,
      description: snippet.description,
      content: snippet.content,
       userId : user.id,
  })),
  });
  return user;
}

export async function deleteUserbyId(id: number) {
  return await prisma.user.delete({
    where: {
      id: id,
    },
  });
}


export async function getUserByUserId(id: number) {
    return await prisma.user.findFirst({
        where: {
        id: id,
        },
    });
}


export async function updateUser(user : User){
  return await prisma.user.update({
    where: {
      id: user.id,
    },
    data: user
    
  });
}



export async function transferGuestUser({id , email , name }: {id: number, email: string , name: string}) {
  const user = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      name: name,
      email: email,
      isGuest: false
    },
  });
  return user;
  
}