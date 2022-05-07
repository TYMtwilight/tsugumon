import { useEffect } from "react";
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
  CollectionReference,
  where,
  Unsubscribe,
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
  let updatedFeeds: PostData[] = [];

  const unsubscribe = async () => {
    const followeesQuery = query(collection(db, `users/${user.uid}/followees`));
    const followeesSnapshot = await getDocs(followeesQuery);
    const followees = followeesSnapshot.docs.map((snapshot) => {
      return snapshot.id;
    });
    console.log(followees);
    if (followees.length > 0) {
      followees.forEach((followeeUID) => {
        const followeeRef: CollectionReference<DocumentData> = collection(
          db,
          `users/${followeeUID}/businessUser/${followeeUID}/posts`
        );
        const feedsQuery = query(
          followeeRef,
          where("uid", "==", `${followeeUID}`)
        );
        const getFeeds: Unsubscribe = onSnapshot(
          feedsQuery,
          (snapshots: QuerySnapshot<DocumentData>) => {
            const followeeFeeds = snapshots.docs
              .map((snapshot: QueryDocumentSnapshot<DocumentData>) => {
                const updatedTime: number = snapshot.data().updatedAt.seconds;
                const updatedDate: Date = snapshot.data().updatedAt.toDate();
                const updatedAt: string =
                  updatedDate.getFullYear() +
                  "年" +
                  ("0" + updatedDate.getMonth()).slice(-2) +
                  "月" +
                  ("0" + updatedDate.getDate()).slice(-2) +
                  "日" +
                  " " +
                  ("0" + updatedDate.getHours()).slice(-2) +
                  ":" +
                  ("0" + updatedDate.getMinutes()).slice(-2);
                if (process.env.NODE_ENV === "development") {
                  console.log(`updatadAt:${updatedAt}`);
                }
                const feedData: PostData = {
                  id: snapshot.id,
                  uid: snapshot.data().uid,
                  displayName: snapshot.data().displayName,
                  avatarURL: snapshot.data().avatarURL,
                  imageURL: snapshot.data().imageURL,
                  caption: snapshot.data().caption,
                  updatedAt: updatedAt,
                  updatedTime: updatedTime,
                };
                return feedData;
              })
              .concat(updatedFeeds)
              .sort((firstEl: PostData, secondEl: PostData) => {
                console.log(updatedFeeds);
                return secondEl.updatedTime - firstEl.updatedTime;
              });

            return followeeFeeds;
          }
        );
        getFeeds();
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

  return updatedFeeds;
};
