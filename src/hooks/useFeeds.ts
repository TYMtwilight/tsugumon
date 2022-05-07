import { useState, useEffect } from "react";
import { useAppSelector } from "../app/hooks";
import { selectUser, User } from "../features/userSlice";
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

interface PostData {
  id: string;
  uid: string;
  displayName: string;
  avatarURL: string;
  imageURL: string;
  caption: string;
  updatedAt: string;
  updatedTime: number;
}

export const useFeeds = () => {
  const user: User = useAppSelector(selectUser);
  const [feeds, setFeeds] = useState<PostData[]>([]);
  let updatedFeeds: PostData[] = [];
  let sortedFeeds: PostData[] = [];
  const unsubscribe = async () => {
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
        if (process.env.NODE_ENV === "development") {
          console.log(followeeUID);
        }
        const feedsQuery: Query<DocumentData> = query(
          collection(
            db,
            `users/${followeeUID}/businessUser/${followeeUID}/posts`
          )
        );
        onSnapshot(
          feedsQuery,
          (snapshots: QuerySnapshot<DocumentData>) => {
            const followeeFeeds: PostData[] = snapshots.docs.map(
              (snapshot: QueryDocumentSnapshot<DocumentData>) => {
                const updatedTime: number = snapshot.data().updatedAt.seconds;
                const updatedDate: Date = snapshot.data().updatedAt.toDate();
                const feedData: PostData = {
                  id: snapshot.id,
                  uid: snapshot.data().uid,
                  displayName: snapshot.data().displayName,
                  avatarURL: snapshot.data().avatarURL,
                  imageURL: snapshot.data().imageURL,
                  caption: snapshot.data().caption,
                  updatedAt:
                    updatedDate.getFullYear() +
                    "年" +
                    ("0" + updatedDate.getMonth()).slice(-2) +
                    "月" +
                    ("0" + updatedDate.getDate()).slice(-2) +
                    "日" +
                    " " +
                    ("0" + updatedDate.getHours()).slice(-2) +
                    ":" +
                    ("0" + updatedDate.getMinutes()).slice(-2),
                  updatedTime: updatedTime,
                };
                updatedFeeds.filter((updateFeed) => {
                  return updateFeed.id !== feedData.id;
                });
                return feedData;
              }
            );
            sortedFeeds = updatedFeeds
              .concat(followeeFeeds)
              .sort((firstEl: PostData, secondEl: PostData) => {
                return secondEl.updatedTime - firstEl.updatedTime;
              });
            console.log(sortedFeeds);
            setFeeds(sortedFeeds);
          },
          (error) => {
            console.error(error);
          }
        );
      });
    }
  };

  useEffect(() => {
    unsubscribe();
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(feeds);
  return feeds;
};
