import React, { memo, useState, useEffect } from "react";
import {
  Link,
  Outlet,
  Params,
  useParams,
  useNavigate,
  NavigateFunction,
} from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectUser, User } from "../features/userSlice";
import { useLikes } from "../hooks/useLikes";
import { Favorite } from "@mui/icons-material";
import { db } from "../firebase";
import {
  doc,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
} from "firebase/firestore";

interface likeUser {
  avatarURL: string;
  displayName: string;
  uid: string;
  username: string;
  userType: "business" | "normal" | null;
}

interface PostData {
  avatarURL: string;
  caption: string;
  displayName: string;
  id: string;
  imageURL: string;
  timestamp: number;
  uid: string;
  username: string;
}

const Post: React.VFC = memo(() => {
  const params: Readonly<Params<string>> = useParams();
  const user: User = useAppSelector(selectUser);
  const likeUser: likeUser = {
    avatarURL: user.avatarURL,
    displayName: user.displayName,
    uid: user.uid,
    username: user.username,
    userType: user.userType,
  };
  const postId = params.docId!;
  const navigate: NavigateFunction = useNavigate();
  const [post, setPost] = useState<PostData>({
    avatarURL: "",
    caption: "",
    displayName: "",
    id: "",
    imageURL: "",
    timestamp: 0,
    uid: "",
    username: "",
  });
  const [like, setLike] = useState<boolean>(false);
  const likeCounts = useLikes(like, likeUser, post);
  const getPost = async (isMounted: boolean) => {
    if (isMounted === false) {
      return;
    }
    const postRef: DocumentReference<DocumentData> = doc(db, "posts", postId);
    const postSnap: DocumentSnapshot<DocumentData> = await getDoc(postRef);
    if (postSnap.exists()) {
      setPost({
        avatarURL: postSnap.data().avatarURL,
        caption: postSnap.data().caption,
        displayName: postSnap.data().displayName,
        id: postSnap.id,
        imageURL: postSnap.data().imageURL,
        timestamp: postSnap.data().timestamp,
        uid: postSnap.data().uid,
        username: postSnap.data().username,
      });
    }
  };

  useEffect(() => {
    let isMounted: boolean = true;
    getPost(isMounted);
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div>
        <button
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            navigate(-1);
          }}
        >
          戻る
        </button>
        <p id="displayName">{post.displayName}</p>
        {/* <p id="timestamp">{post.timestamp}</p> */}
        <Link to={`/${post.username}`}>
          <img id="avatarURL" src={post.avatarURL} alt="アバター画像" />
        </Link>
      </div>
      <div>
        <img id="image" src={post.imageURL} alt="投稿画像" />
        <div>
          <Favorite
            onClick={(event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
              setLike((prev) => !prev);
            }}
          />
          <p id="likeCounts">{likeCounts}</p>
        </div>
      </div>
      <div>
        <p id="caption">{post.caption}</p>
      </div>
      <Outlet />
    </div>
  );
});

export default Post;
