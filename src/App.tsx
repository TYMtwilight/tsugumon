import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { Navigate, NavLink, Outlet, Route, Routes } from "react-router-dom";
import { selectUser, login, logout } from "./features/userSlice";
import { auth, db } from "./firebase";
import { onAuthStateChanged, Unsubscribe, User } from "firebase/auth";
import {
  doc,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
} from "firebase/firestore";

import HomeRounded from "@mui/icons-material/HomeRounded";
import SearchRounded from "@mui/icons-material/SearchRounded";
import AddCircle from "@mui/icons-material/AddCircle";
import NotificationsRounded from "@mui/icons-material/NotificationsRounded";

const App: React.FC = () => {
  const loginUser = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [scroll, setScroll] = useState<number>(0);

  useEffect(() => {
    const unsubscribe: Unsubscribe = onAuthStateChanged(
      auth,
      async (authUser: User | null) => {
        if (authUser) {
          const userRef: DocumentReference<DocumentData> = doc(
            db,
            "users",
            authUser.uid
          );
          const userSnap: DocumentSnapshot<DocumentData> = await getDoc(
            userRef
          );
          if (userSnap.exists()) {
            dispatch(
              login({
                avatarURL: authUser.photoURL ? authUser.photoURL : "",
                backgroundURL: userSnap.data().backgroundURL,
                displayName: authUser.displayName ? authUser.displayName : "",
                introduction: userSnap.data().introduction,
                uid: authUser.uid,
                username: userSnap.data().username,
                userType: userSnap.data().userType,
              })
            );
          } else {
            if (process.env.NODE_ENV === "development") {
              console.log("対象のドキュメントは見つかりませんでした。");
            }
            dispatch(logout());
          }
        } else {
          dispatch(logout());
        }
      }
    );
    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  if (loginUser.uid) {
    return (
      <div
        className="w-full min-h-screen h-full bg-slate-100"
        onScroll={(event: React.UIEvent<HTMLDivElement>) => {
          event.preventDefault();
          setScroll(window.scrollY);
        }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
        </Routes>
        <div className="md:flex lg:flex fixed w-screen justify-center bottom-0 z-50">
          <nav className="flex justify-around sm:w-screen md:w-1/2 lg:w-1/3 h-16 bg-white border-t ">
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
                  className="block w-8 h-8 mx-auto rounded-full"
                  src={loginUser.avatarURL}
                  alt={`${loginUser.username}のアバター`}
                />
                <p className="text-xs">自分</p>
              </NavLink>
            </button>
          </nav>
        </div>
        <Outlet />
      </div>
    );
  } else {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    );
  }
};
export default App;
