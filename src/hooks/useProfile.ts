import { useState, useEffect } from "react";
import { useAppSelector } from "../app/hooks";
import { LoginUser, selectUser } from "../features/userSlice";
import { db } from "../firebase";
import {
  collection,
  DocumentData,
  query,
  Query,
  where,
  getDocs,
  CollectionReference,
  onSnapshot,
  QuerySnapshot,
  QueryDocumentSnapshot,
} from "firebase/firestore";

interface User {
  avatarURL: string;
  backgroundURL: string;
  cropsTags: string[];
  displayName: string;
  introduction: string;
  uid: string;
  userType: "business" | "normal" | null;
  username: string;
}

interface Option {
  address: string;
  birthdate: string;
  owner: string;
  skill: string;
  typeOfWork: string;
}

export const useProfile: (username: string) => {
  user: User;
  option: Option;
  followingsCount: number;
  followersCount: number;
  isFollowing: boolean;
  loginUser: LoginUser;
} = (username: string) => {
  const [user, setUser] = useState<User>({
    avatarURL: "",
    backgroundURL: "",
    cropsTags: [],
    displayName: "",
    introduction: "",
    uid: "",
    userType: null,
    username: "",
  });
  const [option, setOption] = useState<Option>({
    address: "",
    birthdate: "",
    owner: "",
    skill: "",
    typeOfWork: "",
  });
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingsCount, setFollowingsCount] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const loginUser: LoginUser = useAppSelector(selectUser);
  let isMounted: boolean = true;

  const userQuery: Query<DocumentData> = query(
    collection(db, "users"),
    where("username", "==", username)
  );

  const getUser: () => Promise<void> = async () => {
    // NOTE >> ユーザーの基本プロフィールを取得します
    const userSnap: QuerySnapshot<DocumentData> = await getDocs(userQuery);
    if (isMounted === false) {
      return;
    }
    setUser({
      avatarURL: userSnap.docs[0].data().avatarURL,
      backgroundURL: userSnap.docs[0].data().backgroundURL,
      cropsTags: userSnap.docs[0].data().cropsTags,
      displayName: userSnap.docs[0].data().displayName,
      introduction: userSnap.docs[0].data().introduction,
      uid: userSnap.docs[0].id,
      username: userSnap.docs[0].data().username,
      userType: userSnap.docs[0].data().userType,
    });

    const optionQuery: Query<DocumentData> = query(
      collection(db, "option"),
      where("username", "==", username)
    );
    const optionSnap: QuerySnapshot<DocumentData> = await getDocs(optionQuery);
    setOption({
      address: optionSnap.docs[0].data().address,
      birthdate: optionSnap.docs[0].data().birthdate,
      owner: optionSnap.docs[0].data().owner,
      skill: optionSnap.docs[0].data().skill,
      typeOfWork: optionSnap.docs[0].data().typeOfWork,
    });
  };

  const unsubscribe: () => Promise<void> = async () => {
    const userSnap: QuerySnapshot<DocumentData> = await getDocs(userQuery);
    // NOTE >> フォロー・フォロワー数を取得します
    const followingsRef: CollectionReference<DocumentData> = collection(
      db,
      `users/${userSnap.docs[0].id}/followings`
    );
    const followersRef: CollectionReference<DocumentData> = collection(
      db,
      `users/${userSnap.docs[0].id}/followers`
    );
    onSnapshot(followingsRef, (followingsSnap: QuerySnapshot<DocumentData>) => {
      if (isMounted === true) {
        setFollowingsCount(followingsSnap.size);
      }
    });
    onSnapshot(followersRef, (followersSnap: QuerySnapshot<DocumentData>) => {
      if (isMounted === true) {
        setFollowersCount(followersSnap.size);
        setIsFollowing(
          followersSnap.docs.find(
            (followerSnap: QueryDocumentSnapshot<DocumentData>) => {
              return followerSnap.id === loginUser.uid;
            }
          ) !== undefined
        );
      }
    });
  };

  useEffect(() => {
    getUser();
    unsubscribe();
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isMounted = false;
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return {
    user: user,
    option: option,
    followingsCount: followingsCount,
    followersCount: followersCount,
    isFollowing: isFollowing,
    loginUser: loginUser,
  };
};
