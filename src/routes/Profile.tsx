import React, { useState, useEffect, memo } from "react";
import { Params, useParams } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  CollectionReference,
  DocumentData,
  getDocs,
  Query,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  where,
} from "firebase/firestore";

const Profile: React.VFC = memo(() => {
  const params: Readonly<Params<string>> = useParams();
  const [address, setAddress] = useState<string>("");
  const [avatarURL, setAvatarURL] = useState<string>("");
  const [backgroundURL, setBackgroundURL] = useState<string>("");
  const [birthdate, setBirthdate] = useState<Date | null>(null);
  const [skill, setSkill] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [introduction, setIntroduction] = useState<string>("");
  const [owner, setOwner] = useState<string>("");
  const [typeOfWork, setTypeOfWork] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [userType, setUserType] = useState<"business" | "nurmal" | null>(null);

  const setProfile = async (isMounted: boolean) => {
    setUsername(params.username!);
    const usersRef: CollectionReference<DocumentData> = collection(db, "users");
    const userQuery: Query<DocumentData> = query(
      usersRef,
      where("username", "==", username)
    );
    await getDocs(userQuery).then(
      async (querySnapshot: QuerySnapshot<DocumentData>) => {
        querySnapshot.forEach(
          (userSnapshot: QueryDocumentSnapshot<DocumentData>) => {
            if (!isMounted) {
              return;
            }
            setAvatarURL(userSnapshot.data().avatarURL);
            setBackgroundURL(userSnapshot.data().backgroundURL);
            setDisplayName(userSnapshot.data().displayName);
            setIntroduction(userSnapshot.data().introduction);
          }
        );
      }
    );

    const optionRef: CollectionReference<DocumentData> = collection(
      db,
      "option"
    );
    const optionQuery: Query<DocumentData> = query(
      optionRef,
      where("username", "==", username)
    );
    await getDocs(optionQuery).then(
      async (querySnapshot: QuerySnapshot<DocumentData>) => {
        querySnapshot.forEach(
          (optionSnapshot: QueryDocumentSnapshot<DocumentData>) => {
            if (!isMounted) {
              return;
            }
            if (optionSnapshot.data().userType === "business") {
              setAddress(optionSnapshot.data()!.address);
              setOwner(optionSnapshot.data()!.owner);
              setTypeOfWork(optionSnapshot.data()!.typeOfWork);
              setUserType(optionSnapshot.data()!.userType);
            } else {
              setBirthdate(optionSnapshot.data()!.birthdate);
              setSkill(optionSnapshot.data()!.skill);
              setUserType(optionSnapshot.data()!.userType);
            }
          }
        );
      }
    );
  };

  useEffect(() => {
    let isMounted: boolean = true;
    setProfile(isMounted);
    return () => {
      isMounted = false;
    };
  });

  return (
    <div>
      <div id="top">
        <button
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            window.history.back();
          }}
        >
          戻る
        </button>
        <img id="background" src={backgroundURL} alt="背景画像" />
        <img
          id="avatar"
          src={avatarURL ? avatarURL : `${process.env.PUBLIC_URL}/noAvatar.png`}
          alt="アバター画像"
        />
        <p id="username">{username}</p>
        <p id="displayName">{displayName}</p>
      </div>
      <div id="profile">
        <p>紹介文</p>
        <p>{introduction}</p>
        <button>さらに表示</button>
        <div id="followerCount">
          <p>フォロワー</p>
          <p>０人</p>
        </div>
        <div id="followeeCount">
          <p>フォロー中</p>
          <p>０人</p>
        </div>
        {userType === "business" ? (
          <div id="business">
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
        ) : (
          <div id="normal">
            <div id="birthdate">
              <p>生年月日</p>
              <p>{birthdate}</p>
            </div>
            <div id="skill">
              <p>{skill}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default Profile;
