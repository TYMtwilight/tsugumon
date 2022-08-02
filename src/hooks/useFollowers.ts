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

interface Follower {
  avatarURL: string;
  displayName: string;
  introduction: string;
  uid: string;
  userType: "business" | "normal" | null;
  username: string;
}

export const useFollowers: (username: string) => Follower[] = (username) => {
  const [followers, setFollowers] = useState<Follower[]>([]);
  let isMounted: boolean = true;
  const userQuery: Query<DocumentData> = query(
    collection(db, "users"),
    where("username", "==", username)
  );
  const unsubscribe = async () => {
    const uid: string = (await getDocs(userQuery)).docs[0].id;
    const followersRef: CollectionReference = collection(
      db,
      `users/${uid}/followers`
    );
    const followersSnap: QuerySnapshot<DocumentData> = await getDocs(
      followersRef
    );
    if (isMounted === true) {
      setFollowers(
        followersSnap.docs.map(
          (followerSnap: QueryDocumentSnapshot<DocumentData>) => {
            return {
              avatarURL: followerSnap.data().avatarURL,
              displayName: followerSnap.data().displayName,
              introduction: followerSnap.data().introduction,
              uid: followerSnap.id,
              userType: followerSnap.data().userType,
              username: followerSnap.data().username,
            };
          }
        )
      );
    }
  };
  useEffect(() => {
    unsubscribe();
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isMounted = false;
      unsubscribe();
    };
  }, []);
  return followers;
};
