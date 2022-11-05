import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { useAppSelector } from "../app/hooks";
import { selectUser, LoginUser } from "../features/userSlice";
import {
  Params,
  useParams,
  useNavigate,
  NavigateFunction,
  Link,
} from "react-router-dom";
import { db } from "../firebase";
import {
  doc,
  setDoc,
  serverTimestamp,
  DocumentReference,
  DocumentData,
  getDoc,
  DocumentSnapshot,
} from "firebase/firestore";
import { useMessages } from "../hooks/useMessages";
import { Message } from "../interfaces/Message";
import ArrowBackRounded from "@mui/icons-material/ArrowBackIosNewOutlined";
import SendRounded from "@mui/icons-material/SendRounded";
import { getRandomString } from "../functions/GetRandomString";
import { Partner } from "../interfaces/Partner";

const DirectMessage = () => {
  const params: Readonly<Params<string>> = useParams();
  const navigate: NavigateFunction = useNavigate();
  const loginUser: LoginUser = useAppSelector(selectUser);
  const roomId: string = params.messageId!;
  const uids: string[] = params.messageId!.split("-");
  const partnerUID: string = uids.find((uid: string) => {
    return uid !== loginUser.uid;
  })!;
  const messages: Message[] = useMessages(roomId);
  const [newMessage, setNewMessage] = useState<string>("");
  const [partner, setPartner] = useState<Partner>({
    uid: "",
    username: "",
    displayName: "",
    avatarURL: "",
  });
  const divElement = useRef<HTMLDivElement>(null);

  const partnerRef: DocumentReference<DocumentData> = doc(
    db,
    `users/${partnerUID}`
  );
  const getPartner: () => void = () => {
    getDoc(partnerRef).then((partnerSnap: DocumentSnapshot<DocumentData>) => {
      setPartner({
        uid: partnerUID,
        username: partnerSnap.data()!.username,
        displayName: partnerSnap.data()!.displayName,
        avatarURL: partnerSnap.data()!.avatarURL
          ? partnerSnap.data()!.avatarURL
          : `${process.env.PUBLIC_URL}/noAvatar.png`,
      });
    });
  };

  useEffect(() => {
    getPartner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const roomsRef: DocumentReference<DocumentData> = doc(db, `rooms/${roomId}`);
  const sendMessage = () => {
    setDoc(roomsRef, {
      uids: [loginUser.uid, partner.uid],
      avatars: [loginUser.avatarURL, partner.avatarURL],
      usernames: [loginUser.username, partner.username],
      displayNames: [loginUser.displayName, partner.displayName],
      timestamp: serverTimestamp(),
    });
    const messageRef: DocumentReference<DocumentData> = doc(
      db,
      `rooms/${roomId}/messages/${getRandomString()}`
    );
    setDoc(messageRef, {
      senderUID: loginUser.uid,
      receiverUID: partner.uid,
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
    <div className="md:flex min-h-screen h-full md:justify-center bg-slate-100 ">
      <div className="flex fixed flex-col w-screen md:w-1/2 lg:w-1/3 h-12 top-0 justify-center items-center z-10 bg-white">
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
      <div className="flex flex-col w-screen md:w-1/2 lg:w-1/3 h-full min-h-screen pt-16 pb-32 bg-white">
        {messages.map((message: Message) => {
          const currentTime: number = new Date().getTime();
          if (message.timestamp) {
            const messageTime: number = message.timestamp.getTime();
            const moreThanOneDayAgo: boolean =
              currentTime - messageTime > 86400000;
            const moreThanOneHourAgo: boolean =
              currentTime - messageTime > 3600000;
            const moreThanOneMinutesAgo: boolean =
              currentTime - messageTime > 60000;
            const minutesAgo: number = Math.trunc(
              (currentTime - messageTime) / 60000
            );
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
                      {`${message.timestamp.getFullYear()}年${
                        message.timestamp.getMonth() + 1
                      }月${message.timestamp.getDate()}日`}
                    </p>
                  </div>
                )}
                {message.senderUID === loginUser.uid ? (
                  <div className="flex flex-row-reverse mx-4 my-2">
                    <div className="flex flex-col">
                      <p className="max-w-xs h-full p-4 bg-emerald-500 text-white rounded-t-3xl rounded-l-3xl">
                        {message.message}
                      </p>
                      <div className="flex flex-row-reverse">
                        <p>
                          {moreThanOneHourAgo
                            ? `${messageHour.substring(
                                messageHour.length - 2
                              )}:${messageMinutes.substring(
                                messageMinutes.length - 2
                              )}`
                            : moreThanOneMinutesAgo
                            ? `${minutesAgo}分前`
                            : `${secondsAgo}秒前`}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex relative flex-row m-4">
                    <Link to={`/${partner.username}`}>
                      <img
                        className="block absolute w-12 h-12 bottom-0 rounded-full"
                        src={partner.avatarURL}
                        alt="ユーザーのアバター画像"
                      />
                    </Link>
                    <div className="flex flex-col">
                      <p
                        className="max-w-xs h-full 
                         p-4  ml-16 bg-emerald-500 text-white rounded-t-3xl rounded-r-3xl"
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
                )}
              </div>
            );
          } else {
            return null;
          }
        })}
        <div ref={divElement} />
      </div>
      <div className="fixed flex w-screen md:w-1/2 lg:w-1/3 items-end bottom-0 bg-white">
        <textarea
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            event.preventDefault();
            setNewMessage(event.target.value);
          }}
          value={newMessage}
          className="w-10/12 h-24 m-4 p-2 resize-none rounded-lg bg-slate-100 outline-none"
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
