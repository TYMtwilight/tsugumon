import { useState, useEffect } from "react";
import {
  collection,
  DocumentData,
  getDocs,
  limit,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
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

export const useSearch: (searchTag: string | null) => Post[] = (searchTag) => {
  const [posts, setPosts] = useState<Post[]>([]);
  let isMounted:boolean = searchTag !== null;

  const getPosts: () => void = () => {
    setPosts([]);
    if (isMounted === false) {
      return;
    }
    getDocs(
      query(
        collection(db, "users"),
        where("cropsTags", "array-contains", searchTag)
      )
    ).then((userSnaps: QuerySnapshot<DocumentData>) => {
      let usernames: string[] = userSnaps.docs.map(
        (userSnap: QueryDocumentSnapshot<DocumentData>) => {
          return userSnap.data().username;
        }
      );
      if (usernames.length > 0) {
        getDocs(
          query(
            collection(db, "posts"),
            where("username", "in", usernames),
            limit(50)
          )
        ).then((postSnaps: QuerySnapshot<DocumentData>) => {
          // eslint-disable-next-line array-callback-return
          const postsArray: Post[] = postSnaps.docs.map(
            (snapshot: QueryDocumentSnapshot<DocumentData>) => {
              const postSnap: Post = {
                avatarURL: snapshot.data().avatarURL,
                caption: snapshot.data().caption,
                displayName: snapshot.data().displayName,
                id: snapshot.id,
                imageURL: snapshot.data().imageURL,
                timestamp: snapshot.data().timestamp.toDate(),
                uid: snapshot.data().uid,
                username: snapshot.data().username,
              };
              return postSnap;
            }
          );
          if (postsArray.length === postSnaps.docs.length) {
            setPosts(postsArray);
          }
        });
      }
    });
  };

  useEffect(() => {
    getPosts();
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTag]);
  return posts;
};
