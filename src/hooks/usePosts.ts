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
  where,
  Query,
} from "firebase/firestore";

interface PostData {
  id: string;
  uid: string;
  displayName: string;
  avatarURL: string;
  imageURL: string;
  caption: string;
  updatedAt: any;
}

export const usePosts = () => {
  const user: User = useAppSelector(selectUser);
  const [posts, setPosts] = useState<PostData[]>([]);

  const postsQuery: Query<DocumentData> = query(
    collection(db, `users/${user.uid}/businessUser/${user.uid}/posts`),
    where("uid", "==", user.uid)
  );

  useEffect(() => {
    const unsubscribe: () => void = () => {
      onSnapshot(postsQuery, (snapshots: QuerySnapshot<DocumentData>) => {
        let updatedPosts: PostData[] = [];
        snapshots.forEach((snapshot: QueryDocumentSnapshot<DocumentData>) => {
          // const timestamp: Timestamp = snapshot.data().createdAt;
          // const updatedDate = timestamp.toDate();
          // const updatedTime: number = updatedDate.getTime();
          // const updatedAt =
          //   updatedDate.getFullYear() +
          //   "年" +
          //   ("0" + updatedDate.getMonth()).slice(-2) +
          //   "月" +
          //   ("0" + updatedDate.getDate()).slice(-2) +
          //   "日" +
          //   " " +
          //   ("0" + updatedDate.getHours()).slice(-2) +
          //   ":" +
          //   ("0" + updatedDate.getMinutes()).slice(-2);
          const postData: PostData = {
            id: snapshot.id,
            uid: snapshot.data().uid,
            displayName: snapshot.data().displayName,
            avatarURL: snapshot.data().avatarURL,
            imageURL: snapshot.data().imageURL,
            caption: snapshot.data().caption,
            updatedAt: snapshot.data().updatedAt,
          };
          updatedPosts.push(postData);
        });
        if (process.env.NODE_ENV === "development") {
          console.log(updatedPosts);
        }
        let sortedPosts: PostData[] = updatedPosts.sort(
          (firstEl: PostData, secondEl: PostData) => {
            return secondEl.updatedAt - firstEl.updatedAt;
          }
        );
        if (process.env.NODE_ENV === "development") {
          console.log(sortedPosts);
        }
        setPosts(sortedPosts);
      });
    };
    unsubscribe();
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return posts;
};
