import React, { memo, useState, useEffect } from "react";
import {
  Link,
  Params,
  useParams,
  useNavigate,
  NavigateFunction,
} from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectUser, LoginUser } from "../features/userSlice";
import { db } from "../firebase";
import {
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
} from "firebase/firestore";
import { useAdvertise } from "../hooks/useAdvertise";
import { useDelete } from "../hooks/useDelete";
import PostComponent from "../components/PostComponent";
import { MailOutlined, ArrowBackIosNewRounded } from "@mui/icons-material";

interface Post {
  avatarURL: string;
  caption: string;
  displayName: string;
  id: string;
  imageURL: string;
  timestamp: Date | null;
  tags: string[];
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
    tags: [],
    uid: "",
    username: "",
  });
  const [deletable, setDeletable] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [execute, setExecute] = useState<boolean>(false);
  const loginUser: LoginUser = useAppSelector(selectUser);
  const params: Readonly<Params<string>> = useParams();
  const postId: string = params.docId!;
  const progress: "wait" | "run" | "done" = useDelete(execute, postId);
  const username: string = params.username!;
  const advertise = useAdvertise(username);
  const openingHour: string = `0${advertise.openingHour}`;
  const openingMinutes: string = `0${advertise.openingMinutes}`;
  const closingHour: string = `0${advertise.closingHour}`;
  const closingMinutes: string = `0${advertise.closingMinutes}`;
  const navigate: NavigateFunction = useNavigate();
  let isMounted: boolean = true;

  const getPost: () => void = () => {
    const postRef = doc(db, `posts/${postId}`);
    getDoc(postRef).then((postSnap: DocumentSnapshot<DocumentData>) => {
      if (isMounted !== true) {
        return;
      }
      setPost({
        avatarURL: postSnap.data()!.avatarURL,
        caption: postSnap.data()!.caption,
        displayName: postSnap.data()!.displayName,
        id: postId,
        imageURL: postSnap.data()!.imageURL,
        timestamp: postSnap.data()!.timestamp.toDate(),
        tags: postSnap.data()!.tags,
        uid: postSnap.data()!.uid,
        username: postSnap.data()!.username,
      });
      if (postSnap.data()!.imageLocation) {
        setDeletable(true);
      }
      return postSnap;
    });
  };

  useEffect(() => {
    getPost();
    switch (progress) {
      case "wait":
        if (process.env.NODE_ENV === "development") {
          console.log(`${progress}: アップロードの待機中`);
        }
        break;
      case "run":
        if (process.env.NODE_ENV === "development") {
          console.log(`${progress}: アップロードの実行中`);
        }
        break;
      case "done":
        if (process.env.NODE_ENV === "development") {
          console.log(`${progress}: アップロード完了`);
        }
        setExecute(false);
    }
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isMounted = false;
    };
  }, [progress]);

  return (
    <div className="flex justify-center w-screen h-screen bg-slate-100 overflow-scroll">
      <div className="flex fixed w-screen md:w-1/2 lg:w-1/3 h-12 justify-center items-center top-0 bg-white z-30">
        <button
          className="absolute left-2 text-slate-500"
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowBackIosNewRounded fontSize="small" />
        </button>
        <p className="w-16 mx-auto font-bold">投稿画像</p>
      </div>
      <div className="flex flex-col w-screen md:w-1/2 lg:w-1/3 h-max min-h-screen mt-12 bg-white">
        {post.id && (
          <div className="z-20">
            <PostComponent
              avatarURL={post.avatarURL}
              caption={post.caption}
              displayName={post.displayName}
              id={post.id}
              imageURL={post.imageURL}
              timestamp={post.timestamp}
              tags={post.tags}
              uid={post.uid}
              username={post.username}
              detail={true}
              deletable={deletable}
              setModal={setModal}
            />
          </div>
        )}
        {advertise.wanted && (
          <div>
            <div className="flex h-12 w-28 justify-center items-center text-slate-100 bg-gradient-to-r from-cyan-500 to-emerald-500 font-bold rounded-t-2xl">
              <p className="w-24 indent-4">募 集 中</p>
            </div>
            <div className="relative bg-slate-300">
              <img
                className="w-screen h-44 object-cover brightness-75"
                src={advertise!.imageURL}
                alt="イメージ画像"
              />
              <Link to={`/${username}`}>
                <div className="flex absolute items-center inset-y-1/2 left-4 ">
                  <img
                    className="w-12 h-12 mr-2 border-2 border-slate-100 object-cover rounded-full"
                    id="avatar"
                    src={
                      post.avatarURL
                        ? post.avatarURL
                        : `${process.env.PUBLIC_URL}/noAvatar.png`
                    }
                    alt="アバター画像"
                  />
                  <p className="text-xl text-slate-100 font-semibold">
                    {advertise!.displayName}
                  </p>
                </div>
              </Link>
              {loginUser && loginUser.uid !== advertise!.uid && (
                <Link
                  to={`/messages/${loginUser.uid}-${advertise!.uid}`}
                  state={{ receiverUID: advertise!.uid }}
                >
                  <button className="flex absolute justify-center items-center w-8 h-8 right-2 bottom-2 rounded-full border border-emerald-500 text-emerald-500 bg-slate-100 hover:border-none hover:text-slate-100 hover:bg-emerald-500">
                    <MailOutlined />
                  </button>
                </Link>
              )}
            </div>
            <div className="p-4">
              <div className="mb-4">
                <p>{advertise!.message}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-slate-500">勤務内容</p>
                <p className="ml-2">{advertise!.jobDescription}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-slate-500">勤務地</p>
                <p className="ml-2">{advertise!.location}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-slate-500">給与</p>
                <p className="ml-2">
                  <label className="text-sm mr-2">月額</label>
                  {Number(advertise!.minimumWage).toLocaleString()}円 ~{" "}
                  {Number(advertise!.maximumWage).toLocaleString()}円
                </p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-slate-500">勤務時間</p>
                <p className="ml-2">
                  {openingHour.substring(openingHour.length - 2)}:
                  {openingMinutes.substring(openingMinutes.length - 2)} ~
                  {closingHour.substring(closingHour.length - 2)}:
                  {closingMinutes.substring(closingMinutes.length - 2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      {modal === true && (
        <div className="flex flex-col z-50">
          <div className="flex flex-col fixed w-screen h-screen top-0 left-0   bg-slate-900/90">
            <p className="my-16 text-center text-white font-bold">
              この投稿を削除しますか？
            </p>
            <button
              className="w-36 mx-auto h-8 mb-8 border rounded-full font-bold border-red-500 text-red-500"
              onClick={() => {
                setExecute(true);
              }}
            >
              削除する
            </button>
            <button
              className="block w-36 h-8 mb-8 mx-auto border rounded-full font-bold border-slate-100 text-slate-100"
              onClick={() => {
                setModal(false);
              }}
            >
              キャンセルする
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default PostDetail;
