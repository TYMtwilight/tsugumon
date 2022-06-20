import React, { useEffect, useState, memo } from "react";
import { useAppSelector } from "../app/hooks";
import { selectUser, User } from "../features/userSlice";
import { useBatch } from "../hooks/useBatch";
import { AddPhotoAlternate, Cancel } from "@mui/icons-material";

const Upload: React.FC = memo(() => {
  const user: User = useAppSelector(selectUser);
  const displayName: string = user.displayName;
  const avatarURL: string = user.avatarURL;
  const types: string[] = ["image/png", "image/jpeg"];
  const [postImage, setPostImage] = useState<ArrayBuffer | null>(null);
  const [postPreview, setPostPreview] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [upload, setUpload] = useState<boolean>(false);
  const [cancelModal, setCancelModal] = useState<boolean>(false);
  const progress: "wait" | "run" | "done" = useBatch(
    upload,
    postImage!,
    caption
  );

  const onChangeImageHandler: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = (event) => {
    const file: File = event.target.files![0];
    const reader: FileReader = new FileReader();
    if (types.includes(file.type)) {
      reader.addEventListener("load", () => {
        const arrayBuffer: ArrayBuffer = reader.result as ArrayBuffer;
        setPostImage(arrayBuffer);
      });
      // NOTE >> 利用中のブラウザが、BlobURLSchemeをサポートしている場合は、ステートにblobURLを保存します
      if (window.URL) {
        setPostPreview(window.URL.createObjectURL(file));
      }
      reader.readAsArrayBuffer(file);
    } else {
      alert("拡張子が「png」もしくは「jpg」の画像ファイルを選択してください。");
    }
    event.target.value = "";
  };

  const resetImage: (event: React.MouseEvent<HTMLButtonElement>) => void = (
    event
  ) => {
    event.preventDefault();
    window.URL.revokeObjectURL(postPreview);
    setPostImage(null);
    setPostPreview("");
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
          window.history.back();
        }, 2000);
    }
  }, [progress]);

  return (
    <div>
      <header>
        <button
          id="cancel"
          type="button"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            setCancelModal(true);
          }}
        >
          キャンセルする
        </button>
        <p id="title">新規登録</p>
      </header>
      <div>
        <img id="avatar" src={avatarURL} alt="ユーザーのアバター画像" />
        <p id="displayName">{displayName}</p>
      </div>
      <form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          setUpload(true);
        }}
      >
        <div id="imageSection">
          <img
            id="postPreview"
            src={
              postPreview
                ? postPreview
                : `${process.env.PUBLIC_URL}/noPhoto.png`
            }
            alt="投稿画像のプレビュー"
          />
          <button onClick={resetImage} disabled={!postImage}>
            <Cancel />
          </button>
          <label htmlFor="selectImage">
            <AddPhotoAlternate />
          </label>
          <label htmlFor="selectImage">画像を選択する</label>
          <input
            type="file"
            id="selectImage"
            accept="image/jpeg,image/png"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onChangeImageHandler(event);
            }}
          />
        </div>
        <div id="captionSection">
          <p>キャプション</p>
          <textarea
            placeholder="タップして入力する"
            value={caption}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setCaption(e.target.value);
            }}
          />
        </div>
        <input
          id="submit"
          type="submit"
          value="投稿する"
          disabled={!postImage}
        />
        <button
          id="cancel"
          type="button"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            setCancelModal(true);
          }}
        >
          キャンセルする
        </button>
      </form>
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
      {cancelModal && (
        <div id="cancelModal">
          <p>画像の登録をキャンセルします。よろしいですか？</p>
          <button
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              window.history.back();
            }}
          >
            はい
          </button>
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              setCancelModal(false);
            }}
          >
            いいえ
          </button>
        </div>
      )}
    </div>
  );
});

export default Upload;
