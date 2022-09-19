import React, { memo, useState, useEffect } from "react";
import {
  Link,
  Outlet,
  Params,
  useParams,
  useNavigate,
  NavigateFunction,
} from "react-router-dom";
import { useProfile } from "../hooks/useProfile";
import { usePosts } from "../hooks/usePosts";
import PostComponent from "../components/PostComponent";
import { addFollower } from "../functions/AddFollower";
import ArrowBackRounded from "@mui/icons-material/ArrowBackIosNewRounded";
import MailOutlined from "@mui/icons-material/MailOutlined";
import PhotoLibraryOutlined from "@mui/icons-material/PhotoLibraryOutlined";
import PersonAddOutlined from "@mui/icons-material/PersonAddOutlined";

interface Post {
  avatarURL: string;
  caption: string;
  displayName: string;
  id: string;
  imageURL: string;
  tags: string[];
  timestamp: Date;
  uid: string;
  username: string;
}

interface FollowUser {
  avatarURL: string;
  displayName: string;
  introduction: string;
  uid: string;
  username: string;
  userType: "business" | "normal" | null;
}

const Profile: React.VFC = memo(() => {
  const params: Readonly<Params<string>> = useParams();
  const username: string = params.username!;
  const navigate: NavigateFunction = useNavigate();
  const {
    user,
    option,
    followingsCount,
    followersCount,
    isFollowing,
    loginUser,
  } = useProfile(username)!;
  const posts: Post[] = usePosts(username);
  const [scroll, setScroll] = useState<number>(0);
  const [tab, setTab] = useState<"album" | "wanted">("album");
  let isMounted: boolean = true;

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (isMounted === false) {
        return;
      }
      setScroll(window.scrollY);
    });
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isMounted = false;
      window.removeEventListener("scroll", () => {
        if (process.env.NODE_ENV === "development") {
          console.log("イベントリスナーをリセットしました。");
        }
      });
    };
  });

  return (
    <div>
      <div>
        <div
          className="flex fixed top-0 w-screen h-12"
          style={{
            backgroundColor: `rgba(241,245,249,${scroll / 144} )`,
          }}
        >
          <button
            className={`p-2 ${
              scroll > 144 ? "text-slate-500" : "text-slate-100"
            }`}
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              navigate("/home");
            }}
          >
            <ArrowBackRounded />
          </button>
        </div>
        <div className="w-auto h-auto">
          <img
            className="object-cover w-screen h-48"
            id="background"
            src={user.backgroundURL}
            alt="背景画像"
          />
        </div>
        <div className="flex justify-between">
          <img
            className="w-20 h-20 ml-4 -mt-8 border-4 border-slate-100 rounded-full"
            id="avatar"
            src={
              user.avatarURL
                ? user.avatarURL
                : `${process.env.PUBLIC_URL}/noAvatar.png`
            }
            alt="アバター画像"
          />
          <div className="flex justify-between w-40 p-2 mr-4">
            <button className="flex justify-center items-center w-8 h-8 rounded-full border border-emerald-500 text-emerald-500 hover:border-none hover:text-slate-100 hover:bg-emerald-500">
              <MailOutlined />
            </button>
            {loginUser.uid === user.uid ? (
              <Link
                to={
                  loginUser.userType === "business"
                    ? "/setting/business"
                    : "/setting/normal"
                }
              >
                <div className="flex justify-center">
                  <button className="w-24 h-8 font-bold rounded-full border border-emerald-500 text-emerald-500 hover:border-none hover:text-slate-100 hover:bg-emerald-500 ">
                    編集する
                  </button>
                </div>
              </Link>
            ) : (
              <button
                className="border text-sm"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                  event.preventDefault();
                  const following: FollowUser = {
                    avatarURL: user.avatarURL,
                    displayName: user.displayName,
                    introduction: user.introduction,
                    uid: user.uid,
                    username: user.username,
                    userType: user.userType,
                  };
                  const follower: FollowUser = {
                    avatarURL: loginUser.avatarURL,
                    displayName: loginUser.displayName,
                    introduction: loginUser.introduction,
                    uid: loginUser.uid,
                    username: loginUser.username,
                    userType: loginUser.userType,
                  };
                  addFollower(following, follower);
                }}
              >
                {isFollowing ? "フォロー中" : "フォローする"}
              </button>
            )}
          </div>
        </div>
        <div className="pl-4 pr-2 py-2">
          <p className="width-screen text-xl font-semibold ">
            {user.displayName}
          </p>
          <p className="width-screen text-sm text-slate-500">{user.username}</p>
        </div>
        <div className="flex px-4">
          <div>
            {followersCount > 0 ? (
              <Link className="flex" to={`/${username}/followers`}>
                <p className="text-sm">フォロワー</p>
                <p className="w-12 ml-2 text-sm font-bold">{followersCount}</p>
              </Link>
            ) : (
              <div className="flex">
                <p className="text-sm">フォロワー</p>
                <p className="w-12 ml-2 text-sm font-bold">{followersCount}</p>
              </div>
            )}
          </div>
          <div className="flex">
            {followingsCount > 0 ? (
              <Link className="flex" to={`/${username}/followings`}>
                <p className="text-sm">フォロー中</p>
                <p className="w-12 ml-2 text-sm font-bold">{followingsCount}</p>
              </Link>
            ) : (
              <div className="flex">
                <p className="text-sm">フォロー中</p>
                <p className="w-12 ml-2 text-sm font-bold">{followingsCount}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="p-4" id="profile">
        <p className="mb-4">{user.introduction}</p>
        {user.userType === "business" ? (
          <div id="business">
            <div id="owner">
              <p className="text-sm text-slate-500">事業主</p>
              <p className="ml-2">{option.owner}</p>
            </div>
            <div id="typeOfWork">
              <p className="text-sm text-slate-500">職種</p>
              <p className="ml-2">{option.typeOfWork}</p>
            </div>
            <div id="address">
              <p className="text-sm text-slate-500">住所</p>
              <p className="ml-2">{option.address}</p>
            </div>
          </div>
        ) : (
          <div id="normal">
            <div id="birthdate">
              <p>生年月日</p>
              <p>{option.birthdate}</p>
            </div>
            <div id="skill">
              <p>{option.skill}</p>
            </div>
          </div>
        )}
      </div>
      <nav className="flex w-screen h-12">
        <button
          className={`flex items-center justify-center w-1/2 ${
            tab === "album"
              ? "border-b-4 box-border border-emerald-500 text-emerald-500 "
              : "border-b-4 box-border border-slate-100 text-slate-500"
          }`}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            setTab("album");
          }}
        >
          <PhotoLibraryOutlined />
          <p className="h-4 ml-2 text-sm font-bold">過去の投稿</p>
        </button>
        <button
          className={`flex items-center justify-center w-1/2 ${
            tab === "wanted"
              ? "border-b-4 box-border border-emerald-500 text-emerald-500"
              : "border-b-4 box-border border-slate-100 text-slate-500"
          }`}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            setTab("wanted");
          }}
        >
          <PersonAddOutlined />
          <p className="h-4 ml-2 text-sm font-bold">募集中</p>
        </button>
      </nav>
      {tab === "album" ? (
        <div className="mt-4">
          {posts.map((post: Post) => {
            return (
              <PostComponent
                key={post.id}
                avatarURL={post.avatarURL}
                caption={post.caption}
                displayName={post.displayName}
                id={post.id}
                imageURL={post.imageURL}
                timestamp={post.timestamp}
                tags={post.tags}
                uid={post.uid}
                username={post.username}
                detail={false}
              />
            );
          })}
        </div>
      ) : (
        <p>募集中！</p>
      )}
      <Outlet />
    </div>
  );
});
export default Profile;
