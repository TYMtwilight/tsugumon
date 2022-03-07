import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUser, updateUserProfile } from "../../features/userSlice";
import { auth, db, storage } from "../../firebase";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { AddAPhoto, Landscape, ReadMoreRounded } from "@mui/icons-material";

const getRandomCharactor: () => string = () => {
  const S: string =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const N: number = 16;
  const randomValues: number[] = Array.from(
    crypto.getRandomValues(new Uint32Array(N))
  );
  const randomCharactor: string = randomValues
    .map((n) => S[n % S.length])
    .join("");
  return randomCharactor;
};

const EditBusinessUser = () => {
  const [displayName, setDisplayName] = useState<string>("");
  // NOTE >> avatarImage : Storage保存用のBlobデータ
  const [avatarImage, setAvatarImage] = useState<Blob | null>(null);
  // NOTE >> avatarURL : Storageに保存されている画像のDownloadURL
  const [avatarURL, setAvatarURL] = useState<string>("");
  // NOTE >> avatarPreview : プレビュー画像のURL
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [avatarChange, setAvatarChange] = useState<boolean>(false);
  // NOTE >> backgroundImage : Storage保存用のBlobデータ
  const [backgroundImage, setBackgroundImage] = useState<Blob | null>(null);
  // NOTE >> backgroundURL : Storageに保存されている画像のDownloadURL
  const [backgroundURL, setBackgroundURL] = useState<string>("");
  // NOTE >> backgroundPreview : プレビュー画像のURL
  const [backgroundPreview, setBackgroundPreview] = useState<string>("");
  const [backgroundChange, setBackgroundChange] = useState<boolean>(false);
  const [introduction, setIntroduction] = useState<string>("");
  const [owner, setOwner] = useState<string>("");
  const [typeOfWork, setTypeOfWork] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  // TODO >> 広告文の表示の有無を記録するステート「advertiseRef」を実装する
  // const [advertiseRef, setAdvertiseRef] = useState<string>("");

  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const onChangeImageHandler: (
    e: React.ChangeEvent<HTMLInputElement>,
    imageFor: "avatar" | "background"
  ) => void = (e, imageFor) => {
    const file: File = e.target.files![0];
    const reader: FileReader = new FileReader();
    reader.addEventListener("load", () => {
      if (reader.result) {
        const arrayBuffer: ArrayBuffer = reader.result as ArrayBuffer;
        const blob: Blob = new Blob([arrayBuffer]);
        imageFor === "avatar" && setAvatarImage(blob);
        imageFor === "background" && setBackgroundImage(blob);
      }
    });
    // NOTE >> 利用中のブラウザがBlobURLSchemeをサポートしていない場合は
    //         処理を中断
    if (!window.URL) return;
    const blobURL: string = URL.createObjectURL(file);
    imageFor === "avatar" && setAvatarPreview(blobURL);
    imageFor === "background" && setBackgroundPreview(blobURL);

    reader.readAsArrayBuffer(file);

    imageFor === "avatar" && setAvatarChange(true);
    imageFor === "background" && setBackgroundChange(true);
    e.target.value = "";
  };

  // NOTE >> 画像をStorageに登録し、URLを取得
  const uploadImage = async (imageFor: "avatar" | "background", blob: Blob) => {
    const folder = `${imageFor}s`;
    const filename: string = getRandomCharactor();
    const fileRef = ref(storage, `${folder}/${filename}`);
    await uploadBytes(fileRef, blob);
    await getDownloadURL(fileRef).then((url) => {
      imageFor === "avatar" && setAvatarURL(url);
      imageFor === "background" && setBackgroundURL(url);
    });
  };

  const submit = async (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    e.preventDefault();
    // NOTE >> 変更前の画像をStorageから削除
    if (avatarChange && avatarURL) {
      deleteObject(ref(storage, avatarURL));
    } else if (backgroundChange && backgroundURL) {
      deleteObject(ref(storage, backgroundURL));
    }

    avatarImage && uploadImage("avatar", avatarImage);
    backgroundImage && uploadImage("background", backgroundImage);

    // NOTE >> AuthにdisplayNameとavatarURLを登録
    await updateProfile(auth.currentUser!, {
      displayName: displayName,
      photoURL: avatarURL,
    });

    // NOTE >> reduxのuserSliceを更新
    dispatch(
      updateUserProfile({
        displayName: displayName,
        photoURL: avatarURL,
      })
    );

    // NOTE >> Firestoreにユーザードキュメントを作成
    const businessUserRef = doc(
      db,
      "users",
      `${user.uid}`,
      "businessUser",
      `${user.uid}`
    );
    setDoc(
      businessUserRef,
      {
        displayName: displayName,
        avatarURL: avatarURL,
        backgroundURL: backgroundURL,
        introduction: introduction,
        typeOfWork: typeOfWork,
        owner: owner,
        address: address,
      },
      { merge: true }
    );
  };

  // NOTE >> 変更前の背景画像をStorageから削除

  return (
    <div>
      <div>
        <div>
          {backgroundPreview && (
            <img
              id="backgroundPreview"
              data-testid="backgroundPreview"
              src={backgroundPreview}
              alt="ユーザーの背景画像"
            />
          )}
        </div>
      </div>
      <label htmlFor="backgroundImage">
        <Landscape />
        背景画像を選択
      </label>
      <input
        type="file"
        id="backgroundImage"
        accept="image/png,image/jpeg"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onChangeImageHandler(e, "background");
        }}
      />
      <label htmlFor="selectAvatarImage" data-testid="labelForAvatar">
        <img
          id="avatar"
          data-testid="avatar"
          src={
            avatarPreview
              ? avatarPreview
              : `${process.env.PUBLIC_URL}/noAvatar.png`
          }
          alt="ユーザーのアバター画像"
        />
      </label>
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
            onClick={submit}
          />
        </div>
      </form>
    </div>
  );
};
export default EditBusinessUser;
