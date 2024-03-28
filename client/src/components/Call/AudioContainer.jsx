import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { MdOutlineCallEnd, MdMicOff, MdMic } from "react-icons/md";
import {
    createClient,
    createMicrophoneAudioTrack,
} from "agora-rtc-react";

const config = { mode: "rtc", codec: "vp8", };

const appId = "16d8aa0a2e644defa141488f37beeb26";
const token = null;

function AudioContainer({ data }) {
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
            <div className="flex flex-col gap-3 items-center">
                <span className="text-5xl">{data.name}</span>
                <span className="text-lg">
                    {callAccepted
                        ? "On going call"
                        : "Calling"}
                </span>
            </div>
            {(
                <AudioCall data={data} setInCall={setCallStarted} channelName={channelName} />
            )}
        </div>
    );
}

export default AudioContainer;

const useClient = createClient(config);
const useMicrophoneTrack = createMicrophoneAudioTrack();

const AudioCall = (props) => {
    const { data, setInCall, channelName } = props;
    const [users, setUsers] = useState([]);
    const [start, setStart] = useState(false);

    const client = useClient();

    const { ready, track } = useMicrophoneTrack();

    useEffect(() => {
        let init = async (name) => {
            client.on("user-published", async (user, mediaType) => {
                await client.subscribe(user, mediaType);
                console.log("subscribe success");
                if (mediaType === "audio") {
                    user.audioTrack?.play();
                }
            });

            client.on("user-unpublished", (user, type) => {
                console.log("unpublished", user, type);
                if (type === "audio") {
                    user.audioTrack?.stop();
                }
            });

            client.on("user-left", (user) => {
                console.log("leaving", user);
                setUsers((prevUsers) => {
                    return prevUsers.filter((User) => User.uid !== user.uid);
                });
            });

            await client.join(appId, name, token, null);
            if (track) await client.publish([track]);
            setStart(true);

        };

        if (ready && track) {
            console.log("init ready");
            init(channelName);
        }

    }, [channelName, client, ready, track]);


    return (
        <div className="App">
            {console.log(track)}
            {ready && track && (
                <Controls data={data} track={track} setStart={setStart} setInCall={setInCall} />
            )}
            {start && track && <Videos data={data} />}
        </div>
    );
};

const Videos = (props) => {
    const { data } = props;

    return (
        <div>
            <Image
                src={data.profilePicture}
                alt="avatar"
                height={300}
                width={300}
                className="rounded-full"
            />
        </div>
    );
};

export const Controls = (props) => {
    const client = useClient();
    const { data, track, setStart, setInCall } = props;
    const [trackState, setTrackState] = useState({ audio: true });
    const [{ socket }, dispatch] = useStateProvider();
    const [socketEvent, setSocketEvent] = useState(false);

    const mute = async (type) => {
        if (type === "audio") {
            await track.setEnabled(!trackState.audio);
            setTrackState((ps) => {
                return { ...ps, audio: !ps.audio };
            });
        }
    };

    const leaveChannel = async () => {
        await client.leave();
        client.removeAllListeners();
        track.close();
        setStart(false);
        setInCall(false);
    };

    const endCall = () => {
        leaveChannel();
        const id = data.id;
        socket.current.emit("reject-voice-call", {
            from: id,
        });
        dispatch({ type: reducerCases.END_CALL });
    };

    useEffect(() => {
        if (socket.current && !socketEvent) {
            socket.current.on("voice-call-rejected", () => {
                leaveChannel();
            }, [socket.current]);
            setSocketEvent(true);
        }
    });

    return (
        <div className="audiocontrols">
            <div
                className="rounded-full h-16 w-16 bg-gray-600 flex items-center justify-center"
                onClick={() => mute("audio")}
            >
                {trackState.audio ? <MdMic className="text-3xl cursor-pointer" /> : <MdMicOff className="text-3xl cursor-pointer" />}
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
