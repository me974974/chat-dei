import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

interface IParams {
    notificationId?: string;
}

export async function DELETE(
    request: Request,
    { params }: { params: IParams }
) {
    try {
        const { notificationId } = params;
        const currentUser = await getCurrentUser();

        if (!currentUser?.id) {
        return NextResponse.json(null);
        }

        const existingNnotification = await prisma.notification.findUnique({
        where: {
            id: notificationId
        },
        include: {
            sender: true,
            receiver: true
        }
        });

        if (!existingNnotification) {
        return new NextResponse('Invalid ID', { status: 400 });
        }

        const deletedNotification = await prisma.notification.delete({
        where: {
            id: notificationId
        },
        });

        return NextResponse.json(deletedNotification);
    } catch (error) {
        return NextResponse.json(null);
    }
}