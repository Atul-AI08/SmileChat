import React, { useEffect } from "react";

import { useStateProvider } from "@/context/StateContext";
import dynamic from "next/dynamic";
const AudioContainer = dynamic(() => import("@/components/Call/AudioContainer"), {
  ssr: false,
});

function VoiceCall() {
  const [{ voiceCall, socket, userInfo }] = useStateProvider();

  useEffect(() => {
    if (voiceCall.type === "out-going") {
      socket.current.emit("outgoing-voice-call", {
        to: voiceCall.id,
        from: {
          id: userInfo.id,
          profilePicture: userInfo.profileImage,
          name: userInfo.name,
        },
        callType: voiceCall.callType,
        roomId: voiceCall.roomId,
      });
    }
  }, [voiceCall]);
  return <AudioContainer data={voiceCall} />;
}

export default VoiceCall;
