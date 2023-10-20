import React, { useEffect, useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import { FaMicrophone } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import { useStateProvider } from "@/context/StateContext";
import EmojiPicker from "emoji-picker-react";

function MessageBar() {
  return (
    <div className="bg-panel-header-background  h-20 px-4 flex items-center gap-6  relative">
        <>
          <div className="flex gap-6">
            <BsEmojiSmile
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Emoji"
            />
            <ImAttachment
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Attach File"
            />
          </div>
          <div className="w-full rounded-lg h-10 flex items-center">
            <input
              type="text"
              placeholder="Type a message"
              className="bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg pl-5 pr-5 py-4 w-full"
            />
          </div>
          <div className=" w-10 flex items-center justify-center">
              <button>
                <MdSend className="text-panel-header-icon cursor-pointer text-xl" title="Send Message" />
                {/* <FaMicrophone className="text-panel-header-icon cursor-pointer text-xl"
                 title="Record" /> */}
              </button>
          </div>
        </>
    </div>
  );
}

export default MessageBar;
