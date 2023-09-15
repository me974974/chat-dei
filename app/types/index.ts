import { Conversation, Message, User } from "@prisma/client";

export type FulleMessageType = Message & {
    sender: User,
    seen: User[]
};

export type FulleConversationType = Conversation & {
    users: User[],
    messages: FulleMessageType[],
};