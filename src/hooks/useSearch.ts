import { useState, useEffect } from "react";
import {
  collection,
  DocumentData,
  getDocs,
  limit,
  query,
  Query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

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

export const useSearch: (filter: string | null) => PostData[] = (filter) => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const usersQuery: Query<DocumentData> = query(
    collection(db, "users"),
    where("cropsTags", "array-contains", filter)
  );
  let usernames: string[] = [];
  const getPosts: () => void = () => {
    setPosts([]);
    getDocs(usersQuery).then((userSnaps: QuerySnapshot<DocumentData>) => {
      usernames = userSnaps.docs.map(
        (userSnap: QueryDocumentSnapshot<DocumentData>) => {
          return userSnap.data().username;
        }
      );
      getDocs(
        query(
          collection(db, "posts"),
          where("username", "in", usernames),
          limit(50)
        )
      ).then((postSnaps: QuerySnapshot<DocumentData>) => {
        // eslint-disable-next-line array-callback-return
        postSnaps.docs.forEach(
          (snapshot: QueryDocumentSnapshot<DocumentData>) => {
            const postSnap: PostData = {
              avatarURL: snapshot.data().avatarURL,
              caption: snapshot.data().caption,
              displayName: snapshot.data().displayName,
              id: snapshot.data().id,
              imageURL: snapshot.data().imageURL,
              timestamp: snapshot.data().timestamp,
              uid: snapshot.data().uid,
              username: snapshot.data().username,
            };
            setPosts((prev: PostData[]) => {
              return prev.concat([postSnap]);
            });
          }
        );
      });
    });
  };

  useEffect(() => {
    getPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);
  return posts;
};
