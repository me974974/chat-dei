import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { NextApiRequest, NextApiResponse } from "next";

interface IParams {
    friendId?: string;
}

export async function GET(
    req: Request,
) {
    try {
        const body = await req.json();
        const currentUser = await getCurrentUser();
        const { friendId } = body;

        console.log(friendId);

        if (!currentUser?.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

		if (!friendId) {
			return new NextResponse('Invalid id', { status: 400 });
		}

        const user = await prisma.user.findUnique({
                where: {
                id: currentUser.id as string,
                },
                include: {
                friends: {
                    where: {
                    id: friendId as string,
                    },
                },
                },
            });

        if (user && user.friends.length > 0) {
            NextResponse.json(true);
        } else {
            NextResponse.json(false);
        }
    } catch (error: any) {
        console.log(error, 'ERROR_FRIENDS');
        return new NextResponse('Internal Error', { status: 500 });
    }
}