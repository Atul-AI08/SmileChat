import { useStateProvider } from "@/context/StateContext";
import { HOST } from "@/utils/ApiRoutes";
import { calculateTime } from "@/utils/CalculateTime";
import React from "react";
import MessageStatus from "../common/MessageStatus";
import Image from "next/image";
import { AiFillFile } from "react-icons/ai";

export default function FileMessage({ message }) {
  const [{ currentChatUser, userInfo }] = useStateProvider();
  const filePath = message.message;
  const parts = filePath.split("/");
  const file = parts[parts.length-1];
  const fileParts = file.split(".");
  const fileType = fileParts[fileParts.length-1];
  const fileName = parts[parts.length-1].slice(13, parts[parts.length-1].length);
  return (
    <div
      className={`text-white px-2 py-[5px] text-sm flex gap-2 items-end max-w-[65%] p-1 rounded-lg ${
        message.senderId === currentChatUser.id
          ? "bg-incoming-background"
          : "bg-outgoing-background"
      }`}
    >
      {(fileType==="png" || fileType==="jpg") && 
        <div className="relative">
          <Image
            src={`${HOST}/${message.message}`}
            className="rounded-lg"
            alt="asset"
            height={300}
            width={300}
          />
          <div className="absolute bottom-1 right-1 flex items-end gap-1">
            <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
              {calculateTime(message.createdAt)}
            </span>
            <span className="text-bubble-meta">
              {message.senderId === userInfo.id && (
                <MessageStatus messageStatus={message.messageStatus} />
              )}
            </span>
          </div>
        </div>
      }
      {fileType==="mp3" && (
        <div className="relative">
          <audio
            controls
            src={`${HOST}/${message.message}`}
            className="h-26 m-2 rounded-md mb-7"
            alt=""
          />
          <div className="absolute bottom-1 right-1 flex items-end gap-1">
            <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
              {calculateTime(message.createdAt)}
            </span>
            <span className="text-bubble-meta">
              {message.senderId === userInfo.id && (
                <MessageStatus messageStatus={message.messageStatus} />
              )}
            </span>
          </div>
        </div>
      )}
      {fileType==="pdf" && (
        <div className="relative">
          <iframe
            loading="lazy"
            allowFullScreen={true}
            src={`${HOST}/${message.message}`}
            className="h-96 w-auto m-1 rounded-md mb-7"
            alt=""
          />
          <div className="absolute bottom-1 right-1 flex items-end gap-1">
            <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
              {calculateTime(message.createdAt)}
            </span>
            <span className="text-bubble-meta">
              {message.senderId === userInfo.id && (
                <MessageStatus messageStatus={message.messageStatus} />
              )}
            </span>
          </div>
        </div>
      )}
      {fileType!=="png" && fileType!=="jpg" && fileType!=="pdf" && fileType!=="mp3" && (
        <div className="relative">
          <span className="flex items-center mb-7 mr-3 bg-input-background rounded-md">
            <AiFillFile className="text-panel-header-icon-light dark:text-panel-header-icon-dark text-4xl m-1"/>
            <div className="mr-3"><a href={`${HOST}/${message.message}`} download>{fileName}</a></div>
          </span>
          <div className="absolute bottom-1 right-1 flex items-end gap-1">
            <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
              {calculateTime(message.createdAt)}
            </span>
            <span className="text-bubble-meta">
              {message.senderId === userInfo.id && (
                <MessageStatus messageStatus={message.messageStatus} />
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

