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

interface Post {
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
  const [posts, setPosts] = useState<Post[]>([]);
  let isMounted: boolean = true;
  const unsubscribe: () => void = async () => {
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
        const unChangedPosts: Post[] = posts;
        const changedPosts: Post[] = snapshots.docs.map(
          (snapshot: QueryDocumentSnapshot<DocumentData>) => {
            const changedPost: Post = {
              avatarURL: snapshot.data().avatarURL,
              caption: snapshot.data().caption,
              displayName: snapshot.data().displayName,
              id: snapshot.id,
              imageURL: snapshot.data().imageURL,
              timestamp: snapshot.data().timestamp.toDate(),
              uid: snapshot.data().uid,
              username: snapshot.data().username,
            };
            unChangedPosts.filter((unChangedPost) => {
              return unChangedPost.id !== changedPost.id;
            });
            return changedPost;
          }
        );
        setPosts(unChangedPosts.concat(changedPosts));
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
