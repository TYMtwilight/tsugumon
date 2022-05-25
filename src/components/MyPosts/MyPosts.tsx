import { useState, useEffect, memo } from "react";
import Post from "../Post/Post";
import { usePosts } from "../../hooks/usePosts";
import { useDemo } from "../../hooks/useDemo";

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

const MyPosts = memo(() => {
  if (process.env.NODE_ENV === "development") {
    console.log("MyPostsがレンダリングされました");
  }
  const [uploadDemo, setUploadDemo] = useState<boolean>(false);
  const progress: "wait" | "run" | "done" = useDemo(uploadDemo);
  const posts: PostData[] = usePosts();
  useEffect(() => {
    switch (progress) {
      case "wait":
        if (process.env.NODE_ENV === "development") {
          console.log(`${progress}: アップロードの待機中`);
          setUploadDemo(false);
        }
        break;
      case "run":
        if (process.env.NODE_ENV === "development") {
          console.log(`${progress}: アップロードの実行中`);
        }
        break;
      case "done":
        if (process.env.NODE_ENV === "development") {
          console.log(`${progress}: アップロード完了`);
        }
        setUploadDemo(false);
    }
  }, [progress]);

  return (
    <>
      <button
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          setUploadDemo(true);
        }}
      >
        デモデータの登録
      </button>
      {posts.map((post) => {
        return (
          <Post
            key={post.id}
            uid={post.uid}
            username={post.username}
            displayName={post.displayName}
            avatarURL={post.avatarURL}
            imageURL={post.imageURL}
            caption={post.caption}
            updatedAt={post.updatedAt}
          />
        );
      })}
    </>
  );
});

export default MyPosts;
