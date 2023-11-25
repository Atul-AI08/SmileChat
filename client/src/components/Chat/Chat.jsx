import React from "react";
import ChatContainer from "@/components/Chat/ChatContainer";
import GroupChatContainer from "./GroupChatContainer";
import ChatHeader from "@/components/Chat/ChatHeader";
import GroupChatHeader from "./GroupChatHeader";
import MessageBar from "@/components/Chat/MessageBar";
import { useStateProvider } from "@/context/StateContext";

export default function Chat() {
  const [{ currentChatUser }] = useStateProvider();
  return (
    <div className="border-conversation-border border-l w-full bg-conversation-panel-background-light dark:bg-conversation-panel-background-dark flex flex-col h-[100vh] z-10 ">
      {currentChatUser.groupId!==null? <GroupChatHeader />:<ChatHeader />}
      {currentChatUser.groupId!==null? <GroupChatContainer />:<ChatContainer />}
      <MessageBar />
    </div>
  );
}
