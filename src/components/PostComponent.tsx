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
    <div className="mt-4">
      <div className="p-2">
        <Link className="flex" to={`/${props.username}`}>
          <img
            id="avatarURL"
            className="block w-12 h-12 rounded-full"
            src={props.avatarURL}
            alt="アバター画像"
          />
          <p className="px-2 py-4 leading-4 font-semibold" id="displayName">
            {props.displayName}
          </p>
        </Link>
      </div>
      <p className="-mt-4 mr-4 text-right" id="timestamp">
        {props.timestamp
          ? `${props.timestamp.getFullYear()}年${
              props.timestamp!.getMonth() + 1
            }月${props.timestamp!.getDate()}日`
          : ""}
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
              onClick={(event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
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
      <div
        className={
          props.detail ? "h-full px-4 py-2" : "h-24 px-4 py-2 text-ellipsis"
        }
      >
        {props.detail ? (
          <Link to={`/${props.username}/${props.id}`}>
            <p className="h-full text-ellipsis" id="caption">
              {props.caption}
            </p>
          </Link>
        ) : (
          <p className="h-full text-ellipsis" id="caption">
            {props.caption}
          </p>
        )}
      </div>
      <div>
        {props.detail && (
          <Link to={`/${props.username}/${props.id}/comments`}>
            <p>コメントを書く</p>
          </Link>
        )}
      </div>
      <Outlet />
    </div>
  );
});

export default PostComponent;
