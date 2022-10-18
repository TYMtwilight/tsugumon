import React from "react";
import { memo } from "react";
import { Outlet, useNavigate, NavigateFunction } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectUser, logout, toggleIsNewUser } from "../features/userSlice";
import PostComponent from "../components/PostComponent";
import SelectUserType from "../components/SelectUserType";
import { useFeeds } from "../hooks/useFeeds";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

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
  const feeds: Post[] = useFeeds();
  if (loginUser.userType) {
    return (
      <div>
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
        <div className="mb-16">
          <button
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              navigate("/");
              signOut(auth).catch((error: any) => {
                console.log(`エラーが発生しました\n${error.message}`);
              });
              dispatch(logout());
              dispatch(toggleIsNewUser(false));
            }}
          >
            logout
          </button>
        </div>
        <Outlet />
      </div>
    );
  } else {
    return <SelectUserType />;
  }
});

export default Feed;
