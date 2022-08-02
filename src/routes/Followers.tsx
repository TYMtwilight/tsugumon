import React from "react";
import {
  Link,
  Outlet,
  useNavigate,
  NavigateFunction,
  useParams,
  Params,
} from "react-router-dom";
import { useFollowers } from "../hooks/useFollowers";

interface Follower {
  avatarURL: string;
  displayName: string;
  introduction: string;
  uid: string;
  userType: "business" | "normal" | null;
  username: string;
}

const Followers: React.VFC = () => {
  const params: Readonly<Params<string>> = useParams();
  const username: string = params.username!;
  const navigate: NavigateFunction = useNavigate();
  const followers: Follower[] = useFollowers(username);

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
      {followers.map((follower: Follower) => {
        return (
          <Link to={`/${follower.username}`} key={follower.username}>
            <div>
              <img src={follower.avatarURL} alt={follower.username} />
              <p>{follower.displayName}</p>
              <p>{follower.introduction}</p>
            </div>
          </Link>
        );
      })}
      <Outlet />
    </div>
  );
};

export default Followers;
