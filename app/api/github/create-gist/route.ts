// app/api/github/create-gist/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/core";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../authOptions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filename, content } = body;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await prisma.user.findFirst({
      where: {
        id: session?.user.userId,
      },
      select: {
        githubToken: true,
      },
    });

    const accessToken = user?.githubToken;

    // Validate required fields
    if (!filename || !content || !accessToken) {
      return NextResponse.json(
        { error: "Missing required fields: filename, content, or accessToken" },
        { status: 400 }
      );
    }

    // Initialize Octokit with the access token
    const octokit = new Octokit({
      auth: accessToken,
    });

    // Create gist using Octokit
    const response = await octokit.request("POST /gists", {
      description: "Created via API",
      public: true,
      files: {
        [filename]: {
          content: content,
        },
      },
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    return NextResponse.json(
      {
        success: true,
        gist: response.data,
        url: response.data.html_url,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error creating gist:", error);

    return NextResponse.json(
      {
        error: "Failed to create gist",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}
