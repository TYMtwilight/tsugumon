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
import ArrowBackRounded from "@mui/icons-material/ArrowBackIosNewRounded";
import { LikeUser } from "../interfaces/LikeUser";

const LikeUsers: React.VFC = memo(() => {
  const params: Readonly<Params<string>> = useParams();
  const postId: string = params.docId!;
  const navigate: NavigateFunction = useNavigate();
  const likeUsers: LikeUser[] = useLikeUsers(postId);

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
        <p className="w-36 mx-auto font-bold">いいねしたユーザー</p>
      </div>
      <div className="flex flex-col w-screen md:w-1/2 lg:w-1/3 min-h-screen h-full pt-16 bg-white">
        {likeUsers.map((likeUser: LikeUser) => {
          return (
            <div className="flex relative flex-col mb-4" key={likeUser.uid}>
              <Link to={`/${likeUser.username}`}>
                <div className="flex flex-col mb-4">
                  <div className="flex flex-row px-4 items-center">
                    <img
                      className="block w-12 h-12 rounded-full object-cover"
                      src={likeUser.avatarURL}
                      alt={likeUser.username}
                    />
                    <p className="px-4 leading-4">{likeUser.displayName}</p>
                  </div>
                  <p
                    className="h-full max-h-36 p-4 overflow-hidden text-sm"
                    id="caption"
                  >
                    {likeUser.introduction}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
      <Outlet />
    </div>
  );
});

export default LikeUsers;
