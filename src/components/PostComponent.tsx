import React, { memo, useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectUser } from "../features/userSlice";
import { addLikes } from "../functions/AddLikes";
import { Favorite } from "@mui/icons-material";
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
    <div>
      <div>
        <p id="displayName">{props.displayName}</p>
        <p id="timestamp">
          {props.timestamp
            ? `${props.timestamp.getFullYear()}年${
                props.timestamp!.getMonth() + 1
              }月${props.timestamp!.getDate()}日`
            : ""}
        </p>
        <Link to={`/${props.username}`}>
          <img id="avatarURL" src={props.avatarURL} alt="アバター画像" />
        </Link>
      </div>
      <div>
        {props.detail ? (
          <img id="image" src={props.imageURL} alt="投稿画像" />
        ) : (
          <Link to={`/${props.username}/${props.id}`}>
            <img id="image" src={props.imageURL} alt="投稿画像" />
          </Link>
        )}

        <div color={like ? "red" : "white"}>
          <Favorite
            onClick={(event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
              event.preventDefault();
              addLikes(props.id, loginUid);
            }}
          />
          {counts === null || counts === 0 ? (
            <p id="likeCounts">{counts}</p>
          ) : (
            <Link to={`/${props.username}/${props.id}/likeUsers`}>
              <p id="likeCounts">{counts}</p>
            </Link>
          )}
        </div>
      </div>
      <div>{props.detail && <p id="caption">{props.caption}</p>}</div>
      <Outlet />
    </div>
  );
});

export default PostComponent;
