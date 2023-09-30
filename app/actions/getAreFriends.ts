import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getAreFriends = async (
    friendId: string
) => {
    try {

        const currentUser = await getCurrentUser();

        if (!currentUser?.id) {
            return [];
        }

        const user = await prisma.user.findUnique({
            where: {
                id: currentUser.id,
            },
            include: {
                friends: {
                    where: {
                        id: friendId,
                    },
                },
            },
        });

        return user;
    } catch (error: any) {
        return null;
    }
}

export default getAreFriends;
