import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUser, updateUserProfile } from "../../features/userSlice";
import { auth, db, storage } from "../../firebase";
import {
  doc,
  DocumentData,
  DocumentReference,
  setDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  StorageReference,
  uploadBytesResumable,
} from "firebase/storage";
import { updateProfile } from "firebase/auth";

const EditProfileForEnterprise = () => {
  const [introduction, setIntroduction] = useState<string>("");
  const [backgroundImage, setBackgroundImage] = useState<ArrayBuffer | null>(
    null
  );
  const [backgroundURL, setBackgroundURL] = useState<string>("");
  const [backgroundChange, setBackgroundChange] = useState<boolean>(false);
  const [avatarImage, setAvatarImage] = useState<ArrayBuffer | null>(null);
  const [avatarURL, setAvatarURL] = useState<string>("");
  const [avatarChange, setAvatarChange] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>("");
  const [owner, setOwner] = useState<string>("");
  const [typeOfWork, setTypeOfWork] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  // TODO >> 広告文の表示の有無を記録するステート「advertiseRef」を実装する。
  // const [advertiseRef, setAdvertiseRef] = useState<string>("");

  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const userRef: DocumentReference<DocumentData> = doc(
    db,
    "users",
    `${user.uid}`
  );
  const enterpriseRef: DocumentReference<DocumentData> = doc(
    db,
    "users",
    `${user.uid}`,
    "enterprise",
    `${user.uid}`
  );

  const onChangeImageHandler: (
    e: React.ChangeEvent<HTMLInputElement>,
    imageFor: "avatar" | "background"
  ) => void = async (e, imageFor) => {
    const file: File = e.target.files![0];
    const reader: FileReader = new FileReader();
    reader.addEventListener("load", () => {
      if (reader.result) {
        const arrayBuffer: ArrayBuffer = reader.result as ArrayBuffer;
        if (imageFor === "avatar") {
          setAvatarImage(arrayBuffer);
          setAvatarChange(true);
        } else {
          setBackgroundImage(arrayBuffer);
          setBackgroundChange(true);
        }
      }
    });
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };
  const uploadAvatar: () => Promise<void> = async () => {
    const imageRef: StorageReference = ref(storage, `avatars/${user.uid}/`);
    await uploadBytesResumable(imageRef, avatarImage!);
    await getDownloadURL(imageRef).then((url) => {
      setAvatarURL(url);
      setDoc(userRef, { avatarURL: url }, { merge: true });
      setDoc(enterpriseRef, { avatarURL: url }, { merge: true });
      updateProfile(auth.currentUser!, {
        photoURL: url,
      });
      dispatch(
        updateUserProfile({
          displayName: displayName,
          photoURL: url,
        })
      );
    });
    setAvatarChange(false);
  };

  const uploadBackground: () => Promise<void> = async () => {
    const imageRef: StorageReference = ref(storage, `backgrounds/${user.uid}/`);
    await uploadBytesResumable(imageRef, backgroundImage!);
    await getDownloadURL(imageRef).then((url) => {
      setBackgroundURL(url);
      setDoc(enterpriseRef, { backgroundURL: url }, { merge: true });
    });
    setBackgroundChange(false);
  };

  return (
    <div>
      <div>
        <div>
          <img
            id="backgroundPreview"
            data-testid="backgroundPreview"
            src={backgroundURL}
            alt="ユーザーの背景画像"
          />
        </div>
      </div>
      <label htmlFor="backgroundImage">
        <button>背景画像を選択</button>
      </label>
      {backgroundChange && (
        <button onClick={uploadBackground}>画像を変更する</button>
      )}
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
          src={avatarURL ? avatarURL : `${process.env.PUBLIC_URL}/noAvatar.png`}
          alt="ユーザーのアバター画像"
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
            onClick={(e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {}}
          />
        </div>
      </form>
    </div>
  );
};

export default EditProfileForEnterprise;
