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
  doc,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  onSnapshot,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore";

interface Post {
  avatarURL: string;
  caption: string;
  displayName: string;
  id: string;
  imageURL: string;
  timestamp: Date | null;
  uid: string;
  username: string;
}

const PostComponent: React.VFC<{ postId: string; detail: boolean }> = memo(
  (props) => {
    const loginUid: string = useAppSelector(selectUser).uid;
    const [post, setPost] = useState<Post>({
      avatarURL: "",
      caption: "",
      displayName: "",
      id: "",
      imageURL: "",
      timestamp: null,
      uid: "",
      username: "",
    });
    const [counts, setCounts] = useState<number>(0);
    const [like, setLike] = useState<boolean>(false);
    let isMounted: boolean = true;
    const getPost: () => Promise<void> = async () => {
      const postRef: DocumentReference<DocumentData> = doc(
        db,
        "posts",
        props.postId
      );
      await getDoc(postRef).then((postSnap: DocumentSnapshot<DocumentData>) => {
        if (postSnap.exists()) {
          setPost({
            avatarURL: postSnap.data().avatarURL,
            caption: postSnap.data().caption,
            displayName: postSnap.data().displayName,
            id: postSnap.id,
            imageURL: postSnap.data().imageURL,
            timestamp: postSnap.data().timestamp.toDate(),
            uid: postSnap.data().uid,
            username: postSnap.data().username,
          });
        }
      });
      const likeUsersRef: CollectionReference<DocumentData> = collection(
        db,
        `posts/${props.postId}/likeUsers`
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
      getPost();
      return () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        isMounted = false;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div>
        <div>
          <p id="displayName">{post.displayName}</p>
          <p id="timestamp">
            {post.timestamp
              ? `${post.timestamp.getFullYear()}年${
                  post.timestamp!.getMonth() + 1
                }月${post.timestamp!.getDate()}日`
              : ""}
          </p>
          <Link to={`/${post.username}`}>
            <img id="avatarURL" src={post.avatarURL} alt="アバター画像" />
          </Link>
        </div>
        <div>
          {props.detail ? (
            <img id="image" src={post.imageURL} alt="投稿画像" />
          ) : (
            <Link to={`/${post.username}/${props.postId}`}>
              <img id="image" src={post.imageURL} alt="投稿画像" />
            </Link>
          )}

          <div color={like ? "red" : "white"}>
            <Favorite
              onClick={(event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
                event.preventDefault();
                addLikes(props.postId, loginUid);
              }}
            />
            {counts === null || counts === 0 ? (
              <p id="likeCounts">{counts}</p>
            ) : (
              <Link to={`/${post.username}/${props.postId}/likeUsers`}>
                <p id="likeCounts">{counts}</p>
              </Link>
            )}
          </div>
        </div>
        <div>{props.detail && <p id="caption">{post.caption}</p>}</div>
        <Outlet />
      </div>
    );
  }
);

export default PostComponent;
