import { Favorite } from "@mui/icons-material";
interface Props {
  key: string;
  uid: string;
  displayName: string;
  avatarURL: string;
  imageURL: string;
  caption: string;
  updatedAt: any;
}

const Post= (props:Props) => {
  return (
    <div>
      <div>
        <p id="displayName">{props.displayName}</p>
        <p id="updatedAt">{props.updatedAt}</p>
        <img id="avatarURL" src={props.avatarURL} alt="アバター画像" />
      </div>
      <div>
        <img id="image" src={props.imageURL} alt="投稿画像" />
        <div>
          <Favorite />
          <p id="likeCounts">0</p>
        </div>
      </div>
      <div>
        <p id="caption">{props.caption}</p>
      </div>
    </div>
  );
};

export default Post;
