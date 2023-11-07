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
import { PiClockCountdownFill } from 'react-icons/pi'
import { Modal } from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'

export default function ChatHeader() {
  const [{ userInfo, currentChatUser, onlineUsers,messages }, dispatch] =
    useStateProvider();
  
  const [open, setOpen] = useState(false)
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

  const onOpenModal = () => {
    setOpen(true)
  }

  const onCloseModal = () => {
    setOpen(false)
  }

  const handleTimeSelection = (time) => {
    onCloseModal()
}

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
        <PiClockCountdownFill
          className="text-panel-header-icon-light dark:text-panel-header-icon-dark cursor-pointer text-xl"
          onClick={onOpenModal}
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
      <Modal
          open={open}
          onClose={onCloseModal}
          classNames={{
              modal: 'dissapearing-modal',
          }}
          center
      >
          <h2 className="text-2xl font-semibold mb-4 text-white">
              Disappearing Message
          </h2>
          <h3 className="text-xl font-semibold mb-4 text-white">
              Choose the duration for disappearing message
          </h3>
          <div className="disappearing-options">
              <div class="inline-flex items-center">
                  <label
                      class="relative flex cursor-pointer items-center rounded-full p-3"
                      for="html"
                      data-ripple-dark="true"
                  >
                      <input
                          id="html"
                          name="type"
                          type="radio"
                          class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-pink-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-pink-500 checked:before:bg-pink-500 hover:before:opacity-10"
                          value="0"
                          // checked={disappearingMessageTime === 0}
                          onChange={() => handleTimeSelection(0)}
                      />
                      <div class="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-pink-500 opacity-0 transition-opacity peer-checked:opacity-100">
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-3.5 w-3.5"
                              viewBox="0 0 16 16"
                              fill="currentColor"
                          >
                              <circle
                                  data-name="ellipse"
                                  cx="8"
                                  cy="8"
                                  r="8"
                              ></circle>
                          </svg>
                      </div>
                  </label>
                  <label
                      class="mt-px cursor-pointer select-none text-white"
                      for="html"
                  >
                      OFF
                  </label>
              </div>
              <div class="inline-flex items-center">
                  <label
                      class="relative flex cursor-pointer items-center rounded-full p-3"
                      for="html"
                      data-ripple-dark="true"
                  >
                      <input
                          id="html"
                          name="type"
                          type="radio"
                          class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-pink-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-pink-500 checked:before:bg-pink-500 hover:before:opacity-10"
                          value="5"
                          // checked={disappearingMessageTime === 5}
                          onChange={() => handleTimeSelection(5)}
                      />
                      <div class="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-pink-500 opacity-0 transition-opacity peer-checked:opacity-100">
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-3.5 w-3.5"
                              viewBox="0 0 16 16"
                              fill="currentColor"
                          >
                              <circle
                                  data-name="ellipse"
                                  cx="8"
                                  cy="8"
                                  r="8"
                              ></circle>
                          </svg>
                      </div>
                  </label>
                  <label
                      class="mt-px cursor-pointer select-none text-white"
                      for="html"
                  >
                      5 minutes
                  </label>
              </div>
              <div class="inline-flex items-center">
                  <label
                      class="relative flex cursor-pointer items-center rounded-full p-3"
                      for="html"
                      data-ripple-dark="true"
                  >
                      <input
                          id="html"
                          name="type"
                          type="radio"
                          class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-pink-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-pink-500 checked:before:bg-pink-500 hover:before:opacity-10"
                          value="30"
                          // checked={disappearingMessageTime === 30}
                          onChange={() => handleTimeSelection(30)}
                      />
                      <div class="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-pink-500 opacity-0 transition-opacity peer-checked:opacity-100">
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-3.5 w-3.5"
                              viewBox="0 0 16 16"
                              fill="currentColor"
                          >
                              <circle
                                  data-name="ellipse"
                                  cx="8"
                                  cy="8"
                                  r="8"
                              ></circle>
                          </svg>
                      </div>
                  </label>
                  <label
                      class="mt-px cursor-pointer select-none text-white"
                      for="html"
                  >
                      30 minutes
                  </label>
              </div>
              <div class="inline-flex items-center">
                  <label
                      class="relative flex cursor-pointer items-center rounded-full p-3"
                      for="html"
                      data-ripple-dark="true"
                  >
                      <input
                          id="html"
                          name="type"
                          type="radio"
                          class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-pink-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-pink-500 checked:before:bg-pink-500 hover:before:opacity-10"
                          value="60"
                          // checked={disappearingMessageTime === 60}
                          onChange={() => handleTimeSelection(60)}
                      />
                      <div class="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-pink-500 opacity-0 transition-opacity peer-checked:opacity-100">
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-3.5 w-3.5"
                              viewBox="0 0 16 16"
                              fill="currentColor"
                          >
                              <circle
                                  data-name="ellipse"
                                  cx="8"
                                  cy="8"
                                  r="8"
                              ></circle>
                          </svg>
                      </div>
                  </label>
                  <label
                      class="mt-px cursor-pointer select-none text-white"
                      for="html"
                  >
                      60 minutes
                  </label>
              </div>
              <div class="inline-flex items-center">
                  <label
                      class="relative flex cursor-pointer items-center rounded-full p-3"
                      for="html"
                      data-ripple-dark="true"
                  >
                      <input
                          id="html"
                          name="type"
                          type="radio"
                          class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-pink-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-pink-500 checked:before:bg-pink-500 hover:before:opacity-10"
                          value="1440"
                          // checked={disappearingMessageTime === 1440}
                          onChange={() => handleTimeSelection(1440)}
                      />
                      <div class="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-pink-500 opacity-0 transition-opacity peer-checked:opacity-100">
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-3.5 w-3.5"
                              viewBox="0 0 16 16"
                              fill="currentColor"
                          >
                              <circle
                                  data-name="ellipse"
                                  cx="8"
                                  cy="8"
                                  r="8"
                              ></circle>
                          </svg>
                      </div>
                  </label>
                  <label
                      class="mt-px cursor-pointer select-none text-white"
                      for="html"
                  >
                      1 day
                  </label>
              </div>
              <div class="inline-flex items-center">
                  <label
                      class="relative flex cursor-pointer items-center rounded-full p-3"
                      for="html"
                      data-ripple-dark="true"
                  >
                      <input
                          id="html"
                          name="type"
                          type="radio"
                          class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-pink-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-pink-500 checked:before:bg-pink-500 hover:before:opacity-10"
                          value="10080"
                          // checked={disappearingMessageTime === 10080}
                          onChange={() => handleTimeSelection(10080)}
                      />
                      <div class="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-pink-500 opacity-0 transition-opacity peer-checked:opacity-100">
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-3.5 w-3.5"
                              viewBox="0 0 16 16"
                              fill="currentColor"
                          >
                              <circle
                                  data-name="ellipse"
                                  cx="8"
                                  cy="8"
                                  r="8"
                              ></circle>
                          </svg>
                      </div>
                  </label>
                  <label
                      class="mt-px cursor-pointer select-none text-white"
                      for="html"
                  >
                      7 day
                  </label>
              </div>
          </div>
      </Modal>
    </div>
  );
}
