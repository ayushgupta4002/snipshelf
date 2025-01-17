import { createSnippet, getSnippetByUserId } from '@/helpers/snippet';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authOptions } from '../authOptions';

export async function GET(request: NextRequest) {
  try {
    // Get the server session with auth options
    const session = await getServerSession(authOptions);
    const searchParams = request.nextUrl.searchParams
    const id  = searchParams.get('id')   
    console.log(session) 
    if(!id){
      return NextResponse.json(
        { error: 'User Id is required' },
        { status: 400 }
      );
    }
    // If no session exists, return unauthorized
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    })
    if(user?.id?.toString() !== id){
      console.log('user',user?.id)
      console.log('id',id)
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const snippets = await getSnippetByUserId(user.id);

    // Return the session data
    return NextResponse.json({ 
     snippets : snippets
    }, { status: 200 });

  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}

// // POST handler example for creating snippets
// export async function POST(request: Request) {
//   try {
//     // Get the session first
//     const session = await getServerSession(authOptions);
    
//     if (!session?.user?.userId) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     // Parse the request body
//     const body = await request.json();
//     const { title, content, description } = body;
    
//     // Validate required fields
//     if (!title || !content) {
//       return NextResponse.json(
//         { error: 'Title and content are required.' },
//         { status: 400 }
//       );
//     }

//     // Create snippet using the userId from session
//     try {
//       const snippet = await createSnippet({ 
//         title, 
//         content, 
//         description, 
//         userId: session.user.userId 
//       });

//       return NextResponse.json({ snippet }, { status: 201 });
//     } catch (error) {
//       console.error('Snippet creation error:', error);
//       return NextResponse.json(
//         { error: 'Could not create Snippet' },
//         { status: 404 }
//       );
//     }

//   } catch (error) {
//     console.error('Request error:', error);
//     return NextResponse.json(
//       { error: 'Something went wrong.' },
//       { status: 500 }
//     );
//   }
// }