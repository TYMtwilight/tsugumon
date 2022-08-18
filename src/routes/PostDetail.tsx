import React, { memo, useState, useEffect } from "react";
import {
  Params,
  useParams,
  useNavigate,
  NavigateFunction,
} from "react-router-dom";
import { db } from "../firebase";
import {
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
} from "firebase/firestore";
import PostComponent from "../components/PostComponent";

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

const PostDetail: React.VFC = memo(() => {
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
  const params: Readonly<Params<string>> = useParams();
  const postId: string = params.docId!;
  const navigate: NavigateFunction = useNavigate();
  let isMounted: boolean = true;

  const getPost: () => void = () => {
    const postRef = doc(db, `posts/${postId}`);
    getDoc(postRef).then((postSnap: DocumentSnapshot<DocumentData>) => {
      setPost({
        avatarURL: postSnap.data()!.avatarURL,
        caption: postSnap.data()!.caption,
        displayName: postSnap.data()!.displayName,
        id: postId,
        imageURL: postSnap.data()!.imageURL,
        timestamp: postSnap.data()!.timestamp.toDate(),
        uid: postSnap.data()!.uid,
        username: postSnap.data()!.username,
      });
    });
  };

  useEffect(() => {
    if (isMounted !== true) {
      return;
    }
    getPost();
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <button
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          event.preventDefault();
          navigate(-1);
        }}
      >
        戻る
      </button>
      {post.id && (
        <PostComponent
          avatarURL={post.avatarURL}
          caption={post.caption}
          displayName={post.displayName}
          id={post.id}
          imageURL={post.imageURL}
          timestamp={post.timestamp}
          uid={post.uid}
          username={post.username}
          detail={true}
        />
      )}
    </div>
  );
});

export default PostDetail;
