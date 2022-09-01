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

interface User {
  avatarURL: string;
  caption: string;
  displayName: string;
  uid: string;
  username: string;
  userType: "business" | "normal" | null;
}

export const useLikeUsers: (postId: string) => User[] = (postId: string) => {
  const [likeUsers, setLikeUsers] = useState<User[]>([]);
  let isMounted: boolean = postId !== undefined;
  const unsubscribe: (isMounted: boolean) => void = async (isMounted) => {
    if (isMounted === false) {
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
              const likeUser: User = {
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
    unsubscribe(isMounted);
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isMounted = false;
      unsubscribe(isMounted);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return likeUsers;
};
