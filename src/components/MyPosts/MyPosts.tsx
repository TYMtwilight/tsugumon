import { usePosts } from "../../hooks/usePosts";
import { Favorite } from "@mui/icons-material";
interface Post {
  id: string;
  uid: string;
  displayName: string;
  avatarURL: string;
  imageURL: string;
  caption: string;
  updatedAt: any;
}

const MyPosts = () => {
  const posts: Post[] = usePosts();

  return (
    <div>
      {posts.map((post) => {
        return (
          <div key={post.id}>
            <div>
              <p>{post.displayName}</p>
              <p>{post.updatedAt}</p>
              <img id="avatarURL" src={post.avatarURL} alt="アバター画像" />
            </div>
            <div>
              <img id="image" src={post.imageURL} alt="投稿画像" />
              <div>
                <Favorite />
                <p id="likeCounts">0</p>
              </div>
            </div>
            <div>
              <p id="caption">{post.caption}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyPosts;
