import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUser, updateUserProfile } from "../../features/userSlice";
import { auth, db, storage } from "../../firebase";
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
import { updateProfile } from "firebase/auth";

const EditProfileForEnterprise = () => {
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
  const userRef: DocumentReference<DocumentData> = doc(
    db,
    "users",
    `${user.uid}`
  );
  const avatarRef: StorageReference = ref(storage, `avatars/${user.uid}/`);
  const backgroundRef: StorageReference = ref(
    storage,
    `backgrounds/${user.uid}`
  );

  const getUser = async () => {
    const userSnap = await getDoc(userRef);
    if (userSnap) {
      setDisplayName(userSnap.data()!.displayName);
      setAvatarURL(userSnap.data()!.photoURL);
    }
  };
  const enterpriseRef: DocumentReference<DocumentData> = doc(
    db,
    "users",
    `${user.uid}`,
    "enterprise",
    `${user.uid}`
  );
  const getEnterprise = async () => {
    const enterpriseSnap = await getDoc(enterpriseRef);
    if (enterpriseSnap) {
      setIntroduction(enterpriseSnap.data()!.introduction);
      setBackgroundURL(enterpriseSnap.data()!.backgroundURL);
      setOwner(enterpriseSnap.data()!.owner);
      setTypeOfWork(enterpriseSnap.data()!.typeOfWork);
      setAddress(enterpriseSnap.data()!.address);
    }
  };

  useEffect(() => {
    console.log("useEffect is done!");
    getUser();
    getEnterprise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatarURL, backgroundURL]);

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
        updateUserProfile({
          displayName: displayName,
          photoURL: url,
        })
      );
    });
    setAvatarChange(false);
  };

  const uploadBackground: () => Promise<void> = async () => {
    await uploadBytesResumable(backgroundRef, backgroundImage!);
    await getDownloadURL(backgroundRef).then((url) => {
      setBackgroundURL(url);
      setDoc(enterpriseRef, { backgroundURL: url }, { merge: true });
    });
    setBackgroundChange(false);
  };

  const editProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit is called.");
    await setDoc(
      enterpriseRef,
      {
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
      console.log(auth.currentUser!);
    });
    dispatch(
      updateUserProfile({
        displayName: displayName,
        photoURL: avatarURL,
      })
    );
  };

  const deleteImage: (
    e: React.MouseEvent<HTMLButtonElement>,
    imageFor: "avatar" | "background"
  ) => void = (e, imageFor) => {
    e.preventDefault();
    const imageRef: StorageReference =
      imageFor === "avatar" ? avatarRef : backgroundRef;
    setDoc(userRef, { photoURL: "" }, { merge: true });
    setDoc(enterpriseRef, { backgroundURL: "" }, { merge: true });
    deleteObject(imageRef).then(() => {
      console.log(`${imageFor}画像を削除しました`);
    });
  };

  return (
    <div>
      <div>
        <div>
          <img
            id="backgroundPreview"
            data-testid="backgroundPreview"
            src={backgroundURL ? backgroundURL : ""}
            alt="ユーザーの背景画像"
          />
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              setDeleteBackground(true);
            }}
          >
            削除する
          </button>
          {deleteBackground && (
            <div>
              <p>現在登録されている画像を消去します。よろしいですか？</p>
              <button
                onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                  deleteImage(e, "background")
                }
              >
                はい
              </button>
              <button
                onClick={(e: React.MouseEvent) => {
                  setDeleteBackground(false);
                }}
              >
                いいえ
              </button>
            </div>
          )}
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
      <button
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          setDeleteAvatar(true);
        }}
      >
        削除する
      </button>
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
      <form name="form" onSubmit={editProfile}>
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
          <input type="submit" data-testid="submitProfile" value="登録する" />
        </div>
      </form>
    </div>
  );
};

export default EditProfileForEnterprise;
