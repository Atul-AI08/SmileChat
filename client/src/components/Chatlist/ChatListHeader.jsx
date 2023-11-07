import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { BsFillChatLeftTextFill, BsThreeDotsVertical, BsCameraVideoFill } from "react-icons/bs";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { useRouter } from "next/router";
import ContextMenu from "../common/ContextMenu";

export default function ChatListHeader() {
  const [{ userInfo }, dispatch] = useStateProvider();
  const router = useRouter();
  const [contextMenuCordinates, setContextMenuCordinates] = useState({
    x: 0,
    y: 0,
  });
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);

  const showContextMenu = (e) => {
    e.preventDefault();
    setContextMenuCordinates({ x: e.pageX, y: e.pageY });
    setIsContextMenuVisible(true);
  };

  const contextMenuOptions = [
    {
      name: "Profile",
      callBack: async () => {
        setIsContextMenuVisible(false);
        router.push("/profile");
      },
    },
    {
      name: "Logout",
      callBack: async () => {
        setIsContextMenuVisible(false);
        router.push("/logout");
      },
    },
  ];

  const startVideoConference = () => {
    router.push("/VideoConference");
  }

  const handleAllContactsPage = () => {
    dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE });
  };

  return (
    <div className="bg-panel-header-background-light dark:bg-panel-header-background-dark h-16 px-4 py-3 flex justify-between items-center">
      <div className="cursor-pointer">
        <Avatar type="sm" image={userInfo?.profileImage} />
      </div>
      <div className="flex gap-6 ">
        <BsFillChatLeftTextFill
          className="text-panel-header-icon-light dark:text-panel-header-icon-dark cursor-pointer text-xl"
          title="New chat"
          onClick={handleAllContactsPage}
        />
        <BsCameraVideoFill
          className="text-panel-header-icon-light dark:text-panel-header-icon-dark cursor-pointer text-xl"
          title="Video Conference"
          onClick={startVideoConference}
        />
        <>
          <BsThreeDotsVertical
            className="text-panel-header-icon-light dark:text-panel-header-icon-dark cursor-pointer text-xl"
            title="Menu"
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
        </>
      </div>
    </div>
  );
}
