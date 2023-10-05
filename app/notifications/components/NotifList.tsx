"use client";

import { FullNotificationType } from "@/app/types";
import React, { useCallback, useState } from "react";
import NotifBox from "./NotifBox";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface NotificationListProps {
    initialItems: FullNotificationType[];
}

const NotifList: React.FC<NotificationListProps> = ({
    initialItems
}) => {

    const [items, setItems] = useState(initialItems);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onReject = useCallback(() => {
        setIsLoading(true);
        
        items.map((item) => (        
            axios.delete(`/api/notifications/${item.id}`)
            .then(() => {
                toast.success("Demande rejeté avec succès")
            })
            .catch(() => toast.error("Quelque chose s'est mal passé !"))
            .finally(() => setIsLoading(false))
        ))
    }, [items]);

    const onAccept = useCallback(() => {
        setIsLoading(true);
        
        items.map((item) => (
            axios.post('/api/friends', {
                friendId: item.senderId
            })
            .then((data) => {
                toast.success(`Ami ajouté : ${data.data.name}`)
            }),

            axios.delete(`/api/notifications/${item.id}`)
            .catch(() => toast.error("Quelque chose s'est mal passé !"))
            .finally(() => setIsLoading(false)),

            axios.post('/api/conversations', { 
                userId: item.senderId
            })
            .then((data) => {
                router.push(`/conversations/${data.data.id}`);
            })
        ))
    }, [router, items]);

    return (
        <aside
            className="
                fixed
                inset-y-0
                pb-0
                lg:pb-0
                lg:left-20
                lg:w-80
                lg:block
                overflow-y-auto
                border-r
                border-gray-200
                dark:bg-slate-500
            "
        >
            <div className="px-5">
                <div className="flex justify-between mb-4 pt-4">
                    <div className="
                        text-2xl
                        font-bold
                        text-gray-800
                    ">
                        Notifications
                    </div>
                </div>
                {items.map((item) => (
                    <NotifBox 
                        key={item.id}
                        data={item}
                        onAcceptClick={() => {}}
                        onRejectClick={() => {}}
                        isLoading={isLoading}
                    />
                ))}
            </div>
        </aside>
    );
}

export default NotifList;