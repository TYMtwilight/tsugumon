import React, { useState, useEffect } from "react";
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

const Profile: React.VFC = () => {
  const params: Readonly<Params<string>> = useParams();
  const [username, setUsername] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [photoURL, setPhotoURL] = useState<string>("");
  const [userType, setUserType] = useState<
    "businessUser" | "normalUser" | null
  >(null);

  const setProfile = async (isMounted: boolean) => {
    setUsername(params.username!);
    const usersRef: CollectionReference<DocumentData> = collection(db, "users");
    const userQuery: Query<DocumentData> = query(
      usersRef,
      where("username", "==", username)
    );
    const usersSnapshot: QuerySnapshot<DocumentData> = await getDocs(userQuery);
    usersSnapshot.forEach((doc: QueryDocumentSnapshot) => {
      if (isMounted) {
        setDisplayName(doc.data().displayName);
        setPhotoURL(doc.data().photoURL);
        setUserType(doc.data().userType);
      }
    });
    
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
        <img
          id="avatar"
          src={photoURL ? photoURL : `${process.env.PUBLIC_URL}/noAvatar.png`}
          alt="アバター画像"
        />
        <p id="username">{username}</p>
        <p id="displayName">{displayName}</p>
      </div>
    </div>
  );
};

export default Profile;
