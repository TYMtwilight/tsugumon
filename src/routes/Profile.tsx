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
import { AdvertiseData } from "../interfaces/AdvertiseData";
import ArrowBackRounded from "@mui/icons-material/ArrowBackIosNewRounded";
import MailOutlined from "@mui/icons-material/MailOutlined";
import PhotoLibraryOutlined from "@mui/icons-material/PhotoLibraryOutlined";
import PersonAddOutlined from "@mui/icons-material/PersonAddOutlined";
import { useAdvertise } from "../hooks/useAdvertise";

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
  const advertise: AdvertiseData = useAdvertise(username)!;
  const openingHour: string = `0${advertise.openingHour}`;
  const openingMinutes: string = `0${advertise.openingMinutes}`;
  const closingHour: string = `0${advertise.closingHour}`;
  const closingMinutes: string = `0${advertise.closingMinutes}`;
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
    <div className="bg-slate-100 min-h-screen h-full">
      <div>
        <div
          className="fixed top-0 w-screen h-12 z-10"
          style={{
            backgroundColor: `rgba(241,245,249,${scroll / 120} )`,
          }}
        >
          <div className="fixed">
            <button
              className={`absolute h-8 w-8 m-2 ${
                scroll < 120 && "bg-slate-100/75 rounded-full"
              }
            `}
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                event.preventDefault();
                navigate("/home");
              }}
            >
              <ArrowBackRounded fontSize="small" />
            </button>
          </div>
        </div>
        <div className="w-auto h-auto">
          <img
            className="object-cover w-screen h-44"
            id="background"
            src={
              user.backgroundURL !== ""
                ? user.backgroundURL
                : `${process.env.PUBLIC_URL}/noPhoto.png`
            }
            alt="背景画像"
          />
        </div>
        <div className="flex relative w-screen">
          <div className="flex">
            <img
              className="w-20 h-20 ml-4 -mt-8 border-4 border-slate-100 object-cover rounded-full"
              id="avatar"
              src={
                user.avatarURL
                  ? user.avatarURL
                  : `${process.env.PUBLIC_URL}/noAvatar.png`
              }
              alt="アバター画像"
            />
            {loginUser && loginUser.uid !== user.uid && (
              <Link
                to={`/messages/${loginUser.uid}-${user.uid}`}
                state={{ receiverUID: user.uid }}
              >
                <button className="flex justify-center items-center w-8 h-8 mt-2 rounded-full border border-emerald-500 text-emerald-500 hover:border-none hover:text-slate-100 hover:bg-emerald-500">
                  <MailOutlined />
                </button>
              </Link>
            )}
          </div>
          <div className="absolute top-2 right-8">
            {loginUser && loginUser.uid === user.uid ? (
              <Link
                to={
                  loginUser.userType === "business"
                    ? "/setting/business"
                    : "/setting/normal"
                }
              >
                <div className="text-sm flex justify-center">
                  <button className="w-24 p-2 h-8 font-bold rounded-full border  border-emerald-500 text-emerald-500 hover:border-none hover:text-slate-100 hover:bg-emerald-500">
                    編集する
                  </button>
                </div>
              </Link>
            ) : user.userType === "business" ? (
              <button
                className="text-sm w-28 p-2 h-8 font-bold rounded-full border border-emerald-500 text-emerald-500 hover:border-none hover:text-slate-100 hover:bg-emerald-500"
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
            ) : (
              ""
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
          {user.userType === "business" && (
            <div>
              {followersCount > 0 ? (
                <Link className="flex" to={`/${username}/followers`}>
                  <p className="text-sm">フォロワー</p>
                  <p className="w-12 ml-2 text-sm font-bold">
                    {followersCount}
                  </p>
                </Link>
              ) : (
                <div className="flex">
                  <p className="text-sm">フォロワー</p>
                  <p className="w-12 ml-2 text-sm font-bold">
                    {followersCount}
                  </p>
                </div>
              )}
            </div>
          )}
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
            <div id="owner" className="mb-4">
              <p className="text-sm text-slate-500">事業主</p>
              <p className="ml-2">{option.owner}</p>
            </div>
            <div id="typeOfWork" className="mb-4">
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
            <div id="birthdate" className="mb-4">
              <p className="text-sm text-slate-500">生年月日</p>
              <p className="ml-2">
                {option.birthdate
                  ? `${option.birthdate.getFullYear()}年${
                      option.birthdate.getMonth() + 1
                    }月${option.birthdate.getDate()}日`
                  : ""}
              </p>
            </div>
            <div id="skill" className="mb-4">
              <p className="text-sm text-slate-500">資格・技能</p>
              <p className="ml-2">{option.skill1}</p>
              <p className="ml-2">{option.skill2}</p>
              <p className="ml-2">{option.skill3}</p>
            </div>
            <div id="address" className="mb-4">
              <p className="text-sm text-slate-500">住所</p>
              <p className="ml-2">{option.address}</p>
            </div>
          </div>
        )}
      </div>
      {user.userType === "business" && (
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
      )}
      {user.userType === "business" && (
        <div className="mt-8">
          {tab === "album" ? (
            <div>
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
          ) : advertise.wanted ? (
            <div>
              <div className="relative bg-slate-300">
                <img
                  className="w-screen h-44 object-cover  brightness-75"
                  src={
                    advertise.imageURL
                      ? advertise.imageURL
                      : `${process.env.PUBLIC_URL}/noPhoto.png`
                  }
                  alt="イメージ画像"
                />
                <div className="absolute flex items-center inset-y-1/2 left-4 ">
                  <img
                    className="w-12 h-12 mr-2 border-2 border-slate-100 object-cover rounded-full"
                    id="avatar"
                    src={
                      user.avatarURL
                        ? user.avatarURL
                        : `${process.env.PUBLIC_URL}/noAvatar.png`
                    }
                    alt="アバター画像"
                  />
                  <p className="text-xl text-slate-100 font-semibold">
                    {advertise!.displayName}
                  </p>
                </div>
                {loginUser && (
                  <div>
                    {loginUser.uid === user.uid ? (
                      <Link to="/setting/advertise">
                        <button className="flex absolute justify-center items-center w-36 h-8 right-2 bottom-2 rounded-full border border-emerald-500 text-emerald-500 bg-slate-100 hover:border-none hover:text-slate-100 hover:bg-emerald-500 font-bold">
                          募集広告の編集
                        </button>
                      </Link>
                    ) : (
                      <Link
                        to={`/messages/${loginUser.uid}-${user.uid}`}
                        state={{ receiverUID: advertise!.uid }}
                      >
                        <button className="flex absolute justify-center items-center w-8 h-8 right-2 bottom-2 rounded-full border border-emerald-500 text-emerald-500 bg-slate-100 hover:border-none hover:text-slate-100 hover:bg-emerald-500">
                          <MailOutlined />
                        </button>
                      </Link>
                    )}
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <p>{advertise!.message}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-slate-500">勤務内容</p>
                  <p className="ml-2">{advertise!.jobDescription}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-slate-500">勤務地</p>
                  <p className="ml-2">{advertise!.location}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-slate-500">給与</p>
                  <p className="ml-2">
                    <label className="text-sm mr-2">月額</label>
                    {advertise!.minimumWage.toLocaleString()}円 ~{" "}
                    {advertise!.maximumWage.toLocaleString()}円
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-slate-500">勤務時間</p>
                  <p className="ml-2">
                    {openingHour.substring(openingHour.length - 2)}:
                    {openingMinutes.substring(openingMinutes.length - 2)} ~
                    {closingHour.substring(closingHour.length - 2)}:
                    {closingMinutes.substring(closingMinutes.length - 2)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex relative items-center p-4">
              <p className="mr-8 text-red-500">募集は締め切られました</p>
              {loginUser.uid === user.uid && (
                <Link to="/setting/advertise">
                  <button className="flex absolute justify-center items-center w-36 h-8 right-2 bottom-2 rounded-full border border-emerald-500 text-emerald-500 bg-slate-100 hover:border-none hover:text-slate-100 hover:bg-emerald-500 font-bold">
                    募集広告の編集
                  </button>
                </Link>
              )}
            </div>
          )}
        </div>
      )}
      <Outlet />
    </div>
  );
});
export default Profile;
