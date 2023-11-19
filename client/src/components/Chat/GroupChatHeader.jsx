import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiSearchAlt2 } from "react-icons/bi";
import { MdGroupAdd } from "react-icons/md";
import { FaFileExport } from "react-icons/fa6";
import { IoExit } from "react-icons/io5";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import ContextMenu from "../common/ContextMenu";
import { calculateTime } from "@/utils/CalculateTime";
import { PiClockCountdownFill } from 'react-icons/pi'
import { Modal } from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'
import { ADD_GROUP_MEMBER, LEAVE_GROUP } from "@/utils/ApiRoutes";
import axios from "axios";

export default function ChatHeader() {
  const [{ userInfo, currentChatUser, messages }, dispatch] =
    useStateProvider();
  
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [addMember, setAddMember] = useState("");
  const [contextMenuCordinates, setContextMenuCordinates] = useState({
    x: 0,
    y: 0,
  });
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);

  const showContextMenu = (e) => {
    e.preventDefault();
    setContextMenuCordinates({ x: e.pageX - 70, y: e.pageY + 20 });
    setIsContextMenuVisible(true);
  };

    const contextMenuOptions = [
        {
            name: "Exit",
            callBack: async () => {
                setIsContextMenuVisible(false);
                dispatch({ type: reducerCases.SET_EXIT_CHAT });
            },
        }
    ];

    const exportChat = () => {
        const filteredMessages = messages.filter(msg => msg.type !== 'file' && msg.type !== 'audio');
        const formattedText = filteredMessages.map(({ id, senderId, senderName, receiverId, type, message, messageStatus, createdAt }) => {
        return `Sender: ${senderName}\nMessage: ${message}\nSent : ${calculateTime(createdAt)}\n---------------------------------------\n`;
        }).join('');
        const file = new Blob([formattedText], {
        type: 'text/plain'
        });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(file);
        a.download = `messages_${currentChatUser?.name}.txt`;
        a.click();
        URL.revokeObjectURL(a.href);
    }

    const onOpenModal = () => {
        setOpen(true)
    }

    const onCloseModal = () => {
        setOpen(false)
    }
    
    const handleTimeSelection = (time) => {
        onCloseModal()
    }

    const onOpenModal2 = () => {
        setOpen2(true)
    }

    const onCloseModal2 = () => {
        setAddMember("")
        setOpen2(false)
    }

    const addGroupMember = async () => {
        try {
            setOpen2(false)
            const { data } = await axios.post(ADD_GROUP_MEMBER, {
                groupId: currentChatUser.groupId, 
                email: addMember
            });
            setAddMember("")
        } catch (err) {
            console.log(err);
        }
    }

    const leaveGroup = async () => {
        try {
            const { data } = await axios.post(LEAVE_GROUP, {
                userId: currentChatUser.id,
                groupId: currentChatUser.groupId, 
                uid: userInfo.id,
            });
            dispatch({ type: reducerCases.SET_EXIT_CHAT });
        } catch (err) {
            console.log(err);
        }
    }

    return (
    <div className="h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background-light dark:bg-panel-header-background-dark z-10">
        <div className="flex items-center justify-center gap-6">
            <Avatar type="sm" image={currentChatUser?.profilePicture} />
            <span className="text-primary-strong">{currentChatUser?.name}</span>
        </div>
        <div className="flex gap-6 ">
            <PiClockCountdownFill
            className="text-panel-header-icon-light dark:text-panel-header-icon-dark cursor-pointer text-xl"
            onClick={onOpenModal}
            />
            <MdGroupAdd
            className="text-panel-header-icon-light dark:text-panel-header-icon-dark cursor-pointer text-xl"
            onClick={onOpenModal2}
            />
            <FaFileExport
            className="text-panel-header-icon-light dark:text-panel-header-icon-dark cursor-pointer text-xl"
            onClick={exportChat}
            />
            <BiSearchAlt2
            className="text-panel-header-icon-light dark:text-panel-header-icon-dark cursor-pointer text-xl"
            onClick={() => dispatch({ type: reducerCases.SET_MESSAGES_SEARCH })}
            />
            <IoExit
            className="text-panel-header-icon-light dark:text-panel-header-icon-dark cursor-pointer text-xl"
            onClick={leaveGroup}
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
            open={open2}
            onClose={onCloseModal2}
            classNames={{ modal: 'dissapearing-modal' }}
            center
        >
            <h2 className="text-2xl font-semibold mb-4 text-white">
                Add Group Member
            </h2>
            <h3 className="text-xl font-semibold mb-4 text-white">
                Enter the email of user:
            </h3>
            <div>
                <div className="inline-flex items-center">
                    <input
                    type="text"
                        value={addMember}
                        onChange={(e) => setAddMember(e.target.value)}
                        className="bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg pl-5 pr-5 py-4 w-[500px]"
                    />
                    <button
                        className="bg-search-input-container-background p-[11px] mx-2 rounded-lg"
                        onClick={addGroupMember}
                    >
                    Add
                    </button>
                </div>
            </div>
        </Modal>
        <Modal
            open={open}
            onClose={onCloseModal}
            classNames={{ modal: 'dissapearing-modal' }}
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
