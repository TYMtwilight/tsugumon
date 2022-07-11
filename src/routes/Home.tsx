import { memo } from "react";
import { Link, Outlet,useNavigate,NavigateFunction } from "react-router-dom";
import React from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectUser, logout, toggleIsNewUser } from "../features/userSlice";
import Post from "./Post";
import SelectUserType from "../components/SelectUserType/SelectUserType";
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
  const navigate:NavigateFunction = useNavigate();
  const user = useAppSelector(selectUser);
  const feeds: PostData[] = useFeeds();
  if (user.userType) {
    return (
      <div>
        {feeds.map((feed: PostData) => {
          return (
            <Post
            // // avatarURL={feed.avatarURL}
            // caption={feed.caption}
            // displayName={feed.displayName}
            // imageURL={feed.imageURL}
            // key={feed.id}
            // uid={feed.uid}
            // username={feed.username}
            // updatedAt={feed.updatedAt}
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
