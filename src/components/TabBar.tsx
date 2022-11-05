import React from "react";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectUser, LoginUser } from "../features/userSlice";
import {
  HomeRounded,
  SearchRounded,
  AddCircle,
  NotificationsRounded,
} from "@mui/icons-material";
const TabBar = (props: { invisibleAtSmall: boolean }) => {
  const loginUser: LoginUser = useAppSelector(selectUser);
  if (loginUser.uid) {
    return (
      <nav
        className={`flex fixed sm:flex-row md:flex-col justify-around w-screen md:w-24 sm:h-16 md:h-screen bottom-0 pt-2 bg-white border-t z-30
        ${props.invisibleAtSmall && "invisible md:visible"}
        `}
      >
        <button>
          <NavLink
            style={({ isActive }) => {
              return {
                color: isActive ? "rgb(16 185 129)" : "rgb(148 163 184)",
              };
            }}
            to="/home"
          >
            <HomeRounded />
            <p className="text-xs">ホーム</p>
          </NavLink>
        </button>
        <button>
          <NavLink
            style={({ isActive }) => {
              return {
                color: isActive ? "rgb(16 185 129)" : "rgb(148 163 184)",
              };
            }}
            to="/search"
          >
            <SearchRounded />
            <p className="text-xs">見つける</p>
          </NavLink>
        </button>
        {loginUser.userType === "business" && (
          <button>
            <NavLink
              style={({ isActive }) => {
                return {
                  color: isActive ? "rgb(16 185 129)" : "rgb(148 163 184)",
                };
              }}
              to="/upload"
            >
              <AddCircle />
              <p className="text-xs">投稿</p>
            </NavLink>
          </button>
        )}
        <button>
          <NavLink
            style={({ isActive }) => {
              return {
                color: isActive ? "rgb(16 185 129)" : "rgb(148 163 184)",
              };
            }}
            to="/notifications"
          >
            <NotificationsRounded />
            <p className="text-xs">通知</p>
          </NavLink>
        </button>
        <button>
          <NavLink
            style={({ isActive }) => {
              return {
                color: isActive ? "rgb(16 185 129)" : "rgb(148 163 184)",
              };
            }}
            to={`/${loginUser.username}`}
          >
            <img
              className="block w-8 h-8 mx-auto rounded-full object-cover"
              src={
                loginUser.avatarURL !== ""
                  ? loginUser.avatarURL
                  : `${process.env.PUBLIC_URL}/noAvatar.png`
              }
              alt={`${loginUser.username}のアバター`}
            />
            <p className="text-xs">自分</p>
          </NavLink>
        </button>
      </nav>
    );
  } else {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    );
  }
};

export default TabBar;
