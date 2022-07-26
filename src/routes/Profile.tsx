import React, { memo } from "react";
import {
  Link,
  Outlet,
  Params,
  useParams,
  useNavigate,
  NavigateFunction,
} from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectUser } from "../features/userSlice";
import { useProfile } from "../hooks/useProfile";
import { usePosts } from "../hooks/usePosts";

interface UserData {
  avatarURL: string;
  backgroundURL: string;
  cropsTags: string[];
  displayName: string;
  introduction: string;
  userType: "business" | "normal" | null;
}

interface OptionData {
  address: string;
  birthdate: string;
  owner: string;
  skill: string;
  typeOfWork: string;
}

interface PostData {
  avatarURL: string;
  caption: string;
  displayName: string;
  id: string;
  imageURL: string;
  timestamp: Date;
  uid: string;
  username: string;
}

const Profile: React.VFC = memo(() => {
  const params: Readonly<Params<string>> = useParams();
  const currentUser = useAppSelector(selectUser);
  const username = params.username!;
  const navigate: NavigateFunction = useNavigate();
  const user: UserData = useProfile(username)!.user;
  const option: OptionData = useProfile(username)!.option;
  const posts: PostData[] = usePosts(username);

  return (
    <div>
      <div id="top">
        <button
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            navigate(`/home`);
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
        {currentUser.username === username && (
          <Link to="/setting">
            <p>プロフィールを編集する</p>
          </Link>
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
        <div id="followerCount">
          <p>フォロワー</p>
          <p>０人</p>
        </div>
        <div id="followeeCount">
          <p>フォロー中</p>
          <p>０人</p>
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
        {posts.map((post: PostData) => {
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
