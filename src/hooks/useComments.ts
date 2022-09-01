import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  DocumentData,
  FirestoreError,
  onSnapshot,
  orderBy,
  Query,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore";

interface Comment {
  avatarURL: string;
  comment: string;
  displayName: string;
  id: string;
  timestamp: Date;
  username: string;
}

export const useComments: (postId: string) => Comment[] = (postId) => {
  const [comments, setComments] = useState<Comment[]>([]);
  let isMounted: boolean = postId !== undefined;
  const unsubscribe: () => void = async () => {
    const commentsQuery: Query<DocumentData> = query(
      collection(db, `posts/${postId}/comments`),
      orderBy("timestamp", "desc")
    );
    onSnapshot(
      commentsQuery,
      (snapshots: QuerySnapshot<DocumentData>) => {
        if (isMounted === false) {
          return;
        }
        const uploadedComments: Comment[] = snapshots.docs.map(
          (snapshot: QueryDocumentSnapshot<DocumentData>) => {
            const value: DocumentData = snapshot.data();
            const comment: Comment = {
              avatarURL: value.avatarURL,
              comment: value.comment,
              displayName: value.displayName,
              id: snapshot.id,
              timestamp: value.timestamp && value.timestamp.toDate(),
              username: value.username,
            };
            return comment;
          }
        );
        setComments(uploadedComments);
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
  return comments;
};
