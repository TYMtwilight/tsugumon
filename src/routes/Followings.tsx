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
import ArrowBackRounded from "@mui/icons-material/ArrowBackIosNewRounded";

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
        <p className="flex w-20 mx-auto font-bold">フォロー中</p>
      </div>
      {followings.map((following: Following) => {
        return (
          <div className="flex flex-col absolute top-16">
            <Link to={`/${following.username}`} key={following.username}>
              <div className="flex flex-row px-4 items-center">
                <img
                  className="block w-12 h-12 rounded-full object-cover"
                  src={following.avatarURL}
                  alt={following.username}
                />
                <p className="px-4 leading-4">{following.displayName}</p>
              </div>
              <p className="p-4">{following.introduction}</p>
            </Link>
          </div>
        );
      })}
      <Outlet />
    </div>
  );
};

export default Followings;
