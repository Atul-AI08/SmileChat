import React, { useState } from "react";
import Avatar from "../components/common/Avatar";
import Input from "../components/common/Input";
import axios from "axios";
import { CREATE_GROUP } from "../utils/ApiRoutes";

import Resizer from "react-image-file-resizer";

import Image from "next/image";
import { useStateProvider } from "@/context/StateContext";
import { useRouter } from "next/router";

export default function OnBoarding() {
  const router = useRouter();

  const [{ userInfo }] = useStateProvider();

  const [image, setImage] = useState("/default_avatar.png");
  const [name, setName] = useState("");
  const [about, setAbout] = useState(".");

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

  const create_group = async () => {
    if (validateDetails()) {
      const email = "abc@gmail.com";
      const uid = userInfo?.id;
      try {
        const base64Response = await fetch(`${image}`);
        const blob = await base64Response.blob();
        setImage(await resizeFile(blob));
        const { data } = await axios.post(CREATE_GROUP, {
          uid,
          email,
          name,
          about,
          image,
        });
        if (data.status) {
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
    <div className="bg-panel-header-background-light dark:bg-panel-header-background-dark h-screen w-screen text-white flex flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-2">
        <Image
          src="/whatsapp.gif"
          alt="whatsapp-gif"
          height={240}
          width={240}
        />
        <span className="text-5xl">WebChat Pro</span>
      </div>
      <div></div>
      <h2 className="text-2xl ">Create Group</h2>
      <div className="flex gap-6 mt-6 ">
        <div className="flex flex-col items-center justify-between mt-5 gap-6">
          <Input name="Group Name" state={name} setState={setName} label />
          {/* <Input name="About" state={about} setState={setAbout} label /> */}
          <div className="flex items-center justify-center gap-2">
            <button
              className="bg-search-input-container-background p-5 rounded-lg"
              onClick={back}
              >
              Back
            </button>
            <button
              className="bg-search-input-container-background p-5 rounded-lg"
              onClick={create_group}
            >
              Create Group
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
