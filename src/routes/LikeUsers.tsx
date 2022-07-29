import React, { memo } from "react";
import {
  Link,
  Outlet,
  useNavigate,
  NavigateFunction,
  useParams,
  Params,
} from "react-router-dom";
import { useLikeUsers } from "../hooks/useLikeUsers";

interface UserData {
  avatarURL: string;
  caption: string;
  displayName: string;
  uid: string;
  username: string;
  userType: "business" | "normal" | null;
}

const LikeUsers: React.VFC = memo(() => {
  const params: Readonly<Params<string>> = useParams();
  const postId: string = params.docId!;
  const navigate: NavigateFunction = useNavigate();
  const likeUsers: UserData[] = useLikeUsers(postId);

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
      {likeUsers.map((likeUser: UserData) => {
        return (
          <Link to={`/${likeUser.username}`} key={likeUser.uid}>
            <div>
              <img src={likeUser.avatarURL} alt={likeUser.username} />
              <p>{likeUser.displayName}</p>
              <p>{likeUser.caption}</p>
            </div>
          </Link>
        );
      })}
      <Outlet />
    </div>
  );
});

export default LikeUsers;
