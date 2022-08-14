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
  getDocs,
  Query,
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
}

export const useFeeds: () => Post[] = () => {
  if (process.env.NODE_ENV === "development") {
    console.log("useFeeds.tsがレンダリングされました");
  }
  const user: LoginUser = useAppSelector(selectUser);
  const [feeds, setFeeds] = useState<Post[]>([]);
  let updatedFeeds: Post[] = [];
  let sortedFeeds: Post[] = [];

  const unsubscribe: (isMounted: boolean) => Promise<void> = async (
    isMounted: boolean
  ) => {
    const followeesQuery: Query<DocumentData> = query(
      collection(db, `users/${user.uid}/followees`)
    );
    const followeesSnapshot: QuerySnapshot<DocumentData> = await getDocs(
      followeesQuery
    );
    const followees: string[] = followeesSnapshot.docs.map((snapshot) => {
      return snapshot.data().uid;
    });
    if (followees.length > 0) {
      followees.forEach((followeeUID: string) => {
        const feedsQuery: Query<DocumentData> = query(
          collection(
            db,
            `users/${followeeUID}/businessUser/${followeeUID}/posts`
          )
        );
        onSnapshot(
          feedsQuery,
          (snapshots: QuerySnapshot<DocumentData>) => {
            const followeeFeeds: Post[] = snapshots.docs.map(
              (snapshot: QueryDocumentSnapshot<DocumentData>) => {
                const feedData: Post = {
                  id: snapshot.id,
                  uid: snapshot.data().uid,
                  username: snapshot.data().username,
                  displayName: snapshot.data().displayName,
                  avatarURL: snapshot.data().avatarURL,
                  imageURL: snapshot.data().imageURL,
                  caption: snapshot.data().caption,
                  timestamp: snapshot.data().timestamp.toDate(),
                };
                updatedFeeds.filter((updateFeed) => {
                  return updateFeed.id !== feedData.id;
                });
                return feedData;
              }
            );
            sortedFeeds = updatedFeeds
              .concat(followeeFeeds)
              .sort((firstEl: Post, secondEl: Post) => {
                return (
                  secondEl.timestamp.getTime() - firstEl.timestamp.getTime()
                );
              });
            if (isMounted) {
              setFeeds(sortedFeeds);
            }
          },
          (error) => {
            console.error(error);
          }
        );
      });
    }
  };

  useEffect(() => {
    let isMounted = true;
    unsubscribe(isMounted);
    return () => {
      isMounted = false;
      unsubscribe(isMounted);
      if (process.env.NODE_ENV === "development") {
        console.log("useFeedsのクリーンアップ関数が実行されました。");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return feeds;
};
