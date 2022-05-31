import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUser, setUserProfile } from "../../features/userSlice";
import { auth, db, storage } from "../../firebase";
import { updateProfile } from "firebase/auth";
import {
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  setDoc,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  StorageReference,
  uploadBytesResumable,
} from "firebase/storage";

interface Props {
  closeEdit: () => void;
}

const EditBusinessUser: (props: Props) => JSX.Element = (props) => {
  const [username, setUsername] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [introduction, setIntroduction] = useState<string>("");
  const [avatarURL, setAvatarURL] = useState<string>("");
  const [avatarImage, setAvatarImage] = useState<ArrayBuffer | null>(null);
  const [avatarChange, setAvatarChange] = useState<boolean>(false);
  const [deleteAvatar, setDeleteAvatar] = useState<boolean>(false);
  const [backgroundImage, setBackgroundImage] = useState<ArrayBuffer | null>(
    null
  );
  const [backgroundURL, setBackgroundURL] = useState<string>("");
  const [backgroundChange, setBackgroundChange] = useState<boolean>(false);
  const [deleteBackground, setDeleteBackground] = useState<boolean>(false);
  const [owner, setOwner] = useState<string>("");
  const [typeOfWork, setTypeOfWork] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  // TODO >> 広告文の表示の有無を記録するステート「advertiseRef」を実装する。
  // const [advertiseRef, setAdvertiseRef] = useState<string>("");

  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const avatarRef: StorageReference = ref(storage, `avatars/${user.uid}/`);
  const backgroundRef: StorageReference = ref(
    storage,
    `backgrounds/${user.uid}`
  );
  const userRef: DocumentReference<DocumentData> = doc(
    db,
    "users",
    `${user.uid}`
  );
  const businessUserRef: DocumentReference<DocumentData> = doc(
    db,
    "users",
    `${user.uid}`,
    "businessUser",
    `${user.uid}`
  );
  const getUser = async () => {
    const userSnap = await getDoc(userRef);
    if (userSnap) {
      setDisplayName(userSnap.data()!.displayName);
      setAvatarURL(userSnap.data()!.photoURL);
    }
  };
  const getBusinessUser = async () => {
    const businessUserSnap = await getDoc(businessUserRef);
    if (businessUserSnap) {
      setUsername(businessUserSnap.data()!.username);
      setIntroduction(businessUserSnap.data()!.introduction);
      setBackgroundURL(businessUserSnap.data()!.backgroundURL);
      setOwner(businessUserSnap.data()!.owner);
      setTypeOfWork(businessUserSnap.data()!.typeOfWork);
      setAddress(businessUserSnap.data()!.address);
    }
  };

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("useEffectが実行されました");
    }
    getUser();
    getBusinessUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    await uploadBytesResumable(avatarRef, avatarImage!);
    await getDownloadURL(avatarRef).then((url) => {
      setAvatarURL(url);
      setDoc(userRef, { photoURL: url }, { merge: true });
      updateProfile(auth.currentUser!, {
        photoURL: url,
      });
      dispatch(
        setUserProfile({
          displayName: displayName,
          username: "",
          avatarURL: url,
        })
      );
    });
    setAvatarChange(false);
  };

  const uploadBackground: () => Promise<void> = async () => {
    await uploadBytesResumable(backgroundRef, backgroundImage!);
    await getDownloadURL(backgroundRef).then((url) => {
      setBackgroundURL(url);
      setDoc(businessUserRef, { backgroundURL: url }, { merge: true });
    });
    setBackgroundChange(false);
  };

  const editProfile: (
    e: React.FormEvent<HTMLFormElement>
  ) => Promise<void> = async (e) => {
    e.preventDefault();
    await setDoc(
      businessUserRef,
      {
        username: username,
        displayName: displayName,
        introduction: introduction,
        owner: owner,
        typeOfWork: typeOfWork,
        address: address,
      },
      { merge: true }
    );
    await setDoc(
      userRef,
      {
        displayName: displayName,
      },
      { merge: true }
    );
    await updateProfile(auth.currentUser!, {
      displayName: displayName,
    }).then(() => {
      if (process.env.NODE_ENV === "development") {
        console.log(auth.currentUser!);
      }
    });
    dispatch(
      setUserProfile({
        displayName: displayName,
        username: "",
        avatarURL: avatarURL,
      })
    );
    props.closeEdit();
  };

  const deleteImage: (
    e: React.MouseEvent<HTMLButtonElement>,
    imageFor: "avatar" | "background"
  ) => void = (e, imageFor) => {
    e.preventDefault();
    const imageRef: StorageReference =
      imageFor === "avatar" ? avatarRef : backgroundRef;
    imageFor === "avatar"
      ? setDoc(userRef, { photoURL: "" }, { merge: true })
      : setDoc(businessUserRef, { backgroundURL: "" }, { merge: true });
    deleteObject(imageRef).then(() => {
      if (process.env.NODE_ENV === "development") {
        console.log(`${imageFor}画像を削除しました`);
      }
      imageFor === "avatar" ? setAvatarURL("") : setBackgroundURL("");
      imageFor === "avatar" &&
        dispatch(
          setUserProfile({
            displayName: displayName,
            username: "",
            avatarURL: "",
          })
        );
      imageFor === "avatar"
        ? setDeleteAvatar(false)
        : setDeleteBackground(false);
    });
  };

  return (
    <div>
      <header>
        <button id="cancel" onClick={props.closeEdit}>
          キャンセルする
        </button>
        <p>編集画面</p>
      </header>
      <div id="backgroundSection">
        <div>
          <img
            id="backgroundPreview"
            data-testid="backgroundPreview"
            src={backgroundURL}
            alt="ユーザーの背景画像"
          />
          <input
            type="file"
            id="backgroundImage"
            accept="image/png,image/jpeg"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onChangeImageHandler(e, "background");
            }}
          />
          <label htmlFor="backgroundImage">背景画像を選択</label>
        </div>
        {backgroundURL && (
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              setDeleteBackground(true);
            }}
          >
            削除する
          </button>
        )}
        {backgroundChange && (
          <div id="backgroundChangeModal">
            <p>背景画像を登録しますか？</p>
            <p>画像を変更した場合、元の画像は削除されます</p>
            <button onClick={uploadBackground}>はい</button>
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                setBackgroundImage(null);
                setBackgroundChange(false);
              }}
            >
              いいえ
            </button>
          </div>
        )}
        {deleteBackground && (
          <div id="backgroundDeleteModal">
            <p>現在登録されている背景画像を消去します。よろしいですか？</p>
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                deleteImage(e, "background")
              }
            >
              はい
            </button>
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                setDeleteBackground(false);
              }}
            >
              いいえ
            </button>
          </div>
        )}
      </div>
      <div id="avatarSection">
        <div>
          <img
            id="avatar"
            data-testid="avatar"
            src={
              avatarURL ? avatarURL : `${process.env.PUBLIC_URL}/noAvatar.png`
            }
            alt="ユーザーのアバター画像"
          />
          <label htmlFor="selectAvatarImage" data-testid="labelForAvatar">
            アバター画像を選択
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
        </div>
        {avatarURL && (
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              setDeleteAvatar(true);
            }}
          >
            削除する
          </button>
        )}
        {avatarChange && (
          <div id="avatarChangeModal">
            <p>アバター画像を登録しますか？</p>
            <p>画像を変更した場合、元の画像は削除されます</p>
            <button onClick={uploadAvatar}>はい</button>
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                setAvatarImage(null);
                setAvatarChange(false);
              }}
            >
              いいえ
            </button>
          </div>
        )}
        {deleteAvatar && (
          <div>
            <p>現在登録されている画像を消去します。よろしいですか？</p>
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                deleteImage(e, "avatar")
              }
            >
              はい
            </button>
            <button
              onClick={(e: React.MouseEvent) => {
                setDeleteAvatar(false);
              }}
            >
              いいえ
            </button>
          </div>
        )}
      </div>
      <form name="form" onSubmit={editProfile}>
        <div>
          {" "}
          <label htmlFor="username" data-testid="username">
            ユーザー名
          </label>
          <input
            name="textbox"
            type="text"
            id="username"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setUsername(e.target.value);
            }}
            required
          />
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
          <input type="submit" data-testid="submitProfile" value="登録する" />
        </div>
      </form>
    </div>
  );
};

export default EditBusinessUser;
