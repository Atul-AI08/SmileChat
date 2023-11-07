// same file as the videocall example
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  AgoraVideoPlayer,
  createClient,
  createMicrophoneAndCameraTracks,
} from "agora-rtc-react";
import { MdOutlineCallEnd, MdMicOff, MdMic, MdVideocam, MdVideocamOff } from "react-icons/md";
import Input from "../components/common/Input";
import Image from "next/image";

const config = { 
  mode: "rtc", codec: "vp8",
};

const appId = "16d8aa0a2e644defa141488f37beeb26"; //ENTER APP ID HERE
const token = null;

const App = () => {
  const [inCall, setInCall] = useState(false);
  const [channelName, setChannelName] = useState("");
  return (
    <div className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col h-[100vh] overflow-hidden items-center justify-center text-white">
      {inCall ? (
        <VideoCall setInCall={setInCall} channelName={channelName} />
      ) : (
        <ChannelForm setInCall={setInCall} channelName={channelName} setChannelName={setChannelName} />
      )}
    </div>
  );
};

// the create methods in the wrapper return a hook
// the create method should be called outside the parent component
// this hook can be used the get the client/stream in any component
const useClient = createClient(config);
const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

const VideoCall = (props) => {
  const { setInCall, channelName } = props;
  const [users, setUsers] = useState([]);
  const [start, setStart] = useState(false);
  // using the hook to get access to the client object
  const client = useClient();
  // ready is a state variable, which returns true when the local tracks are initialized, untill then tracks variable is null
  const { ready, tracks } = useMicrophoneAndCameraTracks();

  useEffect(() => {
    // function to initialise the SDK
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
        <Controls tracks={tracks} setStart={setStart} setInCall={setInCall} />
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
        {/* AgoraVideoPlayer component takes in the video track to render the stream,
            you can pass in other props that get passed to the rendered div */}
        <AgoraVideoPlayer style={{height: '95%', width: '95%'}} className='vid' videoTrack={tracks[1]} />
        {users.length > 0 &&
          users.map((user) => {
            if (user.videoTrack) {
              return (
                <AgoraVideoPlayer style={{height: '95%', width: '95%'}} className='vid' videoTrack={user.videoTrack} key={user.uid} />
              );
            } else return null;
          })}
      </div>
    </div>
  );
};

export const Controls = (props) => {
  const client = useClient();
  const { tracks, setStart, setInCall } = props;
  const [trackState, setTrackState] = useState({ video: true, audio: true });

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
    // we close the tracks to perform cleanup
    tracks[0].close();
    tracks[1].close();
    setStart(false);
    setInCall(false);
  };

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
        onClick={() => leaveChannel()}
      >
        <MdOutlineCallEnd className="text-3xl cursor-pointer" />
      </div>
    </div>
  );
};

const ChannelForm = (props) => {
  const { setInCall, channelName, setChannelName } = props;
  const router = useRouter();

  const back = () => {
    router.push("/");
  };

  return (
    <div className="bg-panel-header-background-light dark:bg-panel-header-background-dark h-screen w-screen text-white flex flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-2">
        <Image
          src="/whatsapp.gif"
          alt="whatsapp-gif"
          height={240}
          width={240}
        />
        <span className="text-6xl">WhatsApp</span>
      </div>
      <div></div>
      <div className="flex gap-6 mt-6 ">
        <div className="flex flex-col items-center justify-between mt-5 gap-6">
          <Input name="Enter Channel Name"
            state={channelName}
            setState={setChannelName} label
          />
          <div className="flex items-center justify-center gap-2">
            <button className="bg-search-input-container-background p-5 rounded-lg" onClick={(e) => {
              e.preventDefault();
              setInCall(true);
            }}>
              Join
            </button>
            <button
              className="bg-search-input-container-background p-5 rounded-lg"
              onClick={back}
              >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;