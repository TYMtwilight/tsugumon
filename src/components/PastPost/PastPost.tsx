import React from "react";
import { Favorite } from "@mui/icons-material";

const PastPost: () => JSX.Element = () => {
  return (
    <div>
      <div>
        <img alt="投稿画像" />
        <div>
          <Favorite />
          <p id="likeCounts">0</p>
        </div>
      </div>
      <div>
        <img alt="アバター画像" />
        <p id="displayName">株式会社○○</p>
      </div>
      <div>
        <p id="caption">キャプション</p>
      </div>
    </div>
  );
};

export default PastPost;
