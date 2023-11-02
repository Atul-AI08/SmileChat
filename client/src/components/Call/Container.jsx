import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { MdOutlineCallEnd } from "react-icons/md";
import dynamic from "next/dynamic";

function Container({ data }) {
  const [{ socket, userInfo }, dispatch] = useStateProvider();
  const [localStream, setLocalStream] = useState(undefined);
  const [publishStream, setPublishStream] = useState(undefined);
  const [callStarted, setCallStarted] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const userVideo = useRef();
  const connectionRef = useRef();
  const myVideo = useRef();
  
  useEffect(() => {
    if (data.type === "out-going"){
      socket.current.on("accept-call", () => setCallAccepted(true));
    }
    else {
      setCallAccepted(true);
    }
  }, [data]);

  useEffect(() => {
    const startCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };
    if (callAccepted && !callStarted) {
      startCall();
      setCallStarted(true);
    }
  }, [callAccepted]);

  const endCall = () => {
    const id = data.id;
    socket.current.emit("reject-video-call", {
      from: id,
    });
    dispatch({ type: reducerCases.END_CALL });
  };

  return (
    <div className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col h-[100vh] overflow-hidden items-center justify-center text-white ">
      <div className="flex flex-col gap-3 items-center">
        <span className="text-5xl">{data.name}</span>
        <span className="text-lg">
          {callAccepted && data.callType !== "video"
            ? "On going call"
            : "Calling"}
        </span>
      </div>
      {(!callAccepted || data.callType === "audio") && (
        <div className="my-24">
          <Image
            src={data.profilePicture}
            alt="avatar"
            height={300}
            width={300}
            className="rounded-full"
          />
        </div>
      )}
      <video playsInline autoPlay className="my-5 relative" ref={myVideo}></video>
      {/* <video playsInline autoPlay className="absolute bottom-5 right-5" ref={myVideo}></video> */}

      <div
        className="rounded-full h-16 w-16 bg-red-600 flex items-center justify-center"
        onClick={endCall}
      >
        <MdOutlineCallEnd className="text-3xl cursor-pointer" />
      </div>
    </div>
  );
}

export default Container;
