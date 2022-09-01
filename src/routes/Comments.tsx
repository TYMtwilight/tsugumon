import React, { useState } from "react";
import { useAppSelector } from "../app/hooks";
import { LoginUser, selectUser } from "../features/userSlice";
import {
  Link,
  useNavigate,
  NavigateFunction,
  useParams,
  Params,
} from "react-router-dom";
import { db } from "../firebase";
import {
  doc,
  DocumentData,
  DocumentReference,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useComments } from "../hooks/useComments";
import ContentEditable from "../components/ContentEditable";
import ArrowBackRounded from "@mui/icons-material/ArrowBackIosNewRounded";

interface Comment {
  avatarURL: string;
  comment: string;
  displayName: string;
  id: string;
  timestamp: Date;
  username: string;
}

const getRandomString: () => string = () => {
  const S: string =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const N: number = 16;
  const randomValues: number[] = Array.from(
    crypto.getRandomValues(new Uint32Array(N))
  );
  const randomString: string = randomValues
    .map((n) => S[n % S.length])
    .join("");
  return randomString;
};

const Comments: React.VFC = () => {
  const navigate: NavigateFunction = useNavigate();
  const loginUser: LoginUser = useAppSelector(selectUser);
  const params: Readonly<Params<string>> = useParams();
  const [comment, setComment] = useState<string>("");
  const postId: string = params.docId!;
  const postUsername: string = params.username!;
  const commentId: string = getRandomString();
  const comments: Comment[] = useComments(postId);

  const handleBlur: () => void = () => {
    console.log(comment);
  };
  const uploadComment = () => {
    const commentRef: DocumentReference<DocumentData> = doc(
      db,
      `posts/${postId}/comments/${commentId}`
    );
 

    setDoc(commentRef, {
      avatarURL: loginUser.avatarURL,
      comment: comment,
      displayName: loginUser.displayName,
      timestamp: serverTimestamp(),
      username: loginUser.username,
    }).then(() => {
      setComment("");
      document.getElementById("content_editable")!.innerHTML = "";
    });
  };

  return (
    <div className="w-screen min-h-screen bg-slate-100">
      <div className="flex items-center fixed w-screen h-12 top-0 bg-slate-100">
        <button
          className="absolute left-2 text-slate-500"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            navigate(-1);
          }}
        >
          <ArrowBackRounded />
        </button>
        <p className="w-16 mx-auto font-bold">コメント</p>
      </div>
      <div className="h-max mt-12">
        {comments.map((comment: Comment) => {
          return (
            <div className="p-4 mb-4" key={comment.id}>
              <div className="flex">
                <Link to={`/${comment.username}/`}>
                  <img
                    className="block w-8 h-8 rounded-full"
                    src={comment.avatarURL}
                    alt="アバター画像"
                  />
                </Link>
                <p className="px-2 py-2 leading-4">{comment.displayName}</p>
              </div>
              <p className="w-full h-max my-2">{comment.comment}</p>
              <div className="relative">
                <p className="absolute right-4 text-sm text-slate-500">
                  {comment.timestamp &&
                    `${comment.timestamp.getFullYear()}年${
                      comment.timestamp.getMonth() + 1
                    }月${comment.timestamp.getDate()}日${comment.timestamp.getHours()}時${comment.timestamp.getMinutes()}分`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="relative">
        <div className="fixed w-screen bottom-0 z-20 p-4 mb-16 border-t border-slate-300 bg-slate-100">
          <div>
            <p className="h-8 text-sm">返信先：{postUsername}さん</p>
          </div>
          <div>
            <ContentEditable
              id="content_editable"
              inputFor="comment"
              value={comment}
              onChange={setComment}
              onBlur={handleBlur}
            />
          </div>
          <div className="flex justify-end">
            <button
              className="block w-32 h-8 border rounded-full font-bold border-emerald-500 text-emerald-500 hover:border-none hover:bg-emerald-500 hover:text-slate-100 disabled:border-slate-400 disabled:text-slate-400 disabled:bg-slate-300"
              disabled={!comment}
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                event.preventDefault();
                uploadComment();
              }}
            >
              コメントする
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comments;
