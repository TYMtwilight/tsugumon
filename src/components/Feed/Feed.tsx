import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUser, logout, toggleIsNewUser } from "../../features/userSlice";
import Post from "../Post/Post";
import { useFeeds } from "../../hooks/useFeeds";
import SelectUserType from "../SelectUserType/SelectUserType";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import BusinessUser from "../BusinessUser/BusinessUser";
import Upload from "../Upload/Upload";
import AddCircle from "@mui/icons-material/AddCircle";
import React from "react";

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

const Feed = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [uploadOn, setUploadOn] = useState<boolean>(false);
  const closeUpload: () => void = () => {
    setUploadOn(false);
  };
  const feeds: PostData[] = useFeeds();
  console.log(feeds);
  return (
    <>
      {user.userType ? (
        <div>
          {feeds!.map((feed) => {
            console.log(feed.id);
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
          <BusinessUser />
          {uploadOn ? (
            <Upload
              onClick={() => {
                closeUpload();
              }}
            />
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
      ) : (
        <SelectUserType />
      )}
    </>
  );
};

export default Feed;
