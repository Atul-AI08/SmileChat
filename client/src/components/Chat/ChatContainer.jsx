import { useStateProvider } from "@/context/StateContext";
import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
import FileMessage from "./FileMessage";

const VoiceMessage = dynamic(() => import("@/components/Chat/VoiceMessage"), {
  ssr: false,
});

export default function ChatContainer() {
  const [{ messages, currentChatUser, userInfo }] = useStateProvider();

  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const lastMessage =
      container.lastElementChild.lastElementChild.lastElementChild
        .lastElementChild;

    if (lastMessage) {
      lastMessage.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div
      className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar "
      ref={containerRef}
    >
      <div className="bg-fixed h-full w-full opacity-5 fixed left-0 top-0 z-0"></div>
      <div className="mx-10 my-6 relative bottom-0 left-0 ">
        <div className="flex w-full">
          <div className="flex flex-col justify-end w-full gap-1 overflow-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.senderId === currentChatUser.id
                    ? "justify-start"
                    : "justify-end"
                }`}
              >
                {message.type === "text" && (
                  <div
                    className={`text-white px-2 py-[5px] text-sm rounded-md flex gap-2 items-end max-w-[45%]	 ${
                      message.senderId === currentChatUser.id
                        ? "bg-incoming-background"
                        : "bg-outgoing-background"
                    }`}
                  >
                    <span className="break-all">{message.message}</span>
                    <div className="flex gap-1 items-end">
                      <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
                        {calculateTime(message.createdAt)}
                      </span>
                      <span>
                        {message.senderId === userInfo.id && (
                          <MessageStatus
                            messageStatus={message.messageStatus}
                          />
                        )}
                      </span>
                    </div>
                  </div>
                )}
                {message.type === "file" && <FileMessage message={message} />}
                {message.type === "audio" && <VoiceMessage message={message} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
