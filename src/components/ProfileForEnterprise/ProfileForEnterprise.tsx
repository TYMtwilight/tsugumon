import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectUser, toggleIsNewUser } from "../../features/userSlice";
import EditProfileForEnterprise from "../EditProfileForEnterprise/EditProfileForEnterprise";
const ProfileForEnterprise: React.FC = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [edit, setEdit] = useState<boolean>(false);
  const closeEdit: () => void = () => {
    setEdit(false);
  };
  useEffect(() => {
    if (user.isNewUser) {
      setEdit(true);
    }
    return () => {
      dispatch(toggleIsNewUser(false));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {edit && (
        <EditProfileForEnterprise
          onClick={() => {
            closeEdit();
          }}
        />
      )}
      <div id="top">
        <img id="background" alt="背景画像" />
        <img id="avatar" alt="アバター画像" />
        {/* TODO >> ログインユーザーがプロフィール画面のユーザーと
                        異なる場合には、「フォロー」ボタンを表示するようにする  */}
        <button
          id="toEditProfile"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            setEdit(true);
          }}
        >
          編集する
        </button>
      </div>
      <div id="profile">
        <p id="introduction">説明文</p>
        <button>さらに表示</button>
        <div id="followerCount">
          <p>フォロワー</p>
          <p>人</p>
        </div>
        <div id="followeeCount">
          <p>フォロー中</p>
          <p>人</p>
        </div>
        <div>
          <p id="owner"></p>
        </div>
        <div>
          <p id="typeOfWork"></p>
        </div>
        <div>
          <p id="address"></p>
        </div>
      </div>
    </div>
  );
};

export default ProfileForEnterprise;
