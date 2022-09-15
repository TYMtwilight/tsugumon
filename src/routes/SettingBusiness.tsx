import React, { useRef, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectUser, LoginUser, setUserProfile } from "../features/userSlice";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import { updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  getDocs,
  query,
  Query,
  QuerySnapshot,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  StorageReference,
  uploadString,
} from "firebase/storage";
import { resizeImage } from "../functions/ResizeImage";
import { checkUsername } from "../functions/CheckUsername";
import CloseRounded from "@mui/icons-material/CloseRounded";

const SettingBusiness = () => {
  const [avatarImage, setAvatarImage] = useState<string>(
    `${process.env.PUBLIC_URL}/noAvatar.png}`
  );
  const [backgroundImage, setBackgroundImage] = useState<string>(
    `${process.env.PUBLIC_URL}/noPhoto.png`
  );
  const [backgroundURL, setBackgroundURL] = useState<string>("");
  const displayName = useRef<HTMLInputElement>(null);
  const introduction = useRef<HTMLTextAreaElement>(null);
  const loginUser: LoginUser = useAppSelector(selectUser);

  const navigate: NavigateFunction = useNavigate();

  let isMounted: boolean = true;

  const onChangeImageHandler: (
    event: React.ChangeEvent<HTMLInputElement>,
    imageFor: "avatar" | "background"
  ) => void = (event, imageFor) => {
    const file: File = event.target.files![0];
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const processed: string = await resizeImage(reader.result as string);
      if (imageFor === "avatar") {
        setAvatarImage(processed);
      } else if (imageFor === "background") {
        setBackgroundImage(processed);
      } else {
        return;
      }
    };
    reader.onerror = () => {
      if (process.env.NODE_ENV === "development") {
        console.log(reader.error);
      }
    };
  };
  const handleSubmit = () => {
    console.log(`紹介文:${introduction.current?.value}\nアバター画像`);
  };

  const loginUserRef: DocumentReference<DocumentData> = doc(
    db,
    "users",
    `${loginUser.uid}`
  );

  useEffect(() => {
    if (isMounted === false) {
      return;
    }
    setAvatarImage(loginUser.avatarURL);
    getDoc(loginUserRef).then(
      (userSnapshot: DocumentSnapshot<DocumentData>) => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setBackgroundURL(userSnapshot.data()!.backgroundURL);
        setBackgroundImage(userSnapshot.data()!.backgroundURL);
      }
    );
  }, []);

  return (
    <div>
      <button
        onClick={(event) => {
          event.preventDefault();
          navigate(-1);
        }}
      >
        戻る
      </button>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            onChangeImageHandler(event, "avatar");
          }}
        />
        <img src={avatarImage} alt="アバター画像" />
        <button
          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            event.preventDefault();
            avatarImage === loginUser.avatarURL
              ? setAvatarImage(`${process.env.PUBLIC_URL}/noAvatar.png`)
              : setAvatarImage(loginUser.avatarURL);
          }}
          disabled={avatarImage === `${process.env.PUBLIC_URL}/noAvatar.png`}
        >
          <CloseRounded />
        </button>
        <input
          type="file"
          accept="image/*"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            onChangeImageHandler(event, "background");
          }}
        />
        <img src={backgroundImage} alt="背景画像" />
        <button
          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            event.preventDefault();
            backgroundImage === backgroundURL
              ? setBackgroundImage(`${process.env.PUBLIC_URL}/noPhoto.png`)
              : setBackgroundImage(backgroundURL);
          }}
          disabled={backgroundImage === `${process.env.PUBLIC_URL}/noPhoto.png`}
        >
          <CloseRounded />
        </button>
        <input
          type="text"
          ref={displayName}
          defaultValue={loginUser.displayName}
        />
        <textarea ref={introduction} defaultValue={loginUser.introduction} />
        <input type="submit" value="登録する" />
      </form>
    </div>
  );
};

export default SettingBusiness;
