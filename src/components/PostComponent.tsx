import React, { memo, useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { LoginUser, selectUser } from "../features/userSlice";
import { addLikes } from "../functions/AddLikes";
import FavoriteRounded from "@mui/icons-material/FavoriteRounded";
import ChatBubbleRounded from "@mui/icons-material/ChatBubbleRounded";
import { db } from "../firebase";
import {
  collection,
  CollectionReference,
  DocumentData,
  onSnapshot,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore";

interface PostSummary {
  avatarURL: string;
  caption: string;
  detail: boolean;
  displayName: string;
  id: string;
  imageURL: string;
  tags: string[];
  timestamp: Date | null;
  uid: string;
  username: string;
}

const PostComponent: React.VFC<PostSummary> = memo((props) => {
  const loginUser: LoginUser = useAppSelector(selectUser);
  const [likeCounts, setLikeCounts] = useState<number>(0);
  const [commentCounts, setCommentCounts] = useState<number>(0);
  const [like, setLike] = useState<boolean>(false);
  const [comment, setComment] = useState<boolean>(false);
  let isMounted: boolean = true;
  const currentTime: number = new Date().getTime();
  const messageTime: number = props.timestamp!.getTime();
  const beforeTime: number = currentTime - messageTime;
  const week: number = 604800000;
  const day: number = 86400000;
  const hour: number = 3600000;
  const minute: number = 60000;
  const second: number = 1000;

  const unsubscribe: () => void = () => {
    const likeUsersRef: CollectionReference<DocumentData> = collection(
      db,
      `posts/${props.id}/likeUsers`
    );
    onSnapshot(likeUsersRef, (likeUsersSnap: QuerySnapshot<DocumentData>) => {
      if (isMounted === false) {
        return;
      }
      setLikeCounts(likeUsersSnap.size);
      setLike(
        likeUsersSnap.docs.find(
          (likeUserSnap: QueryDocumentSnapshot<DocumentData>) => {
            return likeUserSnap.data().uid === loginUser.uid;
          }
        ) !== undefined
      );
    });
    const commentsRef: CollectionReference<DocumentData> = collection(
      db,
      `posts/${props.id}/comments`
    );
    onSnapshot(commentsRef, (commentsSnap: QuerySnapshot<DocumentData>) => {
      if (isMounted === false) {
        return;
      }
      setCommentCounts(commentsSnap.size);
      setComment(
        commentsSnap.docs.find(
          (commentSnap: QueryDocumentSnapshot<DocumentData>) => {
            return commentSnap.data().uid === loginUser.uid;
          }
        ) !== undefined
      );
    });
  };

  useEffect(() => {
    if (isMounted === false) {
      return;
    }
    unsubscribe();
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isMounted = false;
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white">
      <div className="mb-12">
        <div className="p-2">
          <Link className="flex" to={`/${props.username}`}>
            <img
              id="avatarURL"
              className="block w-12 h-12 rounded-full object-cover"
              src={props.avatarURL}
              alt="アバター画像"
            />
            <p className="px-2 py-4 leading-4 font-semibold" id="displayName">
              {props.displayName}
            </p>
          </Link>
        </div>
        <p className="-mt-4 mr-4 text-right" id="timestamp">
          {beforeTime > week
            ? `${props.timestamp!.getFullYear()}年${
                props.timestamp!.getMonth() + 1
              }月${props.timestamp!.getDate()}日`
            : beforeTime > day
            ? `${Math.floor(beforeTime / day)}日前`
            : beforeTime > hour
            ? `${Math.floor(beforeTime / hour)}時間前`
            : beforeTime > minute
            ? `${Math.floor(beforeTime / minute)}分前`
            : `${Math.floor(beforeTime / second)}秒前`}
        </p>
        <div>
          <div className="w-auto h-auto">
            {props.detail ? (
              <img id="image" src={props.imageURL} alt="投稿画像" />
            ) : (
              <Link to={`/${props.username}/${props.id}`}>
                <img
                  className="object-cover w-screen h-96 "
                  id="image"
                  src={props.imageURL}
                  alt="投稿画像"
                />
              </Link>
            )}
          </div>
          <div className="flex ml-4 mt-2">
            <div
              className={`flex ${like ? "text-emerald-500" : "text-slate-400"}`}
            >
              <FavoriteRounded
                onClick={(
                  event: React.MouseEvent<SVGSVGElement, MouseEvent>
                ) => {
                  event.preventDefault();
                  addLikes(props.id, loginUser.uid);
                }}
              />
              <div className="w-12">
                {likeCounts === 0 ? (
                  <p className="ml-2" id="likeCounts">
                    {likeCounts}
                  </p>
                ) : (
                  <Link to={`/${props.username}/${props.id}/likeUsers`}>
                    <p className="ml-2" id="likeCounts">
                      {likeCounts}
                    </p>
                  </Link>
                )}
              </div>
            </div>
            <div
              className={`flex ml-4 ${
                comment ? "text-emerald-500" : "text-slate-400"
              } `}
            >
              <Link to={`/${props.username}/${props.id}/comments`}>
                <ChatBubbleRounded />
                <div className="inline-block w-12">
                  {commentCounts === 0 ? (
                    <p className="ml-2" id="likeCounts">
                      {commentCounts}
                    </p>
                  ) : (
                    <p className="ml-2" id="likeCounts">
                      {commentCounts}
                    </p>
                  )}
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className={props.detail ? "h-full px-4 mb-4" : "h-24 px-4 mb-4"}>
          {props.detail ? (
            <Link to={`/${props.username}/${props.id}`}>
              <p className=" text-ellipsis" id="caption">
                {props.caption}
              </p>
            </Link>
          ) : (
            <div className="relative">
              <p className="h-36 overflow-hidden" id="caption">
                {props.caption}...
              </p>
              <div
                className="absolute w-full h-8 bottom-0 bg-gradient-to-b from-white/0 to-white/100"
                z-20
              />
            </div>
          )}
        </div>
        <div className="flex flex-row-reverse">
          {props.detail && (
            <Link to={`/${props.username}/${props.id}/comments`}>
              <p className="w-36 h-8 mr-4 text-center align-middle leading-8 text-emerald-500 border border-emerald-500 rounded-full">
                コメントを書く
              </p>
            </Link>
          )}
        </div>
      </div>
      <Outlet />
    </div>
  );
});

export default PostComponent;
