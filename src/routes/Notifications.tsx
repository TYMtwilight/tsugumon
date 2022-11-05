import React, { useState } from "react";
import Messages from "./Messages";
import NotificationsRounded from "@mui/icons-material/NotificationsRounded";
import MailOutlined from "@mui/icons-material/MailOutlined";

const Notifications = () => {
  const [tab, setTab] = useState<"notice" | "messages">("notice");
  return (
    <div className="md:flex min-h-screen h-full md:justify-center bg-slate-100">
      <div className="flex fixed flex-col w-screen md:w-1/2 lg:w-1/3 h-24 top-0 justify-center items-center">
        <div className="flex w-full h-12 justify-center items-center bg-white">
          <p className="w-16 font-bold z-20" id="title">
            通知
          </p>
        </div>
        <div className="flex relative flex-row w-full h-12 bg-slate-300 z-0">
          <button
            onClick={(
              event: React.MouseEvent<HTMLButtonElement, MouseEvent>
            ) => {
              event.preventDefault();
              setTab("notice");
            }}
            className="text-white w-1/2 bg-transparent z-20"
          >
            <NotificationsRounded />
            <label className="ml-2">お知らせ</label>
          </button>
          <button
            onClick={(
              event: React.MouseEvent<HTMLButtonElement, MouseEvent>
            ) => {
              event.preventDefault();
              setTab("messages");
            }}
            className="text-white w-1/2 bg-transparent z-20"
          >
            <MailOutlined />
            <label className="ml-2">メッセージ</label>
          </button>
          <div
            className={`absolute w-1/2 h-12 bg-emerald-500 z-10 duration-[300ms] ${
              tab === "notice" ? "left-0" : "left-1/2"
            }`}
          />
        </div>
      </div>
      {tab === "notice" && (
        <div className="flex fixed flex-col w-screen md:w-1/2 lg:w-1/3 min-h-screen top-24 justify-center bg-white" />
      )}
      {tab === "messages" && <Messages />}
    </div>
  );
};

export default Notifications;
