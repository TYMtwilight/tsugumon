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
import { useAdvertise } from "../hooks/useAdvertise";
import PostComponent from "../components/PostComponent";
import TabBar from "../components/TabBar";
import { addFollower } from "../functions/AddFollower";
import { AdvertiseData } from "../interfaces/AdvertiseData";
import {
  ArrowBackIosNewRounded,
  MailOutlined,
  PhotoLibraryOutlined,
  PersonAddOutlined,
  PersonOutline,
} from "@mui/icons-material";

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
  const navigate: NavigateFunction = useNavigate();
  const username: string = params.username!;
  const [scroll, setScroll] = useState<number>(0);
  const [tab, setTab] = useState<"album" | "wanted">("album");
  const {
    user,
    option,
    followingsCount,
    followersCount,
    isFollowing,
    loginUser,
  } = useProfile(username)!;
  const advertise: AdvertiseData = useAdvertise(username)!;
  const posts: Post[] = usePosts(username)!;
  const openingHour: string = `0${advertise.openingHour}`;
  const openingMinutes: string = `0${advertise.openingMinutes}`;
  const closingHour: string = `0${advertise.closingHour}`;
  const closingMinutes: string = `0${advertise.closingMinutes}`;
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
    <div className="w-screen bg-slate-100">
      <TabBar invisibleAtSmall={true} />
      <div className="flex justify-center">
        <div
          className="fixed w-screen md:w-1/2 lg:w-1/3 h-12 top-0 items-center bg-white z-50"
          style={{
            backgroundColor: `rgba(255,255,255,${scroll / 120} )`,
          }}
        >
          <button
            className={`absolute h-8 w-8 m-2 ${
              scroll < 120 && "bg-white/75 rounded-full"
            }
            `}
            onClick={() => {
              navigate("/home");
            }}
          >
            <ArrowBackIosNewRounded fontSize="small" />
          </button>
        </div>
        <div className="flex flex-col w-screen md:w-1/2 lg:w-1/3 min-h-screen h-full bg-white">
          <div className="h-44">
            <img
              className="object-cover w-full h-full"
              id="background"
              src={
                user.backgroundURL !== ""
                  ? user.backgroundURL
                  : `${process.env.PUBLIC_URL}/noPhoto.png`
              }
              alt="背景画像"
            />
          </div>
          <div className="relative">
            {user.avatarURL ? (
              <img
                className="-mt-8 ml-4 w-20 h-20 border-4 border-white rounded-full object-cover"
                src={user.avatarURL}
                alt="アバター画像"
              />
            ) : (
              <div className="flex w-20 h-20 justify-center items-center -mt-8 ml-4 border-4 border-white bg-slate-500 text-white rounded-full">
                {" "}
                <PersonOutline fontSize="large" />
              </div>
            )}

            {loginUser && loginUser.uid !== user.uid && (
              <Link
                to={`/messages/${loginUser.uid}-${user.uid}`}
                state={{ receiverUID: user.uid }}
              >
                <button className="flex absolute justify-center items-center w-8 h-8 top-2 left-20 rounded-full border border-emerald-500 text-emerald-500 bg-white hover:border-none hover:text-white hover:bg-emerald-500">
                  <MailOutlined />
                </button>
              </Link>
            )}
            {loginUser && loginUser.uid === user.uid ? (
              <Link
                to={
                  loginUser.userType === "business"
                    ? "/setting/business"
                    : "/setting/normal"
                }
              >
                <button className="flex absolute justify-center items-center w-24 h-8 font-bold rounded-full right-4 top-2 border border-emerald-500 text-emerald-500 hover:border-none hover:text-white hover:bg-emerald-500">
                  編集する
                </button>
              </Link>
            ) : user.userType === "business" ? (
              <button
                className="flex absolute justify-center items-center w-28 h-8 top-2 right-2 font-bold rounded-full border border-emerald-500 text-emerald-500 bg-white hover:border-none hover:text-white hover:bg-emerald-500 text-sm"
                onClick={() => {
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
          <div className="pl-4 pr-2 py-2">
            <p className="text-xl font-semibold ">{user.displayName}</p>
            <p className="text-sm text-slate-500">{user.username}</p>
          </div>
          <div className="flex pl-4">
            {user.userType === "business" && (
              <>
                <label htmlFor="followers" className="text-sm">
                  フォロワー
                </label>
                {followersCount > 0 ? (
                  <Link className="flex" to={`/${username}/followers`}>
                    <p id="followers" className="w-12 ml-2 text-sm font-bold">
                      {followersCount}
                    </p>
                  </Link>
                ) : (
                  <p className="w-12 ml-2 text-sm font-bold">
                    {followersCount}
                  </p>
                )}
                <label htmlFor="followings" className="pl-2 text-sm">
                  フォロー中
                </label>
                {followingsCount > 0 ? (
                  <Link className="flex" to={`/${username}/followings`}>
                    <p id="followings" className="w-12 ml-2 text-sm font-bold">
                      {followingsCount}
                    </p>
                  </Link>
                ) : (
                  <p id="followings" className="w-12 ml-2 text-sm font-bold">
                    {followingsCount}
                  </p>
                )}
              </>
            )}
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
            <nav className="flex relative h-12">
              <button
                className={`flex items-center justify-center w-1/2 border-b-4 box-border border-white ${
                  tab === "album" ? "text-emerald-500 " : "text-slate-500"
                }`}
                onClick={() => {
                  setTab("album");
                }}
              >
                <PhotoLibraryOutlined />
                <p className="h-4 ml-2 text-sm font-bold">過去の投稿</p>
              </button>
              <button
                className={`flex items-center justify-center w-1/2 border-b-4 box-border border-white ${
                  tab === "wanted" ? "text-emerald-500 " : "text-slate-500"
                }`}
                onClick={() => {
                  setTab("wanted");
                }}
              >
                <PersonAddOutlined />
                <p className="h-4 ml-2 text-sm font-bold">募集中</p>
              </button>
              <div
                className={`absolute w-1/2 h-1 bottom-0 bg-emerald-500 z-10 duration-[300ms] ${
                  tab === "album" ? "left-0" : "left-1/2"
                }`}
              />
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
                        className="w-12 h-12 mr-2 border-2 border-white object-cover rounded-full"
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
                            <button
                              className="flex absolute justify-center items-center w-36 h-8 right-2 bottom-2 rounded-full border border-emerald-500 text-emerald-500 
                          bg-white hover:border-none hover:text-slate-100 hover:bg-emerald-500 font-bold"
                            >
                              募集広告の編集
                            </button>
                          </Link>
                        ) : (
                          <Link
                            to={`/messages/${loginUser.uid}-${user.uid}`}
                            state={{ receiverUID: advertise!.uid }}
                          >
                            <button className="flex absolute justify-center items-center w-8 h-8 right-2 bottom-2 rounded-full border border-emerald-500 text-emerald-500 bg-white hover:border-none hover:text-slate-100 hover:bg-emerald-500">
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
                <div className="flex flex-col relative items-center p-4">
                  <p className="w-full text-center text-red-500">
                    現在、募集はおこなわれていません。
                  </p>
                  {loginUser.uid === user.uid && (
                    <Link to="/setting/advertise">
                      <button
                        className={`flex justify-center items-center w-36 h-8 ${
                          advertise.wanted
                            ? "absolute right-2 bottom-2"
                            : "mt-4"
                        } rounded-full border border-emerald-500 text-emerald-500 bg-white hover:border-none hover:text-white hover:bg-emerald-500 active:text-white active:bg-emerald-500 font-bold`}
                      >
                        募集広告の編集
                      </button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <Outlet />
      </div>
    </div>
  );
});
export default Profile;
