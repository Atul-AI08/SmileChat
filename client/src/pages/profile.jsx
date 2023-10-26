import React, { useEffect, useState } from "react";
import Avatar from "../components/common/Avatar";
import Input from "../components/common/Input";
import axios from "axios";
import { updateProfile } from "../utils/ApiRoutes";

import Resizer from "react-image-file-resizer";

import Image from "next/image";
import { useStateProvider } from "@/context/StateContext";
import { useRouter } from "next/router";
import { reducerCases } from "@/context/constants";

export default function Profile() {
  const router = useRouter();

  const [{ userInfo }, dispatch] = useStateProvider();

  const [image, setImage] = useState(userInfo?.profileImage);
  const [name, setName] = useState(userInfo?.name);
  const [about, setAbout] = useState(userInfo?.status);

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300,
        300,
        "PNG",
        80,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

  const updateUserProfile = async () => {
    if (validateDetails()) {
      const email = userInfo?.email;
      const userId = userInfo?.id;
      const lastSeen = userInfo?.lastSeen;
      try {
        const base64Response = await fetch(`${image}`);
        const blob = await base64Response.blob();
        setImage(await resizeFile(blob));
        const { data } = await axios.post(updateProfile, {
          userId,
          name,
          about,
          image,
        });
        if (data.status) {
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              id: userId,
              email: email,
              name: name,
              profileImage: image,
              status: about,
              lastSeen: lastSeen,
            },
          });

          router.push("/");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const validateDetails = () => {
    if (name.length < 3) {
      // Toast Notification
      return false;
    }
    return true;
  };

  const back = () => {
    router.push("/");
  };

  return (
    <div className="bg-panel-header-background h-screen w-screen text-white flex flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-2">
        <Image
          src="/whatsapp.gif"
          alt="whatsapp-gif"
          height={300}
          width={300}
        />
        <span className="text-7xl">WhatsApp</span>
      </div>
      <div></div>
      <h2 className="text-2xl ">Your profile</h2>
      <div className="flex gap-6 mt-6 ">
        <div className="flex flex-col items-center justify-between mt-5 gap-6">
          <Input name="Display Name" state={name} setState={setName} label />
          <Input name="About" state={about} setState={setAbout} label />
          <div className="flex items-center justify-center gap-2">
            <button
              className="bg-search-input-container-background p-5 rounded-lg"
              onClick={back}
              >
              Back
            </button>
            <button
              className="bg-search-input-container-background p-5 rounded-lg"
              onClick={updateUserProfile}
            >
              Update Profile
            </button>
          </div>
        </div>
        <div>
          <Avatar type="xl" image={image} setImage={setImage} />
        </div>
      </div>
    </div>
  );
}
