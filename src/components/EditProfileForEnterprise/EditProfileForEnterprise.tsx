import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/userSlice";
import { db, storage } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { AddAPhoto, Landscape, ReadMoreRounded } from "@mui/icons-material";

const EditProfileForEnterprise = () => {
  const [introduction, setIntroduction] = useState<string>("");
  const [backgroundImage, setBackgroundImage] = useState<Blob | null>(null);
  const [backgroundURL, setBackgroundURL] = useState<string>("");
  const [backgroundDraft, setBackgroundDraft] = useState<string>("");
  const [avatarImage, setAvatarImage] = useState<Blob | null>(null);
  const [avatarDraft, setAvatarDraft] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [owner, setOwner] = useState<string>("");
  const [typeOfWork, setTypeOfWork] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  // TODO >> 広告文の表示の有無を記録するステート「advertiseRef」を実装する。
  // const [advertiseRef, setAdvertiseRef] = useState<string>("");

  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const onChangeAvatarImage: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void = (e) => {
    const onChangeImageHandler: (
      e: React.ChangeEvent<HTMLInputElement>,
      imageFor: "avatar" | "background"
    ) => void = async (e, imageFor) => {
      const file: File = e.target.files![0];
      const reader: FileReader = new FileReader();
      reader.addEventListener("load", () => {
        if (reader.result) {
          const arrayBuffer: ArrayBuffer = reader.result as ArrayBuffer;
          const imageBlob: Blob = new Blob([arrayBuffer]);
          setAvatarImage(imageBlob);
        }
      });
      // NOTE >> 利用中のブラウザがBlobURLSchemeをサポートしていない場合は
      //         処理を中断します。
      if (!window.URL) return;
      const blobURL: string = window.URL.createObjectURL(file);
      setAvatarDraft(blobURL);
      reader.readAsArrayBuffer(file);
      e.target.value = "";
    };

    const onChangeBackgroundImage: (
      e: React.ChangeEvent<HTMLInputElement>
    ) => void = (e) => {
      const file: File = e.target.files![0];
      const reader: FileReader = new FileReader();
      reader.addEventListener("load", () => {
        if (reader.result) {
          const arrayBuffer: ArrayBuffer = reader.result as ArrayBuffer;
          const imageBlob: Blob = new Blob([arrayBuffer]);
          setBackgroundImage(imageBlob);
        }
      });
      // NOTE >> 利用中のブラウザがBlobURLSchemeをサポートしていない場合は
      //         処理を中断します。
      if (!window.URL) return;
      const blobURL: string = window.URL.createObjectURL(file);
      setBackgroundDraft(blobURL);
      reader.readAsArrayBuffer(file);
      e.target.value = "";
    };

    return (
      <div>
        <div>
          <div>
            <img
              id="backgroundDraft"
              data-testid="backgroundDraft"
              src={backgroundDraft}
              alt="ユーザーの背景画像"
            />
          </div>
        </div>
        <label htmlFor="backgroundImage">
          <button>背景画像を選択</button>
        </label>
        <input
          type="file"
          id="backgroundImage"
          accept="image/png,image/jpeg"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            onChangeBackgroundImage(e);
          }}
        />
      </label>
      {avatarChange && <button onClick={uploadAvatar}>画像を変更する</button>}
      <input
        type="file"
        id="selectAvatarImage"
        data-testid="selectAvatarImage"
        accept="image/png,image/jpeg"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onChangeImageHandler(e, "avatar");
        }}
      />
      <form name="form">
        <div>
          <label htmlFor="displayName" data-testid="displayName">
            会社名
          </label>
          <input
            name="textbox"
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setDisplayName(e.target.value);
            }}
            required
          />
        </div>
        <div>
          <label htmlFor="introduction" data-testid="introduction">
            紹介文
          </label>
          <textarea
            id="introduction"
            value={introduction}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setIntroduction(e.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor="owner">事業主</label>
          <input
            name="textbox"
            type="text"
            id="owner"
            value={owner}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setOwner(e.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor="typeOfWork">職種</label>
          <input
            name="textbox"
            type="text"
            id="address"
            value={typeOfWork}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setTypeOfWork(e.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor="address">住所</label>
          <input
            name="textbox"
            type="text"
            id="address"
            value={address}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setAddress(e.target.value);
            }}
          />
        </div>
        <div>
          <input
            type="submit"
            data-testid="submitProfile"
            value="登録する"
            onClick={(e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
              // TODO >> inputフォームの編集内容をFirebaseに登録する処理の実装
            }}
          />
        </label>
        <input
          type="file"
          id="selectAvatarImage"
          data-testid="selectAvatarImage"
          accept="image/png,image/jpeg"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            onChangeAvatarImage(e);
          }}
        />
        <form name="form">
          <div>
            <label htmlFor="displayName" data-testid="displayName">
              会社名
            </label>
            <input
              name="textbox"
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setDisplayName(e.target.value);
              }}
              required
            />
          </div>
          <div>
            <label htmlFor="introduction" data-testid="introduction">
              紹介文
            </label>
            <textarea
              id="introduction"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setIntroduction(e.target.value);
              }}
            >
              {introduction}
            </textarea>
          </div>
          <div>
            <label htmlFor="owner">事業主</label>
            <input
              name="textbox"
              type="text"
              id="owner"
              value={owner}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setOwner(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="typeOfWork">職種</label>
            <input
              name="textbox"
              type="text"
              id="address"
              value={typeOfWork}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setTypeOfWork(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="address">住所</label>
            <input
              name="textbox"
              type="text"
              id="address"
              value={address}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setAddress(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              type="submit"
              data-testid="submitProfile"
              value="登録する"
              onClick={(
                e: React.MouseEvent<HTMLInputElement, MouseEvent>
              ) => {}}
            />
          </div>
        </form>
      </div>
    );
  };
};

export default EditProfileForEnterprise;
