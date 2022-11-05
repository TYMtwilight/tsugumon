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
    <div className="md:flex md:justify-center w-screen bg-slate-100">
      <div className="flex fixed w-screen md:w-1/2 lg:w-1/3 h-12 top-0 items-center bg-white z-50">
        <button
          className="absolute left-2"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            navigate(-1);
          }}
        >
          <ArrowBackRounded fontSize="small" />
        </button>
        <p className="flex w-20 mx-auto font-bold">フォロー中</p>
      </div>
      <div className="flex flex-col w-screen md:w-1/2 lg:w-1/3 min-h-screen h-full pt-16 bg-white">
        {followings.map((following: Following) => {
          return (
            <div className="flex relative mb-4" key={following.username}>
              <Link to={`/${following.username}`}>
                <div className="flex flex-row px-4 items-center">
                  <img
                    className="block w-12 h-12 rounded-full object-cover"
                    src={following.avatarURL}
                    alt={following.username}
                  />
                  <p className="px-4 leading-4">{following.displayName}</p>
                </div>
                <p className="h-full max-h-36 p-4 overflow-hidden text-sm" id="caption">
                  {following.introduction}
                </p>
              </Link>
            </div>
          );
        })}
      </div>
      <Outlet />
    </div>
  );
};

export default Followings;
