import { usePosts } from "../../hooks/usePosts";
import { Favorite } from "@mui/icons-material";
interface PostData {
  id: string;
  uid: string;
  displayName: string;
  avatarURL: string;
  imageURL: string;
  caption: string;
  updatedAt: any;
}

const PastPost = () => {
  const posts: PostData[] = usePosts();

  return (
    <div>
      {posts.map((post) => {
        return (
          <div key={post.id}>
            <div>
              <p>{post.displayName}</p>
              <p>{post.updatedAt.nanoseconds}</p>
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

export default PastPost;
