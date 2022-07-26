import { memo, useState, useEffect } from "react";
import { Link, Outlet, Params, useParams } from "react-router-dom";
import { Favorite } from "@mui/icons-material";
import { db } from "../firebase";
import {
  doc,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
} from "firebase/firestore";

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
  const postId = params.docId!;
  console.log(postId);
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
        <p id="displayName">{post.displayName}</p>
        {/* <p id="timestamp">{post.timestamp}</p> */}
        <Link to={`/${post.username}`}>
          <img id="avatarURL" src={post.avatarURL} alt="アバター画像" />
        </Link>
      </div>
      <div>
        <img id="image" src={post.imageURL} alt="投稿画像" />
        <div>
          <Favorite />
          <p id="likeCounts">0</p>
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
