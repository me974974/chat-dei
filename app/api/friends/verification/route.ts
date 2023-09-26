import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export default async function handler(request: Request) {
    try {
        const { query } = await request.json();
        const currentUser = await getCurrentUser();
        const { friendId } = query;

        console.log(friendId);

        if (!currentUser?.id) {
            return NextResponse.json({error: 'Unauthorized'}, { status: 401 });
        }

		if (!friendId) {
			return NextResponse.json({error: 'Invalid id'}, { status: 400 });
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

        console.log('amis', user?.friends);

        if (user && user.friends.length > 0) {
            NextResponse.json(true);
        } else {
            NextResponse.json(false);
        }
    } catch (error: any) {
        console.log(error, 'ERROR_FRIENDS');
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}