// app/api/github/create-gist/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/core";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../authOptions";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { filename, content, gistId, snippetId } = body;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
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
        {
          error: "Please Connect Your Account to Github",
          key: "GITHUB_NOT_CONNECTED",
        },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!filename || !content || !gistId) {
      return NextResponse.json(
        {
          error: "Missing required fields: filename , content or gist-id",
          key: "MISSING_FIELDS",
        },
        { status: 400 }
      );
    }

    // Initialize Octokit with the access token
    const octokit = new Octokit({
      auth: accessToken,
    });

    // Create gist using Octokit
    const response = await octokit.request("PATCH /gists/{gist_id}", {
      gist_id: gistId,
      description: "An updated gist description",
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
        key: "UPDATED",
      },
      {
        status: 200,
      }
    );
  } catch (error : any) {
    console.error("Error updating gist:", error);
    if (error.response.data.message == "Not Found") {
      await prisma.snippet
        .update({
          where: {
            id: snippetId,
            userId: session?.user.userId,
          },
          data: {
            gistId: null,
            gistUrl: null,
          },
        })
        .then((res) => {
          console.log("Snippet updated with DELETED gist details", res);
        })
        .catch((error) => {
          console.error(
            "Error updating snippet with DELETED gist details",
            error
          );
        });
      return NextResponse.json(
        {
          error: "Snippet not found in gists please push it again",
          details: "Not Found",
          key: "NOT_FOUND",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to update gist",
        details: error instanceof Error ? error.message : "Unknown error",
        key: "FAILED",
      },
      {
        status: 500,
      }
    );
  }
}
