"use client";

import { useEffect, useRef, useState } from "react";

import { pusherClient } from "@/app/libs/pusher";
import useConversation from "@/app/hooks/useConversation";
import { FulleMessageType } from "@/app/types";
import { find } from "lodash";

import MessageBox from "./MessageBox";
import axios from "axios";

interface BodyProps {
    initialMessages: FulleMessageType[];
}

const Body: React.FC<BodyProps> = ({
    initialMessages
}) => {
    const [messages, setMessages] = useState(initialMessages);
    console.log(messages)
    console.log(messages.length - 2)
    const bottomRef = useRef<HTMLDivElement>(null);

    const { conversationId } = useConversation();

    useEffect(() => {
        axios.post(`/api//conversations/${conversationId}/seen`)
    }, [conversationId]);

    useEffect(() => {
        pusherClient.subscribe(conversationId)
        bottomRef?.current?.scrollIntoView();
    
        const messageHandler = (message: FulleMessageType) => {
          axios.post(`/api/conversations/${conversationId}/seen`);
    
          setMessages((current) => {
            if (find(current, { id: message.id })) {
              return current;
            }
    
            return [...current, message]
          });
          
          bottomRef?.current?.scrollIntoView();
        };
    
        const updateMessageHandler = (newMessage: FulleMessageType) => {
          setMessages((current) => current.map((currentMessage) => {
            if (currentMessage.id === newMessage.id) {
              return newMessage;
            }
      
            return currentMessage;
          }))
        };
    
        pusherClient.bind('messages:new', messageHandler)
        pusherClient.bind('message:update', updateMessageHandler);
    
        return () => {
          pusherClient.unsubscribe(conversationId)
          pusherClient.unbind('messages:new', messageHandler)
          pusherClient.unbind('message:update', updateMessageHandler)
        }
      }, [conversationId]);

    return (
        <div className="flex-1 overflow-y-auto">
            {messages.map((message, i) => (
                <MessageBox
                    isLast={i === messages.length - 1}
                    key={message.id}
                    data={message}
                />
            ))}
            <div ref={bottomRef} className="pt-24" />
        </div>
    );
}

export default Body;