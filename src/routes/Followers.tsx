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
import ArrowBackRounded from "@mui/icons-material/ArrowBackIosNewRounded";

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
    <div className="min-h-screen h-full bg-slate-100">
      <div className="flex h-12 fixed justify-center items-center top-0 w-screen bg-slate-100 z-10 ">
        <div className="flex relative h-12 justify-center items-center">
          <button
            className="absolute left-2"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              navigate(-1);
            }}
          >
            <ArrowBackRounded fontSize="small" />
          </button>
        </div>
        <p className="flex w-20 mx-auto font-bold">フォロワー</p>
      </div>
      {followers.map((follower: Follower) => {
        return (
          <div className="flex flex-col absolute top-16">
            <Link to={`/${follower.username}`} key={follower.username}>
              <div className="flex flex-row px-4 items-center">
                <img
                  className="block w-12 h-12 rounded-full object-cover"
                  src={follower.avatarURL}
                  alt={follower.username}
                />
                <p className="px-4 leading-4">{follower.displayName}</p>
              </div>
              <p className="p-4">{follower.introduction}</p>
            </Link>
          </div>
        );
      })}
      <Outlet />
    </div>
  );
};

export default Followers;
