// app/api/github/create-gist/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/core";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../authOptions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filename, content, snippetId } = body;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized", key: "UNAUTHORIZED" },
        { status: 401 }
      );
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
    if (!accessToken) {
      return NextResponse.json(
        { error: "Please Connect Your Account to Github" , key: "GITHUB_NOT_CONNECTED"},
        { status: 400 }
      );
    }

    // Validate required fields
    if (!filename || !content) {
      return NextResponse.json(
        { error: "Missing required fields: filename or content" , key: "MISSING_FIELDS"},
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

    if (response.data) {
      await prisma.snippet
        .update({
          where: {
            id: snippetId,
            userId: session?.user.userId,
          },
          data: {
            gistId: response.data.id,
            gistUrl: response.data.html_url,
          },
        })
        .then((res) => {
          console.log("Snippet updated with gist details", res);
        })
        .catch((error) => {
          console.error("Error updating snippet with gist details", error);
        });
    }
    return NextResponse.json(
      {
        success: true,
        gist: response.data,
        url: response.data.html_url,
        key: "CREATED",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating gist:", error);

    return NextResponse.json(
      {
        error: "Failed to create gist",
        details: error instanceof Error ? error.message : "Unknown error",
        key: "FAILED",
      },
      {
        status: 500,
      }
    );
  }
}
