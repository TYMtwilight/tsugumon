import { useState, memo, useCallback } from "react";
import { Link, Outlet } from "react-router-dom";
import React from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectUser, logout, toggleIsNewUser } from "../features/userSlice";
import Post from "../components/Post/Post";
import SelectUserType from "../components/SelectUserType/SelectUserType";
import BusinessUser from "../components/BusinessUser/BusinessUser";
import { useFeeds } from "../hooks/useFeeds";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import AddCircle from "@mui/icons-material/AddCircle";

interface PostData {
  id: string;
  uid: string;
  username: string;
  displayName: string;
  avatarURL: string;
  imageURL: string;
  caption: string;
  updatedAt: string;
  updatedTime: number;
}

const Feed = memo(() => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [profileOn, setProfileOn] = useState<boolean>(false);
  const closeProfile: () => void = useCallback(() => {
    setProfileOn(false);
  }, []);
  const feeds: PostData[] = useFeeds();
  if (process.env.NODE_ENV === "development") {
    console.log("Feed.tsxがレンダリングされました");
  }
  if (user.userType) {
    return (
      <div>
        {feeds.map((feed) => {
          return (
            <Post
              key={feed.id}
              uid={feed.uid}
              username={feed.username}
              displayName={feed.displayName}
              avatarURL={feed.avatarURL}
              imageURL={feed.imageURL}
              caption={feed.caption}
              updatedAt={feed.updatedAt}
            />
          );
        })}
        {profileOn ? (
          <BusinessUser closeProfile={closeProfile} />
        ) : (
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              setProfileOn(true);
            }}
          >
            プロフィール表示
          </button>
        )}
        <Link to="/upload">
          <AddCircle />
        </Link>
        <button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            signOut(auth).catch((error: any) => {
              console.log(`エラーが発生しました\n${error.message}`);
            });
            dispatch(logout());
            dispatch(toggleIsNewUser(false));
          }}
        >
          logout
        </button>
        <Outlet />
      </div>
    );
  } else {
    return <SelectUserType />;
  }
});

export default Feed;
