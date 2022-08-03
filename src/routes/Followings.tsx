import React from "react";
import {
  Link,
  Outlet,
  useNavigate,
  NavigateFunction,
  useParams,
  Params,
} from "react-router-dom";
import { useFollowings } from "../hooks/useFollowings";

interface Following {
  avatarURL: string;
  displayName: string;
  introduction: string;
  uid: string;
  userType: "business" | "normal" | null;
  username: string;
}

const Followings: React.VFC = () => {
  const params: Readonly<Params<string>> = useParams();
  const username: string = params.username!;
  const navigate: NavigateFunction = useNavigate();
  const followings = useFollowings(username);

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
      {followings.map((following: Following) => {
        return (
          <Link to={`/${following.username}`} key={following.username}>
            <div>
              <img src={following.avatarURL} alt={following.username} />
              <p>{following.displayName}</p>
              <p>{following.introduction}</p>
            </div>
          </Link>
        );
      })}
      <Outlet />
    </div>
  );
};

export default Followings;
