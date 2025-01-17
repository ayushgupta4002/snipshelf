import { createSnippet } from '@/helpers/snippet';
import { NextResponse } from 'next/server';


// POST handler
export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();

    const { title , content ,description, userId } = body;

    if (!title || !content  || !userId) {
      return NextResponse.json(
        { error: 'Title and content are required.' },
        { status: 400 }
      );
    }

    try{
    await createSnippet({ title, content, description, userId });
    }
    catch (error) {
      return NextResponse.json({ error: 'Could not create Snippet' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Snippet created successfully!' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
