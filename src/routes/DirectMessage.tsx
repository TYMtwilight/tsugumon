import React, { useState, useRef } from "react";
import { useAppSelector } from "../app/hooks";
import { selectUser, LoginUser } from "../features/userSlice";
import {
  Params,
  useParams,
  useNavigate,
  NavigateFunction,
} from "react-router-dom";
import { db } from "../firebase";
import {
  doc,
  DocumentData,
  DocumentReference,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import ArrowBackRounded from "@mui/icons-material/ArrowBackIosNewOutlined";
import { getRandomString } from "../functions/GetRandomString";

const DirectMessage = () => {
  const params: Readonly<Params<string>> = useParams();
  const navigate: NavigateFunction = useNavigate();
  const loginUser: LoginUser = useAppSelector(selectUser);
  const receiverUID: string = params.messageId!.split("-")[1];
  console.log(receiverUID);
  const senderUID: string = loginUser.uid;
  const newMessage: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
  const roomId: string = `${senderUID}-${receiverUID}`;
  const [unread, setUnread] = useState<boolean>(true);

  const sendMessage = () => {
    const messageRef = doc(db, `rooms/${roomId}/messages/${getRandomString()}`);
    setDoc(messageRef, {
      senderUID: senderUID,
      receiverUID: receiverUID,
      timestamp: serverTimestamp(),
    });
  };

  return (
    <div className="flex flex-col w-full min-h-screen h-full bg-slate-100 ">
      <div className="flex fixed justtify-center items-center top-0 w-screen h-12 z-10 bg-slate-100">
        <button
          className="absolute left-2"
          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            event.preventDefault();
            navigate(-1);
          }}
        >
          <ArrowBackRounded />
        </button>
        <p className="w-20 mx-auto font-bold">メッセージ</p>
      </div>
      <input type="text" className="mt-12" ref={newMessage} />
      <button
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          sendMessage();
        }}
      >送信</button>
    </div>
  );
};

export default DirectMessage;
