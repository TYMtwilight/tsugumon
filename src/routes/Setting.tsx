import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectUser, setUserProfile } from "../features/userSlice";
import { auth, db, storage } from "../firebase";
import { updateProfile } from "firebase/auth";
import {
  doc,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  setDoc,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  StorageReference,
  uploadString,
} from "firebase/storage";

const Setting: React.VFC = () => {
  const [avatarImage, setAvatarImage] = useState<string>("");
  const [avatarURL, setAvatarURL] = useState<string>("");
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const [backgroundURL, setBackgroundURL] = useState<string>("");
  const [birthdate, setBirthdate] = useState<string>("");
  const [deleteAvatar, setDeleteAvatar] = useState<boolean>(false);
  const [deleteBackground, setDeleteBackground] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>("");
  const [introduction, setIntroduction] = useState<string>("");
  const [skill, setSkill] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [userType, setUserType] = useState<"business" | "normal" | null>(null);
  const [address, setAddress] = useState<string>("");
  const [owner, setOwner] = useState<string>("");
  const [typeOfWork, setTypeOfWork] = useState<string>("");

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
  const optionRef: DocumentReference<DocumentData> = doc(
    db,
    "option",
    `${user.uid}`
  );

  const getProfile = async (isMounted: boolean) => {
    if (isMounted === false) {
      return;
    }
    await getDoc(userRef)
      .then((userSnapshot: DocumentSnapshot<DocumentData>) => {
        setAvatarURL(user.avatarURL);
        setBackgroundURL(userSnapshot.data()!.backgroundURL);
        setDisplayName(user.displayName);
        setIntroduction(userSnapshot.data()!.introduction);
        setUsername(user.username);
        setUserType(user.userType);
      })
      .catch((error: any) => {
        if (process.env.NODE_ENV === "development") {
          console.log(`エラーが発生しました:${error}`);
        }
      });
    await getDoc(optionRef)
      .then((optionSnapshot: DocumentSnapshot<DocumentData>) => {
        setAddress(optionSnapshot.data()!.address);
        setBirthdate(optionSnapshot.data()!.birthdate);
        setOwner(optionSnapshot.data()!.owner);
        setSkill(optionSnapshot.data()!.skill);
        setTypeOfWork(optionSnapshot.data()!.typeOfWork);
      })
      .catch((error: any) => {
        if (process.env.NODE_ENV === "development") {
          console.log(`エラーが発生しました:${error}`);
        }
      });
  };

  useEffect(() => {
    let isMounted: boolean = true;
    getProfile(isMounted);
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeImageHandler: (
    event: React.ChangeEvent<HTMLInputElement>,
    imageFor: "avatar" | "background"
  ) => void = async (event, imageFor) => {
    event.preventDefault();
    const file: File = event.target.files![0];
    if (["image/png", "image/jpeg"].includes(file.type) === true) {
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const imgElement: HTMLImageElement = new Image();
        const original: string = reader.result as string;
        imgElement.src = original;
        imgElement!.onload = () => {
          const canvas: HTMLCanvasElement = document.createElement("canvas");
          const MAX_WIDTH: number = 640;
          const IMG_WIDTH: number = imgElement.naturalWidth;
          const IMG_HEIGHT: number = imgElement.naturalHeight;
          const SCALING: number = MAX_WIDTH / IMG_WIDTH;
          canvas.width = MAX_WIDTH;
          canvas.height = IMG_HEIGHT * SCALING;
          const context: CanvasRenderingContext2D = canvas.getContext("2d")!;
          context.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
          const compressed: string = context.canvas.toDataURL();
          const result: string = [original, compressed].sort(
            (a: string, b: string) => a.length - b.length
          )[0];
          if (imageFor === "avatar") {
            setAvatarImage(result);
          } else {
            setBackgroundImage(result);
          }
        };
      };
      reader.onerror = () => {
        if (process.env.NODE_ENV === "development") {
          console.log(reader.error);
        }
      };
    }
  };

  const uploadAvatar: () => Promise<void> = async () => {
    if (avatarImage) {
      await uploadString(avatarRef, avatarImage, "data_url");
      await getDownloadURL(avatarRef).then((url: string) => {
        setAvatarURL(url);
        setDoc(userRef, { photoURL: url }, { merge: true });
        updateProfile(auth.currentUser!, {
          photoURL: url,
        });
        dispatch(
          setUserProfile({
            displayName: displayName,
            username: username,
            avatarURL: url,
          })
        );
      });
      setAvatarImage("");
    } else {
      return;
    }
  };

  const uploadBackground: () => Promise<void> = async () => {
    if (backgroundImage) {
      await uploadString(backgroundRef, backgroundImage, "data_url");
      await getDownloadURL(backgroundRef).then((url: string) => {
        setBackgroundURL(url);
        setDoc(userRef, { backgroundURL: url }, { merge: true });
      });
      setBackgroundImage("");
    } else {
      return;
    }
  };

  const editProfile: (
    event: React.FormEvent<HTMLFormElement>
  ) => Promise<void> = async (event) => {
    event.preventDefault();
    await setDoc(
      userRef,
      {
        avatarURL: avatarURL,
        backgroundURL: backgroundURL,
        displayNamevent: displayName,
        introduction: introduction,
        usernamevent: username,
      },
      { merge: true }
    )
      .then(() => {
        dispatch(
          setUserProfile({
            displayName: displayName,
            username: username,
            avatarURL: avatarURL,
          })
        );
      })
      .catch((error) => {
        if (process.env.NODE_ENV === "development") {
          console.log(error);
        }
      });

    await setDoc(
      optionRef,
      {
        owner: owner,
        typeOfWork: typeOfWork,
        address: address,
      },
      { merge: true }
    ).catch((error) => {
      if (process.env.NODE_ENV === "development") {
        console.log(error);
      }
    });
    window.history.back();
  };

  const deleteImage: (
    event: React.MouseEvent<HTMLButtonElement>,
    imageFor: "avatar" | "background"
  ) => void = (e, imageFor) => {
    e.preventDefault();
    const imageRef: StorageReference =
      imageFor === "avatar" ? avatarRef : backgroundRef;
    imageFor === "avatar"
      ? setDoc(userRef, { photoURL: "" }, { merge: true })
      : setDoc(userRef, { backgroundURL: "" }, { merge: true });
    deleteObject(imageRef).then(() => {
      if (process.env.NODE_ENV === "development") {
        console.log(`${imageFor}画像を削除しました`);
      }
      imageFor === "avatar" ? setAvatarURL("") : setBackgroundURL("");
      imageFor === "avatar" &&
        dispatch(
          setUserProfile({
            displayName: displayName,
            username: username,
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
        <button
          id="cancel"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            window.history.back();
          }}
        >
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
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onChangeImageHandler(event, "background");
            }}
            disabled={!!deleteBackground}
          />
          <label htmlFor="backgroundImage">背景画像を選択</label>
        </div>
        {backgroundURL && (
          <button
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              setDeleteBackground(true);
            }}
            disabled={!!backgroundImage}
          >
            削除する
          </button>
        )}
        {backgroundImage && (
          <div id="backgroundChangeModal">
            <p>背景画像を登録しますか？</p>
            <p>画像を変更した場合、元の画像は削除されます</p>
            <button onClick={uploadBackground}>はい</button>
            <button
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                event.preventDefault();
                setBackgroundImage("");
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
              onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                deleteImage(event, "background")
              }
            >
              はい
            </button>
            <button
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                event.preventDefault();
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
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onChangeImageHandler(event, "avatar");
            }}
            disabled={!!deleteAvatar}
          />
        </div>
        {avatarURL && (
          <button
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              setDeleteAvatar(true);
            }}
            disabled={!!avatarImage}
          >
            削除する
          </button>
        )}
        {avatarImage && (
          <div id="avatarChangeModal">
            <p>アバター画像を登録しますか？</p>
            <p>画像を変更した場合、元の画像は削除されます</p>
            <button onClick={uploadAvatar}>はい</button>
            <button
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                event.preventDefault();
                setAvatarImage("");
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
              onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                deleteImage(event, "avatar")
              }
            >
              はい
            </button>
            <button
              onClick={(event: React.MouseEvent) => {
                setDeleteAvatar(false);
              }}
            >
              いいえ
            </button>
          </div>
        )}
      </div>
      <form
        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
          editProfile(event);
        }}
      >
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
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setUsername(event.target.value);
            }}
          />
          <label htmlFor="displayName" data-testid="displayName">
            {userType === "business" ? "会社名" : "個人名"}
          </label>
          <input
            name="textbox"
            type="text"
            id="displayName"
            value={displayName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setDisplayName(event.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor="introduction" data-testid="introduction">
            紹介文
          </label>
          <textarea
            id="introduction"
            value={introduction}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
              setIntroduction(event.target.value);
            }}
          />
        </div>
        {userType === "business" && (
          <div>
            <div>
              <label htmlFor="owner">事業主</label>
              <input
                name="textbox"
                type="text"
                id="owner"
                value={owner}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setOwner(event.target.value);
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
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setTypeOfWork(event.target.value);
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
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setAddress(event.target.value);
                }}
              />
            </div>
          </div>
        )}
        {userType === "normal" && (
          <div>
            <div>
              <label htmlFor="birthdate">生年月日</label>
              <input
                name="textbox"
                type="date"
                id="birthdate"
                value={birthdate}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setBirthdate(event.target.value);
                }}
              />
            </div>
            <div>
              <label htmlFor="skill">資格・実績</label>
              <input
                name="textbox"
                type="text"
                id="skill"
                value={skill}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setSkill(event.target.value);
                }}
              />
            </div>
          </div>
        )}
        <div>
          <input
            type="submit"
            data-testid="submit"
            value="登録する"
            disabled={!username || !displayName}
          />
        </div>
      </form>
    </div>
  );
};

export default Setting;
