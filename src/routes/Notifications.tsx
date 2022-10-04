import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Rooms from "../routes/Rooms";

const Notifications = () => {
  return (
    <div>
      <button>通知</button>
      <Link to="/messages">メッセージ</Link>
    </div>
  );
};

export default Notifications;
