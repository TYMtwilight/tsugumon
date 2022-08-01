import React, { useState, useEffect, memo } from "react";
import {
  Link,
  Outlet,
  Params,
  useParams,
  useNavigate,
  NavigateFunction,
} from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { db } from "../firebase";
import { selectUser } from "../features/userSlice";
import { useProfile } from "../hooks/useProfile";
import { usePosts } from "../hooks/usePosts";
import { addFollower } from "../functions/AddFollower";
import {
  collection,
  CollectionReference,
  DocumentData,
  getDocs,
  onSnapshot,
  Query,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  where,
} from "firebase/firestore";

interface UserData {
  avatarURL: string;
  backgroundURL: string;
  cropsTags: string[];
  displayName: string;
  introduction: string;
  username: string;
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
  const [followersCount, setFollowersCount] = useState<number | null>(null);
  const [followingsCount, setFollowingsCount] = useState<number | null>(null);
  const [follow, setFollow] = useState<boolean>(false);
  const params: Readonly<Params<string>> = useParams();
  const currentUser = useAppSelector(selectUser);
  const followerUID = currentUser.uid;
  const username = params.username!;
  const navigate: NavigateFunction = useNavigate();
  const user: UserData = useProfile(username)!.user;
  const uid: string = useProfile(username)!.uid;
  const option: OptionData = useProfile(username)!.option;
  const posts: PostData[] = usePosts(username);

  const getFollowers = async (isMounted: boolean) => {
    if (isMounted === false) {
      return;
    }
    
    const followingQuery: Query<DocumentData> = query(
      collection(db, "users"),
      where("username", "==", username)
    );
    getDocs(followingQuery).then(
      (followingsSnap: QuerySnapshot<DocumentData>) => {
    const followersRef: CollectionReference<DocumentData> = collection(
      db,
      `users/${followingsSnap.docs[0].id}/followers`
    );
    const followingsRef: CollectionReference<DocumentData> = collection(
      db,
      `users/${followingsSnap.docs[0].id}/followings`
    );
    onSnapshot(followersRef, (followersSnap: QuerySnapshot<DocumentData>) => {
      setFollowersCount(followersSnap.size);
      setFollow(
        followersSnap.docs.find(
          (followerSnap: QueryDocumentSnapshot<DocumentData>) => {
            return followerSnap.id === followerUID;
          }
        ) !== undefined
      );
    });

    onSnapshot(followingsRef, (followingsSnap: QuerySnapshot<DocumentData>) => {
      setFollowingsCount(followingsSnap.size);
    });
  });
  };

  useEffect(() => {
    let isMounted: boolean = true;
    getFollowers(isMounted);
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        {currentUser.username === username ? (
          <Link to="/setting">
            <p>プロフィールを編集する</p>
          </Link>
        ) : (
          <button
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              console.log("フォローボタンが押されました");
              addFollower(followerUID, uid, currentUser, user);
            }}
          >
            {follow ? "フォロー解除" : "フォローする"}
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
          {followersCount === null || followersCount === 0 ? (
            <p>{followersCount}</p>
          ) : (
            <Link to={`/users/${username}/followers`}>
              <p>{followersCount}</p>
            </Link>
          )}
        </div>
        <div id="followingCounts">
          <p>フォロー中</p>
          {followingsCount === null || followingsCount === 0 ? (
            <p>{followingsCount}</p>
          ) : (
            <Link to={`/users/${username}/followings`}>
              <p>{followingsCount}</p>
            </Link>
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
