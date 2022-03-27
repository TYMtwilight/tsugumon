import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUser, logout, toggleIsNewUser } from "../../features/userSlice";
import SelectUserType from "../SelectUserType/SelectUserType";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import EditProfileForEnterprise from "../EditProfileForEnterprise/EditProfileForEnterprise";
import Upload from "../Upload/Upload";
import React from "react";

const Feed = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  return (
    <>
      {user.userType ? (
        <div>
          <EditProfileForEnterprise />
          <Upload />
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
