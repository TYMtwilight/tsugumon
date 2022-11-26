import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
  orderBy,
  QueryDocumentSnapshot,
  query,
  Query,
  where,
} from "firebase/firestore";

interface Post {
  avatarURL: string;
  caption: string;
  displayName: string;
  id: string;
  imageURL: string;
  timestamp: Date;
  tags: string[];
  uid: string;
  username: string;
}

export const usePosts: (username: string) => Post[] = (username) => {
  const [posts, setPosts] = useState<Post[]>([]);
  let isMounted: boolean = true;
  const unsubscribe: () => void = async () => {
    const postsQuery: Query<DocumentData> = query(
      collection(db, "posts"),
      where("username", "==", username),
      orderBy("timestamp", "desc")
    );

    onSnapshot(
      postsQuery,
      (snapshots: QuerySnapshot<DocumentData>) => {
        if (isMounted === false) {
          if (process.env.NODE_ENV === "development") {
            console.log("onSnapshotをリセットしました");
          }
          return;
        }
        const unChangedPosts: Post[] = posts;
        const changedPosts: Post[] = snapshots.docs.map(
          (snapshot: QueryDocumentSnapshot<DocumentData>) => {
            const value: DocumentData = snapshot.data();
            const changedPost: Post = {
              avatarURL: value.avatarURL,
              caption: value.caption,
              displayName: value.displayName,
              id: snapshot.id,
              imageURL: value.imageURL,
              tags: value.tags,
              timestamp: value.timestamp && value.timestamp.toDate(),
              uid: value.uid,
              username: value.username,
            };
            unChangedPosts.filter((unChangedPost) => {
              return unChangedPost.id !== changedPost.id;
            });
            return changedPost;
          }
        );
        setPosts(
          unChangedPosts.concat(changedPosts).filter((post) => {
            return post.username === username;
          })
        );
      },
      (error) => {
        console.error(error);
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
  }, [username]);
  return posts;
};
