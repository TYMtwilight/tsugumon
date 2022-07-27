import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
  DocumentReference,
  getDocs,
  QuerySnapshot,
  WriteBatch,
  writeBatch,
} from "firebase/firestore";

interface UserData {
  avatarURL: string;
  displayName: string;
  uid: string;
  username: string;
  userType: "business" | "normal" | null;
}

interface PostData {
  avatarURL: string;
  caption: string;
  displayName: string;
  id: string;
  imageURL: string;
  timestamp: number;
  uid: string;
  username: string;
}

export const useLikes: (
  like: boolean,
  user: UserData,
  post: PostData
) => number = (like, user, post) => {
  const [counts, setCounts] = useState<number>(0);
  let isMounted = user !== null;

  const batch: WriteBatch = writeBatch(db);

  useEffect(() => {
    if (post.id === "") {
      return;
    }
    const likeUserRef: DocumentReference<DocumentData> = doc(
      db,
      `posts/${post.id}/likeUsers/${user.uid}`
    );
    const likePostRef: DocumentReference<DocumentData> = doc(
      db,
      `users/${user.uid}/likePosts/${post.id}`
    );
    const likeUsersRef: CollectionReference<DocumentData> = collection(
      db,
      `posts/${post.id}/likeUsers`
    );
    const countLikeUsers: () => void = async () => {
      await getDocs(likeUsersRef).then(
        (likeUsersSnaps: QuerySnapshot<DocumentData>) => {
          setCounts(likeUsersSnaps.size);
        }
      );
    };
    if (isMounted === false) {
      return;
    }
    if (like) {
      batch.set(likeUserRef, user);
      batch.set(likePostRef, post);
    } else {
      batch.delete(likeUserRef);
      batch.delete(likePostRef);
    }
    batch.commit().then(() => {
      countLikeUsers();
    });
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [like]);
  return counts;
};
