import { createSnippet } from '@/helpers/snippet';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';


// POST handler
export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();

    const { apikey , userId } = body;
    let snippets;
    console.log(apikey, userId);

    if ( !apikey  || !userId) {
      return NextResponse.json(
        { error: 'apikey and userId are required.' },
        { status: 400 }
      );
    }

    try{
         snippets = await prisma.user.findFirst({
            where: {
                id : Number(userId),
              apiKey: apikey,
            },
            select :{
                snippets : {
                    select : {
                        id : true,
                        title : true,
                        content : true,
                        description : true,
                        userId : true,
                    }
                }
            }
          });
    }
    catch (error) {
        console.error(error);
      return NextResponse.json({ error: 'Could not create Snippet' }, { status: 404 });
    }

    return NextResponse.json({  snippets }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
