import { createSnippet } from "@/helpers/snippet";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST handler
export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();

    const { title, content, description, userId, apikey } = body;

    if (!apikey) {
      return NextResponse.json(
        { error: "apikey is required." },
        { status: 400 }
      );
    }
    if (!title || !content || !userId) {
      return NextResponse.json(
        { error: "Title and content are required." },
        { status: 400 }
      );
    }

    try {
      const user = await prisma.user.findFirst({
        where: {
          id: Number(userId),
          apiKey: apikey,
        },
        select: {
          id: true,
        },
      });

      if (!user || user.id !== Number(userId)) {
        return NextResponse.json(
          { error: "Could not create Snippet,Please authenticate again" },
          { status: 404 }
        );
      }
      await createSnippet({
        title,
        content,
        description,
        userId: Number(userId),
      });
    } catch (error) {
      return NextResponse.json(
        { error: "Could not create Snippet" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Snippet created successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
