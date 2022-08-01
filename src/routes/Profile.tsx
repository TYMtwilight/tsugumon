import React, { memo } from "react";
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
import { addFollower } from "../functions/AddFollower";

interface Post {
  avatarURL: string;
  caption: string;
  displayName: string;
  id: string;
  imageURL: string;
  timestamp: Date;
  uid: string;
  username: string;
}

interface FollowUser {
  avatarURL: string;
  displayName: string;
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

  return (
    <div>
      <div id="top">
        <button
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            navigate(-1);
          }}
        >
          戻る
        </button>
        <img id="background" src={user.backgroundURL} alt="背景画像" />
        <img
          id="avatar"
          src={
            user.avatarURL
              ? user.avatarURL
              : `${process.env.PUBLIC_URL}/noAvatar.png`
          }
          alt="アバター画像"
        />
        {loginUser.uid === user.uid ? (
          <Link to="/setting">
            <p>プロフィールを編集する</p>
          </Link>
        ) : (
          <button
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              const following: FollowUser = {
                avatarURL: user.avatarURL,
                displayName: user.displayName,
                uid: user.uid,
                username: user.username,
                userType: user.userType,
              };
              const follower: FollowUser = {
                avatarURL: loginUser.avatarURL,
                displayName: loginUser.displayName,
                uid: loginUser.uid,
                username: loginUser.username,
                userType: loginUser.userType,
              };
              addFollower(following, follower);
            }}
          >
            {isFollowing ? "フォロー解除" : "フォローする"}
          </button>
        )}
        <p id="displayName">{user.displayName}</p>
      </div>
      <div id="profile">
        <p>紹介文</p>
        <p>{user.introduction}</p>
        <div id="tags">
          {user.cropsTags.map((cropsTag) => {
            return <p key={cropsTag}>{cropsTag}</p>;
          })}
        </div>
        <div id="followerCounts">
          <p>フォロワー</p>
          {followersCount > 0 ? (
            <Link to={`/users/${username}/followers`}>
              <p>{followersCount}</p>
            </Link>
          ) : (
            <p>{followersCount}</p>
          )}
        </div>
        <div id="followingCounts">
          <p>フォロー中</p>
          {followingsCount > 0 ? (
            <Link to={`/users/${username}/followings`}>
              <p>{followingsCount}</p>
            </Link>
          ) : (
            <p>{followingsCount}</p>
          )}
        </div>
        {user.userType === "business" ? (
          <div id="business">
            <div id="owner">
              <p>事業主</p>
              <p>{option.owner}</p>
            </div>
            <div id="typeOfWork">
              <p>職種</p>
              <p>{option.typeOfWork}</p>
            </div>
            <div id="address">
              <p>住所</p>
              <p>{option.address}</p>
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
      <div>
        {posts.map((post: Post) => {
          return (
            <div key={post.id}>
              <img src={post.avatarURL} alt={post.username} />
              <p>{post.username}</p>
              {/* <p>{post.timestamp.getDate}</p> */}
              <Link to={`/${username}/${post.id}`}>
                <img src={post.imageURL} alt={post.id} />
                <p>{post.caption}</p>
              </Link>
            </div>
          );
        })}
      </div>
      <Outlet />
    </div>
  );
});
export default Profile;
