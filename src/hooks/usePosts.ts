import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
  QueryDocumentSnapshot,
  query,
  Query,
  where,
} from "firebase/firestore";

interface PostData {
  avatarURL: string;
  caption: string;
  displayName: string;
  id: string;
  imageURL: string;
  timestamp: Date;
  uid: string;
  username: string;
}

export const usePosts: (username: string) => PostData[] = (username) => {
  const [posts, setPosts] = useState<PostData[]>([]);
  console.log("usePost");
  let sortedPosts: PostData[] = [];

  const unsubscribe: (isMounted: boolean) => void = (isMounted) => {
    if (isMounted === false) {
      return;
    }
    const postsQuery: Query<DocumentData> = query(
      collection(db, "posts"),
      where("username", "==", username)
    );
    onSnapshot(
      postsQuery,
      (snapshots: QuerySnapshot<DocumentData>) => {
        const changedPosts: PostData[] = snapshots.docs.map(
          (snapshot: QueryDocumentSnapshot<DocumentData>) => {
            const changedPost: PostData = {
              avatarURL: snapshot.data().avatarURL,
              caption: snapshot.data().caption,
              displayName: snapshot.data().displayName,
              id: snapshot.id,
              imageURL: snapshot.data().imageURL,
              timestamp: snapshot.data().timestamp,
              uid: snapshot.data().uid,
              username: snapshot.data().username,
            };
            sortedPosts.filter((sortedPost) => {
              return sortedPost.id !== changedPost.id;
            });
            return changedPost;
          }
        );
        sortedPosts = sortedPosts
          .concat(changedPosts)
        setPosts(sortedPosts);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  useEffect(() => {
    let isMounted = true;
    unsubscribe(isMounted);
    return () => {
      isMounted = false;
      unsubscribe(isMounted);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return posts;
};
