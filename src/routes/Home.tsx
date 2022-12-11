import React from "react";
import { memo } from "react";
import { Outlet, useNavigate, NavigateFunction } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectUser, logout, toggleIsNewUser } from "../features/userSlice";
import PostComponent from "../components/PostComponent";
import SelectUserType from "../components/SelectUserType";
import { useFeeds } from "../hooks/useFeeds";

interface Post {
  avatarURL: string;
  caption: string;
  displayName: string;
  id: string;
  imageURL: string;
  tags: string[];
  timestamp: Date;
  uid: string;
  username: string;
}

const Feed: React.MemoExoticComponent<() => JSX.Element> = memo(() => {
  const dispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const loginUser = useAppSelector(selectUser);
  const feeds: Post[] = useFeeds(loginUser.uid);

  if (loginUser.userType) {
    return (
      <div className="md:flex md:justify-center w-screen">
        <div className="flex fixed w-screen md:w-1/2 lg:w-1/3 h-12 top-0 justify-center items-center bg-white z-30">
          <button
            className="absolute left-2 align-middle text-xs"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              dispatch(logout());
              dispatch(toggleIsNewUser(false));
              navigate("/login");
            }}
          >
            ログアウト
          </button>
          <p className="w-screen text-center font-bold">ホーム</p>
        </div>
        <div className="flex flex-col w-screen md:w-1/2 lg:w-1/3 min-h-screen h-max pt-12 bg-white">
          {feeds.map((feed: Post) => {
            return (
              <PostComponent
                detail={false}
                avatarURL={feed.avatarURL}
                caption={feed.caption}
                displayName={feed.displayName}
                id={feed.id}
                imageURL={feed.imageURL}
                key={feed.id}
                timestamp={feed.timestamp}
                uid={feed.uid}
                username={feed.username}
                tags={feed.tags}
              />
            );
          })}
        </div>
        <Outlet />
      </div>
    );
  } else {
    return <SelectUserType />;
  }
});

export default Feed;
