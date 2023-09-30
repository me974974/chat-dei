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

        if (!user.friends) {
            return false
        } else {
            return true
        }
    } catch (error: any) {
        return false;
    }
}

export default getAreFriends;
