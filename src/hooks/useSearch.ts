import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  where,
} from "firebase/firestore";

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
  let isMounted: boolean = searchTag !== null;

  const getUserPosts: (uid: string) => Promise<Post[]> = async (uid) => {
    const postsSnap: QuerySnapshot<DocumentData> = await getDocs(
      query(
        collection(db, "posts"),
        where("uid", "==", uid),
        orderBy("timestamp", "desc"),
        limit(20)
      )
    );
    const userPosts: Post[] = postsSnap.docs.map(
      (post: QueryDocumentSnapshot<DocumentData>) => {
        return {
          avatarURL: post.data().avatarURL,
          caption: post.data().caption,
          displayName: post.data().displayName,
          id: post.id,
          imageURL: post.data().imageURL,
          timestamp: post.data().timestamp.toDate(),
          uid: post.data().uid,
          username: post.data().username,
        };
      }
    );
    return userPosts;
  };

  const getPosts: () => Promise<void> = async () => {
    setPosts([]);
    // NOTE >> 検索タグに合致するユーザーUIDを取得し、配列に格納します。
    const usersSnap: QuerySnapshot<DocumentData> = await getDocs(
      query(
        collection(db, "users"),
        where("cropsTags", "array-contains", searchTag)
      )
    );
    if (usersSnap.size > 0) {
      const uidArray: string[] = usersSnap.docs!.map(
        (userSnap: QueryDocumentSnapshot<DocumentData>) => {
          return userSnap.id;
        }
      );
      // NOTE >> ユーザーUIDをキーとして、投稿のドキュメントIDを取得し、配列に格納します。
      uidArray.map(async (uid: string) => {
        const userPosts: Post[] = await getUserPosts(uid);
        setPosts((prev: Post[]) => {
          return prev.concat(userPosts).sort((first: Post, second: Post) => {
            return first.timestamp.getTime() - second.timestamp.getTime();
          });
        });
      });
    }
  };

  useEffect(() => {
    if (isMounted === false) {
      return;
    }
    getPosts();
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isMounted = false;
    };
  }, [searchTag]);

  return posts;
};
