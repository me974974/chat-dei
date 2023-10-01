"use client";

import axios from "axios";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import Avatar from "@/app/components/Avatar";
import LoadingModal from "@/app/components/LoadingModal";
import toast from "react-hot-toast";
import getAreFriends from "@/app/actions/getAreFriends";

interface UserBoxProps {
    data: User
}

const UserBox: React.FC<UserBoxProps> = async ({
    data
}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    // const [areFriends, setArefriends] = useState<boolean | null>(null);

    const areFriends = await getAreFriends(data.id);

    const handleCick = useCallback(() => {
        setIsLoading(true);
        
        if (areFriends === true) {
            axios.post('/api/conversations', { 
                userId: data.id
            })
            .then((data) => {
                router.push(`/conversations/${data.data.id}`);
            })
            .finally(() => setIsLoading(false));
        } else {
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
        }
    }, [data, router]);

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