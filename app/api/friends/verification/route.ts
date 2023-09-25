import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { NextApiRequest, NextApiResponse } from "next";

interface IParams {
    friendId?: string;
}

export async function GET(
    req: NextApiRequest,
    res: NextApiResponse<boolean | { error: string }>
) {
    try {
        const { query } = req;
        const currentUser = await getCurrentUser();
        const { friendId } = query;

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
        res.status(200).json(true);
        } else {
        res.status(200).json(false);
        }
    } catch (error: any) {
        console.log(error, 'ERROR_FRIENDS');
        return new NextResponse('Internal Error', { status: 500 });
    }
}