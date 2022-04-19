import Post from "../Post/Post";
import { usePosts } from "../../hooks/usePosts";

interface PostData {
  id: string;
  uid: string;
  displayName: string;
  avatarURL: string;
  imageURL: string;
  caption: string;
  updatedAt: any;
}

const MyPosts = () => {
  const posts: PostData[] = usePosts();

  return (
    <>
      {posts.map((post) => {
        return (
          <Post
            key={post.id}
            uid={post.uid}
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
};

export default MyPosts;
