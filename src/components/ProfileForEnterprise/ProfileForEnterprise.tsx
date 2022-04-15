import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectUser, toggleIsNewUser } from "../../features/userSlice";
import { db } from "../../firebase";
import {
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
} from "firebase/firestore";
import EditProfileForEnterprise from "../EditBusinessUser/EditBusinessUser";
import PastPost from "../PastPost/PastPost";

const ProfileForEnterprise: React.FC = () => {
  const [edit, setEdit] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>("");
  const [introduction, setIntroduction] = useState<string>("");
  const [avatarURL, setAvataraURL] = useState<string>("");
  const [backgroundURL, setBackgroundURL] = useState<string>("");
  const [owner, setOwner] = useState<string>("");
  const [typeOfWork, setTypeOfWork] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [tab, setTab] = useState<"posts" | "advertise">("posts");

  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const userRef: DocumentReference<DocumentData> = doc(
    db,
    "users",
    `${user.uid}`
  );
  const businessUserRef: DocumentReference<DocumentData> = doc(
    db,
    "users",
    `${user.uid}`,
    "businessUser",
    `${user.uid}`
  );
  const getUser: () => Promise<void> = async () => {
    const userSnap = await getDoc(userRef);
    if (userSnap) {
      setDisplayName(userSnap.data()!.displayName);
      setAvataraURL(userSnap.data()!.photoURL);
    }
  };
  const getEnterprise: () => Promise<void> = async () => {
    const businessUserSnap = await getDoc(businessUserRef);
    if (businessUserSnap) {
      setIntroduction(businessUserSnap.data()!.introduction);
      setBackgroundURL(businessUserSnap.data()!.backgroundURL);
      setOwner(businessUserSnap.data()!.owner);
      setTypeOfWork(businessUserSnap.data()!.typeOfWork);
      setAddress(businessUserSnap.data()!.address);
    }
  };

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("useEffectが実行されました");
    }
    getUser();
    getEnterprise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edit]);

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
      {edit && <EditProfileForEnterprise closeEdit={closeEdit} />}
      <div id="top">
        <img id="background" src={backgroundURL} alt="背景画像" />
        <img
          id="avatar"
          src={avatarURL ? avatarURL : `${process.env.PUBLIC_URL}/noAvatar.png`}
          alt="アバター画像"
        />
        <p id="displayName">{displayName}</p>
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
        <div id="introduction">
          <p>紹介文</p>
          <p>{introduction}</p>
          <button>さらに表示</button>
        </div>
        <div id="followerCount">
          <p>フォロワー</p>
          <p>０人</p>
        </div>
        <div id="followeeCount">
          <p>フォロー中</p>
          <p>０人</p>
        </div>
        <div id="owner">
          <p>事業主</p>
          <p>{owner}</p>
        </div>
        <div id="typeOfWork">
          <p>職種</p>
          <p>{typeOfWork}</p>
        </div>
        <div id="address">
          <p>住所</p>
          <p>{address}</p>
        </div>
      </div>
      <div>
        <button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            setTab("posts");
          }}
        >
          投稿
        </button>
        <button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            setTab("advertise");
          }}
        >
          募集
        </button>
      </div>
      {tab === "posts" && <PastPost />}
      {tab === "advertise" && <p>advertise</p>}
    </div>
  );
};

export default ProfileForEnterprise;
