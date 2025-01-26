import { verifyAPIkey } from '@/helpers/snippet';
import { NextResponse } from 'next/server';


// POST handler
export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();

    const { signed_apiKey } = body;

    if (!signed_apiKey) {
      return NextResponse.json(
        { error: 'API KEY is required.' },
        { status: 400 }
      );
    }
    const apiKey = signed_apiKey
    try{
      const data = await verifyAPIkey({ apiKey });
      if(!data){
        return NextResponse.json({ error: 'Could not get account' }, { status: 404 });
      }
      return NextResponse.json({ data }, { status: 200 });

    }
    catch (error) {
      return NextResponse.json({ error: 'Could not get account' }, { status: 404 });
    }

  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
