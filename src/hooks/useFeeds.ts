import { useState, useEffect } from "react";
import { useAppSelector } from "../app/hooks";
import { selectUser, LoginUser } from "../features/userSlice";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
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

export const useFeeds: () => Post[] = () => {
  let isMounted: boolean = true;
  const loginUser: LoginUser = useAppSelector(selectUser);
  const [feeds, setFeeds] = useState<Post[]>([]);
  const previousFeeds: Post[] = [];

  const unsubscribe: () => Promise<void> = async () => {
    const feedsQuery: Query<DocumentData> = query(
      collection(db, `users/${loginUser.uid}/feeds`)
    );
    onSnapshot(feedsQuery, (feedsSnap: QuerySnapshot<DocumentData>) => {
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
      if (isMounted) {
        setFeeds(
          previousFeeds.concat(newFeeds).sort((first: Post, second: Post) => {
            return second.timestamp.getTime() - first.timestamp.getTime();
          })
        );
      }
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
