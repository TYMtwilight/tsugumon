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

export const usePosts = (username: string) => {
  const [posts, setPosts] = useState<PostData[]>([]);
  let isMounted = true;
  const unsubscribe: () => void = async () => {
    const postsQuery: Query<DocumentData> = query(
      collection(db, "posts"),
      where("username", "==", username)
    );

    onSnapshot(
      postsQuery,
      (snapshots: QuerySnapshot<DocumentData>) => {
        const unChangedPosts: PostData[] = posts;
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
            unChangedPosts.filter((unChangedPost) => {
              return unChangedPost.id !== changedPost.id;
            });
            return changedPost;
          }
        );
        if (isMounted === true) {
          setPosts(unChangedPosts.concat(changedPosts));
        }
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
  }, []);
  console.log(posts);
  return posts;
};
