import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUser, logout, toggleIsNewUser } from "../../features/userSlice";
import SelectUserType from "../SelectUserType/SelectUserType";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import ProfileForEnterprise from "../ProfileForEnterprise/ProfileForEnterprise";
import Upload from "../Upload/Upload";
import AddCircle from "@mui/icons-material/AddCircle";
import React from "react";

const Feed = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [uploadOn, setUploadOn] = useState<boolean>(false);

  const closeUpload: () => void = () => {
    setUploadOn(false);
  };

  return (
    <>
      {user.userType ? (
        <div>
          <ProfileForEnterprise />
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
