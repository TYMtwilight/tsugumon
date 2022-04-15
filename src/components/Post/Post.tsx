import React, { useState } from "react";
import { Favorite } from "@mui/icons-material";

interface Props {
  postData: {
    uid: string;
    displayName: string;
    avatarURL: string;
    imageURL: string;
    caption: string;
    createdAt: number;
    updatedAt: number;
  };
}

const Post: (props: Props) => JSX.Element = (props) => {
  const [detail, setDetail] = useState<boolean>(false);

  if (!detail) {
    return (
      <div
        id="overview"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          e.preventDefault();
          setDetail(true);
        }}
      >
        <div>
          <img alt="投稿画像" />
          <div>
            <Favorite />
            <p id="likeCounts">0</p>
          </div>
        </div>
        <div>
          <img
            id="avatarURL"
            src={props.postData.avatarURL}
            alt="アバター画像"
          />
          <p id="displayName">{props.postData.displayName}</p>
        </div>
        <div>
          <p id="caption">{props.postData.caption}</p>
        </div>
      </div>
    );
  } else {
    return <div id="detail">投稿の詳細</div>;
  }
};

export default Post;
