import React, { memo } from "react";
import {
  Params,
  useParams,
  useNavigate,
  NavigateFunction,
} from "react-router-dom";
import PostComponent from "../components/PostComponent";

const Post: React.VFC = memo(() => {
  const params: Readonly<Params<string>> = useParams();
  const postId: string = params.docId!;
  const navigate: NavigateFunction = useNavigate();

  return (
    <div>
      <button
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          event.preventDefault();
          navigate(-1);
        }}
      >
        戻る
      </button>
      <PostComponent postId={postId} detail={true} />
    </div>
  );
});

export default Post;
