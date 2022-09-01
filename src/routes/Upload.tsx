import React, { useEffect, useState, memo } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { useBatch } from "../hooks/useBatch";
import { resizeImage } from "../functions/ResizeImage";
import CloseRounded from "@mui/icons-material/CloseRounded";
import AddToPhotosRounded from "@mui/icons-material/AddToPhotosRounded";


const Upload: React.FC = memo(() => {
  const [modal, setModal] = useState<boolean>(false);
  const [postImage, setPostImage] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [upload, setUpload] = useState<boolean>(false);
  const navigate: NavigateFunction = useNavigate();
  const progress: "wait" | "run" | "done" = useBatch(
    upload,
    postImage,
    caption
  );

  const onChangeImageHandler: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = async (event) => {
    event.preventDefault();
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
    if (postImage === "" && caption === "" && tag === "") {
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
    <div className="w-screen  bg-slate-100">
      <div className="flex relative  h-12 justify-center items-center">
        <button
          className="absolute left-2"
          id="cancel"
          type="button"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            cancel();
          }}
        >
          <CloseRounded />
        </button>
        <p className="w-16 mx-auto font-bold" id="title">
          新規登録
        </p>
      </div>
      <form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          setUpload(true);
        }}
      >
        <div className="relative w-auto h-auto">
          <img
            className="object-cover w-screen h-96"
            id="postPreview"
            src={
              postImage ? postImage : `${process.env.PUBLIC_URL}/noPhoto.png`
            }
            alt="投稿画像のプレビュー"
          />
          <label
            className="flex absolute justify-center items-center w-16 h-16 right-4 bottom-4 rounded-full text-slate-100 drop-shadow-md  bg-emerald-500 hover:bg-emerald-400"
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
        <div className="w-screen p-4">
          <div className="mb-4">
            <p className="ml-2 text-sm">キャプション</p>
            <textarea
              className="w-full h-40 p-2 border-none rounded-md resize-none"
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
              className="w-full h-32 p-2 border-none rounded-md resize-none"
              placeholder="タップして入力する"
              value={tag}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                setTag(event.target.value);
              }}
            />
          </div>
        </div>
        <div>
          <input
            className="block w-24 h-8 m-auto border rounded-full font-bold border-emerald-500 text-emerald-500 hover:border-none hover:bg-emerald-500 hover:text-slate-100 disabled:border-slate-400 disabled:text-slate-400 disabled:bg-slate-300"
            id="submit"
            type="submit"
            value="投稿する"
            disabled={!postImage || modal}
          />
        </div>
      </form>
      <footer className="h-48" />
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

      {modal === true && (
        <div className="flex flex-col">
          <div className="flex flex-col fixed w-screen h-screen top-0 left-0   bg-slate-900/90">
            <p className="my-16 text-center text-slate-100 font-bold">
              投稿をキャンセルしますか？
            </p>
            <button
              className="w-36 mx-auto h-8 mb-8 border rounded-full font-bold border-red-500 text-red-500"
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                event.preventDefault();
                navigate(-1);
              }}
            >
              キャンセルする
            </button>
            <button
              className="block w-36 h-8 mb-8 mx-auto border rounded-full font-bold border-slate-100 text-slate-100"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
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
