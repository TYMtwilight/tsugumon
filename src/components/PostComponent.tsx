import React, { memo, useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectUser } from "../features/userSlice";
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
  timestamp: Date | null;
  uid: string;
  username: string;
}

const PostComponent: React.VFC<PostSummary> = memo((props) => {
  const loginUid: string = useAppSelector(selectUser).uid;
  const [counts, setCounts] = useState<number>(0);
  const [like, setLike] = useState<boolean>(false);
  let isMounted: boolean = true;

  const unsubscribe: () => void = () => {
    const likeUsersRef: CollectionReference<DocumentData> = collection(
      db,
      `posts/${props.id}/likeUsers`
    );
    onSnapshot(likeUsersRef, (likeUsersSnap: QuerySnapshot<DocumentData>) => {
      if (isMounted === true) {
        setCounts(likeUsersSnap.size);
        setLike(
          likeUsersSnap.docs.find(
            (likeUserSnap: QueryDocumentSnapshot<DocumentData>) => {
              return likeUserSnap.data().uid === loginUid;
            }
          ) !== undefined
        );
      }
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
    <div className="mb-12">
      <div className="flex p-2 font-semibold">
        <Link to={`/${props.username}`}>
          <img
            id="avatarURL"
            className="block w-12 h-12 rounded-full"
            src={props.avatarURL}
            alt="アバター画像"
          />
        </Link>
        <p className="px-2 py-4 leading-4" id="displayName">
          {props.displayName}
        </p>
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
        <div className="flex ml-2 mt-2">
          <div className={like ? "flex  text-red-500" : "flex  text-slate-400"}>
            <FavoriteRounded
              onClick={(event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
                event.preventDefault();
                addLikes(props.id, loginUid);
              }}
            />
            {counts === null || counts === 0 ? (
              <p id="likeCounts">{counts}</p>
            ) : (
              <Link to={`/${props.username}/${props.id}/likeUsers`}>
                <p className="ml-2" id="likeCounts">
                  {counts}
                </p>
              </Link>
            )}
          </div>
          <div className="flex ml-8 text-slate-400">
            <ChatBubbleRounded></ChatBubbleRounded>
          </div>
        </div>
      </div>
      <div className={props.detail ? "h-full p-2 " : "h-8 p-2 overflow-hidden"}>
        <Link to={`/${props.username}/${props.id}`}>
          <p className="overflow-elipsis" id="caption">
            {props.caption}
          </p>
        </Link>
      </div>
      <Outlet />
    </div>
  );
});

export default PostComponent;
