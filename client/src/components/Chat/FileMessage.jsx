import { useStateProvider } from "@/context/StateContext";
import { HOST } from "@/utils/ApiRoutes";
import { calculateTime } from "@/utils/CalculateTime";
import React from "react";
import MessageStatus from "../common/MessageStatus";
import { FileIcon } from 'react-file-icon';

export default function FileMessage({ message }) {
  const [{ currentChatUser, userInfo }] = useStateProvider();
  const filePath = message.message;
  const parts = filePath.split("/");
  const file = parts[parts.length-1];
  const fileParts = file.split(".");
  const fileType = fileParts[1];
  const fileName = fileParts[0].slice(13, fileParts[0].length);
  return (
    <div
      className={`text-white px-2 py-[5px] text-sm rounded-md flex gap-2 items-end max-w-[75%] p-1 rounded-lg ${
        message.senderId === currentChatUser.id
          ? "bg-incoming-background"
          : "bg-outgoing-background"
      }`}
    >
      <div className="flex gap-3">
        <span className="flex items-center gap-2">
          <div className="flex h-11 w-11 px-1 py-[1px]">
            <FileIcon extension={fileType} color="mistyrose" type={(fileType=="png" || fileType=="jpg")? "image":"document"} />
          </div>
          <div><a href={`${HOST}/${message.message}`} download target="_blank">{fileName}</a></div>
        </span>
        <div className="flex items-end gap-1">
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
    </div>
  );
}

