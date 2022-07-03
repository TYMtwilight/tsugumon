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

const Post: React.VFC = memo(() => {
  const params: Readonly<Params<string>> = useParams();
  const [avatarURL, setAvatarURL] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [docId, setDocId] = useState<string>("");
  const [imageURL, setImageURL] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [timestamp, setTimestamp] = useState<Date | null>(null);

  const setPost = async (isMounted: boolean) => {
    if (isMounted === false) {
      return;
    }
    setDocId(params.docId!);
    const postRef: DocumentReference<DocumentData> = doc(db, "posts", docId);
    const postSnapshot: DocumentSnapshot<DocumentData> = await getDoc(postRef);
    if (postSnapshot.exists()) {
      setAvatarURL(postSnapshot.data().avatarURL);
      setCaption(postSnapshot.data().caption);
      setDisplayName(postSnapshot.data().displayName);
      setImageURL(postSnapshot.data().imageURL);
      setUsername(postSnapshot.data().username);
      setTimestamp(postSnapshot.data().timestamp);
    }
  };

  useEffect(() => {
    let isMounted: boolean = true;
    setPost(isMounted);
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div>
        <p id="displayName">{displayName}</p>
        <p id="timestamp">{timestamp}</p>
        <Link to={`/${username}`}>
          <img id="avatarURL" src={avatarURL} alt="アバター画像" />
        </Link>
      </div>
      <div>
        <img id="image" src={imageURL} alt="投稿画像" />
        <div>
          <Favorite />
          <p id="likeCounts">0</p>
        </div>
      </div>
      <div>
        <p id="caption">{caption}</p>
      </div>
      <Outlet />
    </div>
  );
});

export default Post;
