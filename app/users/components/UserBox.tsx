"use client";

import axios from "axios";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import Avatar from "@/app/components/Avatar";
import LoadingModal from "@/app/components/LoadingModal";
import toast from "react-hot-toast";

interface UserBoxProps {
    data: User
}

const UserBox: React.FC<UserBoxProps> = ({
    data
}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [isalreadyFriend, setisAlreadyFriend] = useState(false);

    const handleCick = useCallback(() => {
        setIsLoading(true);

        const checkAlreadyFriends = async () => {
            try {
                const response = await axios.get('/api/friends/verification', { params: { friendId: data.id } });
                console.log('résulat : ', response.data);
                setisAlreadyFriend(response.data);
            } catch (error: any) {
                console.error('Echec lors de la vérification de l\'amitié :', error);
            }
        };

        checkAlreadyFriends()

        if (!isalreadyFriend) {
            axios.post('/api/friends', {
                friendId: data.id
            })
            toast.success(`Ami ajouté : ${data.name}`);

            axios.post('/api/conversations', { 
                userId: data.id
            })
            .then((data) => {
                router.push(`/conversations/${data.data.id}`);
            })
            .finally(() => setIsLoading(false));
        } else {
            axios.post('/api/conversations', { 
                userId: data.id
            })
            .then((data) => {
                router.push(`/conversations/${data.data.id}`);
            })
            .finally(() => setIsLoading(false));
        }
    }, [data, router, isalreadyFriend]);

    return (
        <>
            {isLoading && (
                <LoadingModal />
            )}
            <div
                onClick={handleCick}
                className="
                    w-full
                    relative
                    flex
                    items-center
                    space-x-3
                    bg-white
                    dark:bg-slate-500
                    hover:bg-neutral-100
                    dark:hover:bg-slate-600
                    rounded-lg
                    transition
                    curosr-pointer
                "
            >
                <Avatar user={data} />
                <div className="min-w-0 flex-1">
                    <div className="focus:outline-none">
                        <div
                            className="
                                flex
                                justify-between
                                items-center
                                mb-1
                            "
                        >
                            <p 
                                className="
                                    text-sm
                                    font-medium
                                    text-gray-900
                                "
                            >
                                {data.name}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserBox;