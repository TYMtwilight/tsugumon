import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  QuerySnapshot,
  DocumentData,
  QueryDocumentSnapshot,
  where,
  query,
  Query,
  getDocs,
  CollectionReference,
} from "firebase/firestore";

interface Following {
  avatarURL: string;
  displayName: string;
  introduction: string;
  uid: string;
  userType: "business" | "normal" | null;
  username: string;
}

export const useFollowings: (username: string) => Following[] = (username) => {
  const [followings, setFollowers] = useState<Following[]>([]);
  let isMounted: boolean = true;
  const userQuery: Query<DocumentData> = query(
    collection(db, "users"),
    where("username", "==", username)
  );
  const unsubscribe = async () => {
    if (isMounted !== true) {
      if (process.env.NODE_ENV === "development") {
        console.log("onSnapshotの処理をリセットしました");
      }
      return;
    }
    const uid: string = (await getDocs(userQuery)).docs[0].id;
    const followingsRef: CollectionReference = collection(
      db,
      `users/${uid}/followings`
    );
    const followingsSnap: QuerySnapshot<DocumentData> = await getDocs(
      followingsRef
    );
    setFollowers(
      followingsSnap.docs.map(
        (followingSnap: QueryDocumentSnapshot<DocumentData>) => {
          return {
            avatarURL: followingSnap.data().avatarURL,
            displayName: followingSnap.data().displayName,
            introduction: followingSnap.data().introduction,
            uid: followingSnap.id,
            userType: followingSnap.data().userType,
            username: followingSnap.data().username,
          };
        }
      )
    );
  };
  useEffect(() => {
    unsubscribe();
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isMounted = false;
      unsubscribe();
    };
  }, []);
  return followings;
};
