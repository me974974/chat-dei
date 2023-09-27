import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function GET(request: Request) {
    try {
        const body = await request.json();
        const currentUser = await getCurrentUser();
        const { friendId } = body;

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

        if (user && user.friends.length > 0) {
            return NextResponse.json(true);
        } else {
            return NextResponse.json(false);
        }
    } catch (error: any) {
        console.log(error, 'ERROR_FRIENDS');
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
