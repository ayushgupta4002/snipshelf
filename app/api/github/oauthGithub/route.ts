
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest , res : NextResponse) {
        // return NextResponse.redirect('http://localhost:3000/dashboard?status=oauth_success');

        return NextResponse.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}`);
   
}
