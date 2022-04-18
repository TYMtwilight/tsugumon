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
  updatedAt: string;
  updatedTime: number;
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
          const updatedTime =
            snapshot.data().updatedAt.seconds +
            snapshot.data().updatedAt.nanoseconds / 1000000000;
          const updatedDate = snapshot.data().updatedAt.toDate();
          const updatedAt =
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
          const postData: PostData = {
            id: snapshot.id,
            uid: snapshot.data().uid,
            displayName: snapshot.data().displayName,
            avatarURL: snapshot.data().avatarURL,
            imageURL: snapshot.data().imageURL,
            caption: snapshot.data().caption,
            updatedAt: updatedAt,
            updatedTime: updatedTime,
          };
          updatedPosts.push(postData);
        });
        let sortedPosts: PostData[] = updatedPosts.sort(
          (firstEl: PostData, secondEl: PostData) => {
            return secondEl.updatedTime - firstEl.updatedTime;
          }
        );
        setPosts(sortedPosts);
      });
    };
    unsubscribe();
    return () => {
      onSnapshot(postsQuery,()=>{});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return posts;
};
