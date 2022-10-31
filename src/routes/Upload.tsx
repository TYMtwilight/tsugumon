import React, { useEffect, useState, memo } from "react";
import { useAppSelector } from "../app/hooks";
import { selectUser, LoginUser } from "../features/userSlice";
import { useNavigate, NavigateFunction, Navigate } from "react-router-dom";
import { useBatch } from "../hooks/useBatch";
import { resizeImage } from "../functions/ResizeImage";
import CloseRounded from "@mui/icons-material/CloseRounded";
import AddToPhotosRounded from "@mui/icons-material/AddToPhotosRounded";

const Upload: React.FC = memo(() => {
  const loginUser: LoginUser = useAppSelector(selectUser);
  const [modal, setModal] = useState<boolean>(false);
  const [postImage, setPostImage] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [tagString, setTagString] = useState<string>("");
  const [upload, setUpload] = useState<boolean>(false);
  const navigate: NavigateFunction = useNavigate();
  const progress: "wait" | "run" | "done" = useBatch(
    upload,
    postImage,
    caption,
    tagString
  );

  const onChangeImageHandler: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = async (event) => {
    const file: File = event.target.files![0];
    if (["image/png", "image/jpeg"].includes(file.type) === true) {
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const processed: string = await resizeImage(reader.result as string);
        setPostImage(processed);
      };
    } else {
      alert("拡張子が「png」もしくは「jpg」の画像ファイルを選択してください。");
    }
    event.target.value = "";
  };

  const cancel = () => {
    if (postImage === "" && caption === "" && tagString === "") {
      navigate(-1);
    } else {
      setModal(true);
    }
  };

  useEffect(() => {
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
        setTimeout(() => {
          setUpload(false);
          navigate(-1);
        }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  return (
    <div className="md:flex md:justify-center w-screen h-screen bg-slate-100">
      <div className="relative sm:w-screen md:w-1/2 lg:w-1/3 h-full justify-center bg-white">
        {loginUser.uid === "" && <Navigate to="/login" replace={true} />}
        <div className="flex relative w-full h-12 justify-center items-center bg-white z-50">
          <button
            className="ml-2 align-middle"
            id="cancel"
            type="button"
            onClick={() => {
              cancel();
            }}
          >
            <CloseRounded />
          </button>
          <p className="w-16 mx-auto font-bold" id="title">
            新規登録
          </p>
        </div>
        <div>
          <img
            className="object-cover w-screen h-96"
            id="postPreview"
            src={
              postImage ? postImage : `${process.env.PUBLIC_URL}/noPhoto.png`
            }
            alt="投稿画像のプレビュー"
          />
          <label
            className="flex absolute justify-center items-center w-16 h-16 rounded-full -mt-20 right-8 text-slate-100 drop-shadow-md  bg-emerald-500 hover:bg-emerald-400"
            htmlFor="selectImage"
          >
            <AddToPhotosRounded fontSize="large" />
          </label>
          <input
            className="hidden"
            type="file"
            id="selectImage"
            accept="image/jpeg,image/png"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onChangeImageHandler(event);
            }}
          />
        </div>
        <div className="w-full p-4">
          <div className="mb-4">
            <p className="ml-2 text-sm">キャプション</p>
            <textarea
              className="w-full h-28 p-2 border-none rounded-md resize-none bg-slate-100"
              placeholder="タップして入力する"
              value={caption}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                setCaption(event.target.value);
              }}
            />
          </div>
          <div className="mb-4">
            <p className="ml-2 text-sm">タグ</p>
            <textarea
              className="w-full h-20 p-2 border-none rounded-md resize-none bg-slate-100"
              placeholder="タップして入力する"
              value={tagString}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                setTagString(event.target.value);
              }}
            />
          </div>
        </div>
        <div className="flex justify-center w-full">
          <button
            className="block w-24 h-8 border rounded-full font-bold border-emerald-500 text-emerald-500 hover:border-none hover:bg-emerald-500 hover:text-slate-100 disabled:border-slate-400 disabled:text-slate-400 disabled:bg-slate-300"
            disabled={!postImage || modal}
            onClick={() => {
              setUpload(true);
            }}
          >
            投稿する
          </button>
        </div>
        {progress === "run" && (
          <div id="modal">
            <p>画像をアップロード...</p>
          </div>
        )}
        {progress === "done" && (
          <div id="toast">
            <p>アップロードが完了しました!</p>
          </div>
        )}
      </div>
      {modal === true && (
        <div className="flex flex-col">
          <div className="flex flex-col fixed w-screen h-screen top-0 left-0   bg-slate-900/90">
            <p className="my-16 text-center text-slate-100 font-bold">
              投稿をキャンセルしますか？
            </p>
            <button
              className="w-36 mx-auto h-8 mb-8 border rounded-full font-bold border-red-500 text-red-500"
              onClick={() => {
                navigate(-1);
              }}
            >
              キャンセルする
            </button>
            <button
              className="block w-36 h-8 mb-8 mx-auto border rounded-full font-bold border-slate-100 text-slate-100"
              onClick={() => {
                setModal(false);
              }}
            >
              続ける
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default Upload;
