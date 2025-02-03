
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../../authOptions';
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest , res : NextResponse) {
    const searchParams = request.nextUrl.searchParams
    const code  = searchParams.get('code')   
    const session = await getServerSession(authOptions);

    if (!code) {
        return NextResponse.json({ error: 'Code is required' }, { status: 400 });

    }
    const scope="gist"

    try {
        // Exchange code for access token
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
                scope,
            }),
        });

        const tokenData = await tokenResponse.json();
        const { access_token } = tokenData;

        if (!access_token) {
            return NextResponse.json({ error:  'Failed to get access token'  }, { status: 400 });

        }

        // Get user details
        // const userResponse = await fetch('https://api.github.com/user', {
        //     method: 'GET',
        //     headers: {
        //         Authorization: `Bearer ${access_token}`,
        //     },
        // });

        // const userData = await userResponse.json();
        // const { email, login } = userData;
        await prisma.user.update({
            where: {
                id: session?.user.userId
            },
            data: {
                githubToken: access_token
            }
        }).then((data) => {
            console.log("data pushed in database");
        }).catch((error) => {
            console.log(error);
            return NextResponse.json({ error:  'Failed to push access token'  }, { status: 400 });
        });

        console.log('User Data: TOKEN :', access_token);
     

        return NextResponse.redirect('http://snipshelf.in/dashboard?status=oauth_success');
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error:   'Internal Server Error'  }, { status: 500 });
    }
}
