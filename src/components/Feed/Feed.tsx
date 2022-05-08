import { useState, memo, useCallback } from "react";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUser, logout, toggleIsNewUser } from "../../features/userSlice";
import Post from "../Post/Post";
import SelectUserType from "../SelectUserType/SelectUserType";
import BusinessUser from "../BusinessUser/BusinessUser";
import Upload from "../Upload/Upload";
import { useFeeds } from "../../hooks/useFeeds";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import AddCircle from "@mui/icons-material/AddCircle";

interface PostData {
  id: string;
  uid: string;
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
  const [uploadOn, setUploadOn] = useState<boolean>(false);
  const [profileOn, setProfileOn] = useState<boolean>(false);
  const closeUpload: () => void = useCallback(() => {
    setUploadOn(false);
  }, []);
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
        {feeds!.map((feed) => {
          return (
            <Post
              key={feed.id}
              uid={feed.uid}
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
        {uploadOn ? (
          <Upload closeUpload={closeUpload} />
        ) : (
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              setUploadOn(true);
            }}
          >
            <AddCircle />
          </button>
        )}
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
      </div>
    );
  } else {
    return <SelectUserType />;
  }
});

export default Feed;
