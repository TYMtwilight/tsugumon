import { memo } from "react";
import Post from "../Post/Post";
import { usePosts } from "../../hooks/usePosts";

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

  const posts: PostData[] = usePosts();

  return (
    <>
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
