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
  Query,
} from "firebase/firestore";

interface PostData {
  id: string;
  uid: string;
  username: string;
  displayName: string;
  avatarURL: string;
  imageURL: string;
  caption: string;
  updatedAt: string;
  updatedTime: number;
}

export const usePosts: () => PostData[] = () => {
  if (process.env.NODE_ENV === "development") {
    console.log("usePosts.tsがレンダリングされました");
  }
  const user: User = useAppSelector(selectUser);
  const [posts, setPosts] = useState<PostData[]>([]);
  let updatedPosts: PostData[] = [];
  let sortedPosts: PostData[] = [];

  const unsubscribe: (isMounted: boolean) => void = (isMounted) => {
    const postsQuery: Query<DocumentData> = query(
      collection(db, `users/${user.uid}/businessUser/${user.uid}/posts`)
    );
    onSnapshot(
      postsQuery,
      (snapshots: QuerySnapshot<DocumentData>) => {
        if (process.env.NODE_ENV === "development") {
          console.log("onSnapshotが実行されました");
        }
        const userPosts: PostData[] = snapshots.docs.map(
          (snapshot: QueryDocumentSnapshot<DocumentData>) => {
            const updatedTime: number = snapshot.data().updatedAt.seconds;
            const updatedDate: Date = snapshot.data().updatedAt.toDate();
            const postData: PostData = {
              id: snapshot.id,
              uid: snapshot.data().uid,
              username: snapshot.data().username,
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
            updatedPosts.filter((updatedPost) => {
              return updatedPost.id !== postData.id;
            });
            return postData;
          }
        );
        sortedPosts = updatedPosts
          .concat(userPosts)
          .sort((firstEl: PostData, secondEl: PostData) => {
            return secondEl.updatedTime - firstEl.updatedTime;
          });
        isMounted && setPosts(sortedPosts);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  useEffect(() => {
    let isMounted = true;
    unsubscribe(isMounted);
    return () => {
      isMounted = false;
      unsubscribe(isMounted);
      if (process.env.NODE_ENV === "development") {
        console.log("usePostsのクリーンアップ関数が実行されました");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return posts;
};
