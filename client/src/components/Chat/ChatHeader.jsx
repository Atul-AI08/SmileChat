import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiSearchAlt2 } from "react-icons/bi";
import { MdCall } from "react-icons/md";
import { IoVideocam } from "react-icons/io5";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import ContextMenu from "../common/ContextMenu";
import { calculateTime } from "@/utils/CalculateTime";

export default function ChatHeader() {
  const [{ userInfo, currentChatUser, onlineUsers }, dispatch] =
    useStateProvider();

  const [contextMenuCordinates, setContextMenuCordinates] = useState({
    x: 0,
    y: 0,
  });
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);

  const showContextMenu = (e) => {
    e.preventDefault();
    setContextMenuCordinates({ x: e.pageX - 130, y: e.pageY + 20 });
    setIsContextMenuVisible(true);
  };

  const contextMenuOptions = [
    {
      name: "Exit",
      callBack: async () => {
        setIsContextMenuVisible(false);
        dispatch({ type: reducerCases.SET_EXIT_CHAT });
      },
    },
    {
      name: "Export Chat",
      callBack: async () => {
        const filteredMessages = messages.filter(msg => msg.type !== 'file' && msg.type !== 'audio');
        const formattedText = filteredMessages.map(({ id, senderId, receiverId, type, message, messageStatus, createdAt }) => {
          let sender = (senderId == userInfo?.id) ? "Me" : currentChatUser?.name;
          let reciever = (senderId == userInfo?.id) ? currentChatUser?.name : "Me";
          return `Sender: ${sender}\nReceiver: ${reciever}\nMessage: ${message}\nMessage Status: ${messageStatus}\nSent : ${calculateTime(createdAt)}\n---------------------------------------\n`;
        }).join('');
        const file = new Blob([formattedText], {
          type: 'text/plain'
        });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(file);
        a.download = `messages_${currentChatUser?.name}.txt`;
        a.click();
        URL.revokeObjectURL(a.href);
      },
    }
  ];

  const handleVoiceCall = () => {
    dispatch({
      type: reducerCases.SET_VOICE_CALL,
      voiceCall: {
        ...currentChatUser,
        type: "out-going",
        callType: "audio",
        roomId: Date.now(),
      },
    });
  };

  const handleVideoCall = () => {
    dispatch({
      type: reducerCases.SET_VIDEO_CALL,
      videoCall: {
        ...currentChatUser,
        type: "out-going",
        callType: "video",
        roomId: Date.now(),
      },
    });
  };

  return (
  <div className="h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background-light dark:bg-panel-header-background-dark z-10">
      <div className="flex items-center justify-center gap-6">
        <Avatar type="sm" image={currentChatUser?.profilePicture} />
        <div className="flex flex-col">
          <span className="text-primary-strong">{currentChatUser?.name}</span>
          <span className="text-secondary text-sm">
            {onlineUsers.includes(currentChatUser.id) ? "Online" : "Last seen at " + calculateTime(currentChatUser?.lastSeen)}
          </span>
        </div>
      </div>
      <div className="flex gap-6 ">
        <MdCall
          className="text-panel-header-icon-light dark:text-panel-header-icon-dark cursor-pointer text-xl"
          onClick={handleVoiceCall}
        />
        <IoVideocam
          className="text-panel-header-icon-light dark:text-panel-header-icon-dark cursor-pointer text-xl"
          onClick={handleVideoCall}
        />
        <BiSearchAlt2
          className="text-panel-header-icon-light dark:text-panel-header-icon-dark cursor-pointer text-xl"
          onClick={() => dispatch({ type: reducerCases.SET_MESSAGES_SEARCH })}
        />
        <BsThreeDotsVertical
          className="text-panel-header-icon-light dark:text-panel-header-icon-dark cursor-pointer text-xl"
          onClick={(e) => showContextMenu(e)}
          id="context-opener"
        />
        {isContextMenuVisible && (
          <ContextMenu
            options={contextMenuOptions}
            cordinates={contextMenuCordinates}
            contextMenu={isContextMenuVisible}
            setContextMenu={setIsContextMenuVisible}
          />
        )}
      </div>
    </div>
  );
}
