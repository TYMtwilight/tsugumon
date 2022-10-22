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
  displayName: string;
  introduction: string;
  uid: string;
  username: string;
  userType: "business" | "normal" | null;
}

export const useLikeUsers: (postId: string) => User[] = (postId: string) => {
  const [likeUsers, setLikeUsers] = useState<User[]>([]);
  let isMounted: boolean = postId !== undefined;
  const unsubscribe: () => void = async () => {
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
        if (isMounted === true) {
          setLikeUsers(
            snapshots.docs.map(
              (snapshot: QueryDocumentSnapshot<DocumentData>) => {
                const likeUser: User = {
                  avatarURL: snapshot.data().avatarURL,
                  displayName: snapshot.data().displayName,
                  introduction: snapshot.data().introduction,
                  uid: snapshot.id,
                  username: snapshot.data().username,
                  userType: snapshot.data().userType,
                };
                return likeUser;
              }
            )
          );
        } else {
          return;
        }
      },
      (error: FirestoreError) => {
        if (process.env.NODE_ENV === "development") {
          console.error(error);
        }
      }
    );
  };

  useEffect(() => {
    unsubscribe();
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isMounted = false;
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return likeUsers;
};
