import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
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
  setDoc,
  serverTimestamp,
  DocumentReference,
  DocumentData,
} from "firebase/firestore";
import { useMessages } from "../hooks/useMessages";
import { Message } from "../interfaces/Message";
import ArrowBackRounded from "@mui/icons-material/ArrowBackIosNewOutlined";
import SendRounded from "@mui/icons-material/SendRounded";
import { getRandomString } from "../functions/GetRandomString";

const DirectMessage = () => {
  const params: Readonly<Params<string>> = useParams();
  const navigate: NavigateFunction = useNavigate();
  const loginUser: LoginUser = useAppSelector(selectUser);
  const partnerUID: string = params.messageId!.split("-")[1];
  const roomId: string = `${loginUser.uid}-${partnerUID}`;
  const messages: Message[] = useMessages(roomId);
  const [newMessage, setNewMessage] = useState<string>("");
  const divElement = useRef<HTMLDivElement>(null);
  const sendMessage = () => {
    const roomsRef: DocumentReference<DocumentData> = doc(
      db,
      `rooms/${roomId}`
    );
    setDoc(roomsRef, {
      senderUID: loginUser.uid,
      senderAvatarURL: loginUser.avatarURL,
      receiverUID: partnerUID,
      timestamp: serverTimestamp(),
    });
    const messageRef: DocumentReference<DocumentData> = doc(
      db,
      `rooms/${roomId}/messages/${getRandomString()}`
    );
    setDoc(messageRef, {
      senderUID: loginUser.uid,
      senderAvatarURL: loginUser.avatarURL,
      receiverUID: partnerUID,
      message: newMessage,
      timestamp: serverTimestamp(),
      unread: true,
    });
    setNewMessage("");
  };
  const scrollToBottom: () => void = () => {
    divElement.current!.scrollIntoView();
  };

  useLayoutEffect(() => {
    scrollToBottom();
  }, []);

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
      <div className="mt-16 mb-32">
        {messages.map((message: Message) => {
          const currentTime: number = new Date().getTime();
          if (message.timestamp) {
            const messageTime: number = message.timestamp.getTime();
            const moreThanOneDayAgo: boolean =
              currentTime - messageTime > 86400000;
            const moreThanOneMinutesAgo: boolean =
              currentTime - messageTime > 60000;
            const secondsAgo: number = Math.trunc(
              (currentTime - messageTime) / 1000
            );
            const messageHour: string = `0${message.timestamp.getHours()}`;
            const messageMinutes: string = `0${message.timestamp.getMinutes()}`;
            return (
              <div key={message.messageId}>
                {message.timestamp && moreThanOneDayAgo && (
                  <div className="flex justify-center">
                    <p>
                      {`${message.timestamp.getFullYear()}年${message.timestamp.getMonth()}月${message.timestamp.getDate()}日`}
                    </p>
                  </div>
                )}
                {message.senderUID === loginUser.uid ? (
                  <div className="flex flex-row-reverse m-4">
                    <div className="flex flex-col">
                      <p
                        className="max-w-xs h-full 
                         p-4 bg-emerald-500 text-slate-100 rounded-t-3xl rounded-l-3xl"
                      >
                        {message.message}
                      </p>
                      <div className="flex flex-row-reverse">
                        <p>
                          {moreThanOneMinutesAgo
                            ? `${messageHour.substring(messageHour.length - 2)}:
                    ${messageMinutes.substring(messageMinutes.length - 2)}`
                            : `${secondsAgo}秒前`}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <img
                      src={message.senderAvatarURL}
                      alt="送信者のアバター画像"
                    />
                    <p>{message.message}</p>
                    <p>{message.timestamp}</p>
                  </div>
                )}
              </div>
            );
          } else {
            return null;
          }
        })}
        <div ref={divElement} />
      </div>
      <div className="fixed flex w-screen items-end bottom-0 bg-slate-100">
        <textarea
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            event.preventDefault();
            setNewMessage(event.target.value);
          }}
          value={newMessage}
          className="w-10/12 h-24 m-4 p-2 resize-none rounded-lg outline-none"
          placeholder="メッセージを入力してください。"
        />
        <button
          className="block w-8 h-8 my-4  font-bold text-emerald-500 disabled:text-slate-400"
          disabled={newMessage === ""}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            sendMessage();
          }}
        >
          <SendRounded />
        </button>
      </div>
    </div>
  );
};

export default DirectMessage;
