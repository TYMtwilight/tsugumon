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
  QuerySnapshot,
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
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [avatarImage, setAvatarImage] = useState<string>("");
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const [username, setUsername] = useState<{
    patternCheck: boolean;
    uniqueCheck: boolean;
    input: string;
  }>({
    patternCheck: true,
    uniqueCheck: true,
    input: "",
  });
  const address = useRef<HTMLInputElement>(null);
  const displayName = useRef<HTMLInputElement>(null);
  const introduction = useRef<HTMLTextAreaElement>(null);
  const owner = useRef<HTMLInputElement>(null);
  const typeOfWork = useRef<HTMLInputElement>(null);

  const navigate: NavigateFunction = useNavigate();
  const loginUser: LoginUser = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  let isMounted: boolean = true;

  const loginUserRef: DocumentReference<DocumentData> = doc(
    db,
    "users",
    `${loginUser.uid}`
  );

  const optionRef: DocumentReference<DocumentData> = doc(
    db,
    "option",
    `${loginUser.uid}`
  );

  const postsQuery = query(
    collection(db, "posts"),
    where("uid", "==", loginUser.uid)
  );

  const avatarRef: StorageReference = ref(storage, `avatars/${loginUser.uid}`);
  const backgroundRef: StorageReference = ref(
    storage,
    `backgrounds/${loginUser.uid}`
  );

  const getUser = async () => {
    setAvatarImage(loginUser.avatarURL);
    setBackgroundImage(loginUser.backgroundURL);
    setUsername({
      patternCheck: true,
      uniqueCheck: true,
      input: loginUser.username.slice(1),
    });
    displayName.current!.value = loginUser.displayName;
    introduction.current!.value = loginUser.introduction;

    getDoc(optionRef).then((optionSnap: DocumentSnapshot<DocumentData>) => {
      address.current!.value = optionSnap.data()!.address;
      owner.current!.value = optionSnap.data()!.owner;
      typeOfWork.current!.value = optionSnap.data()!.typeOfWork;
      setIsFetched(true);
    });
  };

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

  const handleSubmit = async () => {
    // NOTE >> getDownloadURL()を使ってStorageから画像のURLを取得することも
    //         検討しましたが、画像を削除する処理を行なった後、ふたたび
    //         プロフィール編集画面を開いた際に、useEffect内の処理（ステートに
    //         既存の画像URLを読み込む処理）で、必ずエラーが起きてしまうため、
    //         Reduxに保存している情報を読み込む形に変更しました。
    let avatarURL: string = "";
    if (avatarImage !== loginUser.avatarURL) {
      if (avatarImage) {
        await uploadString(avatarRef, avatarImage, "data_url");
        avatarURL = await getDownloadURL(avatarRef);
      } else {
        deleteObject(avatarRef);
      }
    } else {
      avatarURL = loginUser.avatarURL!;
    }

    let backgroundURL: string = "";
    if (backgroundImage !== loginUser.backgroundURL) {
      if (backgroundImage) {
        await uploadString(backgroundRef, backgroundImage, "data_url");
        backgroundURL = await getDownloadURL(backgroundRef);
      } else {
        deleteObject(backgroundRef);
      }
    } else {
      backgroundURL = loginUser.backgroundURL;
    }
    updateProfile(auth.currentUser!, {
      displayName: displayName.current!.value,
      photoURL: avatarURL,
    });
    dispatch(
      setUserProfile({
        avatarURL: avatarURL,
        backgroundURL: backgroundURL,
        displayName: displayName.current!.value,
        username: `@${username.input}`,
      })
    );
    updateDoc(loginUserRef, {
      avatarURL: avatarURL,
      backgroundURL: backgroundURL,
      displayName: displayName.current!.value,
      introduction: introduction.current!.value,
      username: `@${username.input}`,
    });
    updateDoc(optionRef, {
      address: address.current!.value,
      owner: address.current!.value,
      typeOfWork: typeOfWork.current!.value,
      username: `@${username.input}`,
    });
    getDocs(postsQuery)
      .then((posts: QuerySnapshot<DocumentData>) => {
        posts.forEach((post) => {
          const postRef = doc(db, "posts", post.id);
          updateDoc(postRef, {
            username: `@${username.input}`,
            displayName: displayName.current!.value,
            avatarURL: avatarURL,
          });
        });
      })
      .then(() => {
        getDoc(optionRef).then((userSnap: DocumentSnapshot<DocumentData>) => {
          setTimeout(() => {
            navigate(`/${userSnap.data()!.username}`);
          }, 300);
        });
      });
  };
  useEffect(() => {
    if (isMounted === false) {
      return;
    }
    getUser();
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetched]);

  return (
    <div>
      <div>
        <button
          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            event.preventDefault();
            navigate(-1);
          }}
        >
          戻る
        </button>
        <p>プロフィールの編集</p>
      </div>
      <form
        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <input
          id="avatarInput"
          type="file"
          accept="image/*"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            onChangeImageHandler(event, "avatar");
          }}
          hidden
        />
        <label htmlFor="avatarInput">写真を変更</label>
        <img
          src={
            avatarImage ? avatarImage : `${process.env.PUBLIC_URL}/noAvatar.png`
          }
          alt="アバター画像"
        />
        <button
          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            event.preventDefault();
            setAvatarImage("");
          }}
          disabled={!avatarImage}
        >
          <CloseRounded />
        </button>
        <input
          id="backgroundInput"
          type="file"
          accept="image/*"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            onChangeImageHandler(event, "background");
          }}
          hidden
        />
        <label htmlFor="backgroundInput">背景を選択</label>
        <img
          src={
            backgroundImage
              ? backgroundImage
              : `${process.env.PUBLIC_URL}/noPhoto.png`
          }
          alt="背景画像"
        />
        <button
          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            event.preventDefault();
            setBackgroundImage("");
          }}
          disabled={!backgroundImage}
        >
          <CloseRounded />
        </button>
        <p>ユーザー名</p>
        <input
          type="text"
          value={username.input}
          onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            const currentUsername: {
              patternCheck: boolean;
              uniqueCheck: boolean;
              input: string;
            } = await checkUsername(event.target.value);
            if (currentUsername.input === loginUser.username.slice(1)) {
              setUsername((prev) => {
                return {
                  input: currentUsername.input,
                  uniqueCheck: true,
                  patternCheck: currentUsername.patternCheck,
                };
              });
            } else {
              setUsername(currentUsername);
            }
          }}
        />
        <p>
          {username.uniqueCheck === false &&
            "既に使用されているユーザー名です。"}
        </p>
        <p>
          {username.patternCheck === false &&
            "入力できない文字が含まれいます。"}
        </p>
        <p>氏名</p>
        <input
          type="text"
          ref={displayName}
          defaultValue={loginUser.displayName}
        />
        <p>紹介文</p>
        <textarea ref={introduction} defaultValue={loginUser.introduction} />
        <p>事業主</p>
        <input type="text" ref={owner} />
        <p>職種</p>
        <input type="text" ref={typeOfWork} />
        <p>住所</p>
        <input type="text" ref={address} />
        <input
          type="submit"
          value="登録する"
          disabled={
            !displayName ||
            !username.patternCheck ||
            !username.uniqueCheck ||
            !username.input
          }
        />
      </form>
    </div>
  );
};

export default SettingBusiness;
