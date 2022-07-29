import React, { memo } from "react";
import { Link, Outlet, useNavigate, NavigateFunction } from "react-router-dom";

interface UserData {
  avatarURL: string;
  displayName: string;
  uid: string;
  username: string;
  userType: "business" | "normal" | null;
}

const LikeUsers: React.VFC = memo(() => {
  return <div></div>;
});

export default LikeUsers;