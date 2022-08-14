import { memo } from "react";
import { Link, Outlet, useNavigate, NavigateFunction } from "react-router-dom";
import React from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectUser, logout, toggleIsNewUser } from "../features/userSlice";
import Post from "./Post";
import SelectUserType from "../components/SelectUserType/SelectUserType";
import { useFeeds } from "../hooks/useFeeds";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import AddCircle from "@mui/icons-material/AddCircle";

interface PostDoc {
  avatarURL: string;
  caption: string;
  displayName: string;
  id: string;
  imageURL: string;
  timestamp: Date;
  uid: string;
  username: string;
}

const Feed = memo(() => {
  const dispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const user = useAppSelector(selectUser);
  const feeds: PostDoc[] = useFeeds();
  if (user.userType) {
    return (
      <div>
        {feeds.map((feed: PostDoc) => {
          return (
            <Post
              // avatarURL={feed.avatarURL}
              // caption={feed.caption}
              // displayName={feed.displayName}
              // imageURL={feed.imageURL}
              // key={feed.id}
              // timestamp={feed.timestamp}
              // uid={feed.uid}
              // username={feed.username}
            />
          );
        })}
        <Link to={`/${user.username}`}>
          <p>プロフィールを表示する</p>
        </Link>
        <Link to="/upload">
          <AddCircle />
        </Link>
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
        <Outlet />
      </div>
    );
  } else {
    return <SelectUserType />;
  }
});

export default Feed;
