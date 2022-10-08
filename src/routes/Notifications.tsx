import React, { useState } from "react";
import Rooms from "./Messages";
import NotificationsRounded from "@mui/icons-material/NotificationsRounded";
import MailOutlined from "@mui/icons-material/MailOutlined";

const Notifications = () => {
  const [tab, setTab] = useState<"notice" | "messages">("notice");
  return (
    <div className="w-screen min-h-screen bg-slate-100">
      <div className="flex relative  h-12 justify-center items-center">
        <p className="w-16 mx-auto font-bold" id="title">
          通知
        </p>
      </div>
      <div className="flex w-screen h-12 bg-red-400">
        <button
          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            event.preventDefault();
            setTab("notice");
          }}
          className={`text-slate-100 w-1/2 ${
            tab === "notice" ? "bg-emerald-500" : "bg-slate-400"
          }`}
        >
          <NotificationsRounded />
          <label className="ml-2">お知らせ</label>
        </button>
        <button
          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            event.preventDefault();
            setTab("messages");
          }}
          className={`text-slate-100  w-1/2 ${
            tab === "messages" ? "bg-emerald-500" : "bg-slate-400"
          }`}
        >
          <MailOutlined />
          <label className="ml-2">メッセージ</label>
        </button>
      </div>
      {tab === "messages" && <Rooms />}
    </div>
  );
};

export default Notifications;
