import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import React, { useEffect, useRef, useState } from "react";
import { MdOutlineCallEnd, MdMicOff, MdMic, MdVideocam, MdVideocamOff } from "react-icons/md";
import {
  AgoraVideoPlayer,
  createClient,
  createMicrophoneAndCameraTracks,
} from "agora-rtc-react";

const config = { mode: "rtc", codec: "vp8",};

const appId = "16d8aa0a2e644defa141488f37beeb26";
const token = null;

function Container({ data }){
  const [{ socket, userInfo }, dispatch] = useStateProvider();
  const [callStarted, setCallStarted] = useState(false);
  const [callAccepted, setcallAccepted] = useState(false);
  const [channelName, setChannelName] = useState("test");

  useEffect(() => {
    if (data.type === "out-going")
      socket.current.on("accept-call", () => setcallAccepted(true));
    else {
      setcallAccepted(true);
    }
  }, [data]);

  useEffect(() => {
    if (!callStarted) {
      setCallStarted(true);
    }
  }, [callAccepted]);

  return (
    <div className="border-conversation-border border-l w-full bg-conversation-panel-background-light dark:bg-conversation-panel-background-dark flex flex-col h-[100vh] overflow-hidden items-center justify-center text-white ">
      <span className="text-5xl">{data.name}</span>
      {(
        <VideoCall data={data} setInCall={setCallStarted} channelName={channelName} />
      )}
    </div>
  );
}

export default Container;

const useClient = createClient(config);
const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

const VideoCall = (props) => {
  const { data, setInCall, channelName } = props;
  const [users, setUsers] = useState([]);
  const [start, setStart] = useState(false);
  
  const client = useClient();
  
  const { ready, tracks } = useMicrophoneAndCameraTracks();

  useEffect(() => {
    let init = async (name) => {
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        console.log("subscribe success");
        if (mediaType === "video") {
          setUsers((prevUsers) => {
            return [...prevUsers, user];
          });
        }
        if (mediaType === "audio") {
          user.audioTrack?.play();
        }
      });

      client.on("user-unpublished", (user, type) => {
        console.log("unpublished", user, type);
        if (type === "audio") {
          user.audioTrack?.stop();
        }
        if (type === "video") {
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
          });
        }
      });

      client.on("user-left", (user) => {
        console.log("leaving", user);
        setUsers((prevUsers) => {
          return prevUsers.filter((User) => User.uid !== user.uid);
        });
      });

      await client.join(appId, name, token, null);
      if (tracks) await client.publish([tracks[0], tracks[1]]);
      setStart(true);

    };

    if (ready && tracks) {
      console.log("init ready");
      init(channelName);
    }

  }, [channelName, client, ready, tracks]);


  return (
    <div className="App">
      {ready && tracks && (
        <Controls data={data} tracks={tracks} setStart={setStart} setInCall={setInCall} />
      )}
      {start && tracks && <Videos users={users} tracks={tracks} />}
    </div>
  );
};

const Videos = (props) => {
  const { users, tracks } = props;

  return (
    <div>
      <div id="videos">
        <AgoraVideoPlayer style={{height: '80%', width: '80%'}} className='vid' videoTrack={tracks[1]} />
        {users.length > 0 &&
          users.map((user) => {
            if (user.videoTrack) {
              return (
                <AgoraVideoPlayer style={{height: '80%', width: '80%'}} className='vid' videoTrack={user.videoTrack} key={user.uid} />
              );
            } else return null;
          })}
      </div>
    </div>
  );
};

export const Controls = (props) => {
  const client = useClient();
  const { data, tracks, setStart, setInCall } = props;
  const [trackState, setTrackState] = useState({ video: true, audio: true });
  const [{ socket }, dispatch] = useStateProvider();
  const [socketEvent, setSocketEvent] = useState(false);

  const mute = async (type) => {
    if (type === "audio") {
      await tracks[0].setEnabled(!trackState.audio);
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    } else if (type === "video") {
      await tracks[1].setEnabled(!trackState.video);
      setTrackState((ps) => {
        return { ...ps, video: !ps.video };
      });
    }
  };

  const leaveChannel = async () => {
    await client.leave();
    client.removeAllListeners();
    tracks[0].close();
    tracks[1].close();
    setStart(false);
    setInCall(false);
  };

  const endCall = () => {
    leaveChannel();
    const id = data.id;
    console.log(id);
    socket.current.emit("reject-video-call", {
      from: id,
    });
    dispatch({ type: reducerCases.END_CALL });
  };

  useEffect(() => {
    if (socket.current && !socketEvent) {
      socket.current.on("video-call-rejected", () => {
        leaveChannel();
      }, [socket.current]);
      setSocketEvent(true);
    }
  });

  return (
    <div className="controls">
      <div
        className="rounded-full h-16 w-16 bg-gray-600 flex items-center justify-center"
        onClick={() => mute("audio")}
      >
        {trackState.audio ? <MdMic className="text-3xl cursor-pointer" /> : <MdMicOff className="text-3xl cursor-pointer" />}
      </div>
      <div
        className="rounded-full h-16 w-16 bg-gray-600 flex items-center justify-center"
        onClick={() => mute("video")}
      >
        {trackState.video ? <MdVideocam className="text-3xl cursor-pointer" /> : <MdVideocamOff className="text-3xl cursor-pointer" />}
      </div>
      <div
        className="rounded-full h-16 w-16 bg-red-600 flex items-center justify-center"
        onClick={endCall}
      >
        <MdOutlineCallEnd className="text-3xl cursor-pointer" />
      </div>
    </div>
  );
};
