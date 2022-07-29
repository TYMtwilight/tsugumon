import { useState, useEffect } from "react";
import { db } from "../firebase";

import {
  collection,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
  QueryDocumentSnapshot,
  CollectionReference,
  FirestoreError,
} from "firebase/firestore";

interface UserData {
  avatarURL: string;
  caption:string;
  displayName: string;
  uid: string;
  username: string;
  userType: "business" | "normal" | null;
}

export const useLikeUsers: (postId: string) => UserData[] = (
  postId: string
) => {
  const [likeUsers, setLikeUsers] = useState<UserData[]>([]);

  const unsubscribe: (isMounted: boolean) => void = async (isMounted) => {
    if (isMounted === false || postId === "") {
      return;
    }
    const likeUsersRef: CollectionReference<DocumentData> = collection(
      db,
      `posts/${postId}/likeUsers/`
    );

    onSnapshot(
      likeUsersRef,
      (snapshots: QuerySnapshot<DocumentData>) => {
        setLikeUsers(
          snapshots.docs.map(
            (snapshot: QueryDocumentSnapshot<DocumentData>) => {
              const likeUser: UserData = {
                avatarURL: snapshot.data().avatarURL,
                caption: snapshot.data().caption,
                displayName: snapshot.data().displayName,
                uid: snapshot.id,
                username: snapshot.data().username,
                userType: snapshot.data().userType,
              };
              return likeUser;
            }
          )
        );
      },
      (error: FirestoreError) => {
        if (process.env.NODE_ENV === "development") {
          console.error(error);
        }
      }
    );
  };

  useEffect(() => {
    let isMounted: boolean = true;
    unsubscribe(isMounted);
    return () => {
      isMounted = false;
      unsubscribe(isMounted);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return likeUsers;
};
