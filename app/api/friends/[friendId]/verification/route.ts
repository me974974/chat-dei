import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

interface IParams {
    friendId?: string;
}

export async function POST(
    request: Request,
    { params }: { params: IParams }
) {
    try {
        const currentUser = await getCurrentUser();
        const body = await request.json();
        const {
            friendId
        } = params;

        if (!currentUser?.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

		if (!friendId) {
			return new NextResponse('Invalid id', { status: 400 });
		}

        const areFriends = await prisma.user.findFirst({
			where: {
				id: currentUser.id,
				friends: {
					some: {
					id: friendId,
					},
				},
			},
		});

        const isAlreadyFriends = !!areFriends;

        return(NextResponse.json({ isAlreadyFriends }));
    } catch (error: any) {
        console.log(error, 'ERROR_FRIENDS');
        return new NextResponse('Internal Error', { status: 500 });
    }
}