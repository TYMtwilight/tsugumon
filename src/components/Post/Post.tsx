import { memo } from "react";
import { Link } from "react-router-dom";
import { Favorite } from "@mui/icons-material";
interface Props {
  key: string;
  uid: string;
  username: string;
  displayName: string;
  avatarURL: string;
  imageURL: string;
  caption: string;
  updatedAt: any;
}

const Post = memo((props: Props) => {
  const { username, displayName, avatarURL, imageURL, caption, updatedAt } =
    props;
  const path = `/${username}`;
  if (process.env.NODE_ENV === "development") {
    console.log("Post.tsxがレンダリングされました");
  }
  return (
    <div>
      <div>
        <p id="displayName">{displayName}</p>
        <p id="updatedAt">{updatedAt}</p>
        <Link to={path}>
          <img id="avatarURL" src={avatarURL} alt="アバター画像" />
        </Link>
      </div>
      <div>
        <img id="image" src={imageURL} alt="投稿画像" />
        <div>
          <Favorite />
          <p id="likeCounts">0</p>
        </div>
      </div>
      <div>
        <p id="caption">{caption}</p>
      </div>
    </div>
  );
});

export default Post;
