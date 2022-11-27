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
import { getRandomString } from "../functions/GetRandomString";
import ArrowBackRounded from "@mui/icons-material/ArrowBackIosNewRounded";

interface Comment {
  avatarURL: string;
  comment: string;
  displayName: string;
  id: string;
  timestamp: Date;
  username: string;
}

const Comments: React.VFC = () => {
  const navigate: NavigateFunction = useNavigate();
  const loginUser: LoginUser = useAppSelector(selectUser);
  const params: Readonly<Params<string>> = useParams();
  const [comment, setComment] = useState<string>("");
  const postId: string = params.docId!;
  const postUsername: string = params.username!;
  const commentId: string = getRandomString();
  const comments: Comment[] = useComments(postId);

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
      window.scrollTo(0, 0);
    });
  };

  return (
    <div className="flex justify-center w-screen h-max min-h-screen bg-slate-100">
      <div className="flex fixed w-screen md:w-1/2 lg:w-1/3 justify-center items-center h-12 top-0 bg-white">
        <button
          className="absolute left-2 text-slate-500"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            navigate(-1);
          }}
        >
          <ArrowBackRounded />
        </button>
        <p className="w-16 font-bold">コメント</p>
      </div>
      <div className="flex flex-col w-screen md:w-1/2 lg:w-1/3 h-max min-h-screen mt-12 mb-40 bg-white">
        {comments.map((comment: Comment) => {
          return (
            <div className="p-4 mb-4" key={comment.id}>
              <div className="flex items-center mb-4">
                <Link
                  id="link"
                  className="flex flex-row items-center"
                  to={`/${comment.username}/`}
                >
                  <img
                    className="block w-8 h-8 rounded-full"
                    src={comment.avatarURL}
                    alt="アバター画像"
                  />
                </Link>
                <label htmlFor="link" className="px-2 py-2 leading-4">
                  {comment.displayName}
                </label>
              </div>
              <p className="w-full h-max my-2">{comment.comment}</p>
              <div className="flex w-full h-4 justify-end">
                <p className="text-sm mr-4 text-slate-500">
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
      <div className="flex fixed flex-col w-screen md:w-1/2 lg:w-1/3 justify-center p-4 bottom-0 bg-white border-t border-slate-300 ">
        <div>
          <p className="h-8 text-sm">返信先：{postUsername}さん</p>
        </div>
        <div>
          <textarea
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
              event.preventDefault();
              setComment(event.target.value);
            }}
            className="w-full h-24 mb-4 p-2 resize-none bg-slate-100 rounded-lg outline-none"
            value={comment}
          />
        </div>
        <div className="flex justify-end">
          <button
            className="block w-32 h-8 border rounded-full font-bold border-emerald-500 text-emerald-500 hover:border-none hover:bg-emerald-500 hover:text-white disabled:border-slate-400 disabled:text-slate-400 disabled:bg-slate-300"
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
  );
};

export default Comments;
