import { useState, useEffect } from "react";
import { useAppSelector } from "../app/hooks";
import { selectUser, User } from "../features/userSlice";
import {
  orderBy,
  collection,
  onSnapshot,
  query,
  QuerySnapshot,
  DocumentData,
  QueryDocumentSnapshot,
  CollectionReference,
  Query,
} from "firebase/firestore";
import { db } from "../firebase";

interface PostData {
  id: string;
  uid: string;
  displayName: string;
  avatarURL: string;
  imageURL: string;
  caption: string;
  createdAt: number;
  updatedAt: number;
}

export const usePosts = () => {
  const user: User = useAppSelector(selectUser);
  const [posts, setPosts] = useState<PostData[]>([]);

  const postsRef: CollectionReference<DocumentData> = collection(
    db,
    `users/${user.uid}/enterprise/${user.uid}/posts`
  );

  const postsQuery: Query<DocumentData> = query(
    postsRef,
    orderBy("timestamp", "desc")
  );

  useEffect(() => {
    const unsubscribe: () => void = () => {
      onSnapshot(postsQuery, (snapshots: QuerySnapshot<DocumentData>) => {
        let updatedPosts: PostData[] = [];
        snapshots.forEach((snapshot: QueryDocumentSnapshot<DocumentData>) => {
          const postData: PostData = {
            id: snapshot.id,
            uid: snapshot.data().uid,
            displayName: snapshot.data().username,
            avatarURL: snapshot.data().avatarURL,
            imageURL: snapshot.data().imageURL,
            caption: snapshot.data().caption,
            createdAt: snapshot.data().createdAt,
            updatedAt: snapshot.data().updatedAt,
          };
          updatedPosts.push(postData);
        });
        let sortedPosts: PostData[] = [...updatedPosts].sort(
          (firstEl: PostData, secondEl: PostData) => {
            return secondEl.createdAt - firstEl.createdAt;
          }
        );
        setPosts(sortedPosts);
      });
    };
    return () => {
      unsubscribe();
    };
  });
  return posts;
};

export default usePosts;
