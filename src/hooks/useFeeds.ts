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
  FirestoreError,
} from "firebase/firestore";

interface Post {
  id: string;
  uid: string;
  username: string;
  displayName: string;
  avatarURL: string;
  imageURL: string;
  caption: string;
  timestamp: Date;
  tags: string[];
}

export const useFeeds: (uid: string) => Post[] = (uid) => {
  let isMounted: boolean = true;
  const [feeds, setFeeds] = useState<Post[]>([]);
  const previousFeeds: Post[] = [];
  const feedsQuery: Query<DocumentData> = query(
    collection(db, `users/${uid}/feeds`),
    orderBy("timestamp", "desc")
  );
  const unsubscribe: () => Promise<void> = async () => {
    onSnapshot(feedsQuery, (feedsSnap: QuerySnapshot<DocumentData>) => {
      if (isMounted !== true) {
        if (process.env.NODE_ENV === "development") {
          console.log("onSnapshotの処理をリセットしました");
        }
        return;
      }
      const newFeeds: Post[] = feedsSnap.docs.map(
        (feedSnap: QueryDocumentSnapshot<DocumentData>) => {
          const newFeed: Post = {
            id: feedSnap.id,
            uid: feedSnap.data().uid,
            username: feedSnap.data().username,
            displayName: feedSnap.data().displayName,
            avatarURL: feedSnap.data().avatarURL,
            imageURL: feedSnap.data().imageURL,
            caption: feedSnap.data().caption,
            timestamp: feedSnap.data().timestamp.toDate(),
            tags: feedSnap.data().tags,
          };
          previousFeeds.filter((previousFeed: Post) => {
            return previousFeed.id !== newFeed.id;
          });
          return newFeed;
        },
        (error: FirestoreError) => {
          if (process.env.NODE_ENV === "development") {
            console.log(
              `onSnapshot()の処理で以下のエラーが発生しました\n${error}`
            );
          }
        }
      );
      setFeeds(
        previousFeeds.concat(newFeeds).sort((first: Post, second: Post) => {
          return second.timestamp.getTime() - first.timestamp.getTime();
        })
      );
    });
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
  return feeds;
};
