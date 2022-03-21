import React, { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { updateUserProfile, toggleIsNewUser } from "../../features/userSlice";
import { auth, db, storage } from "../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  doc,
  DocumentData,
  DocumentReference,
  setDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Visibility, VisibilityOff, AddAPhoto } from "@mui/icons-material";

const SignUp = (props: {
  backToLogin: React.MouseEventHandler<HTMLButtonElement> | undefined;
}) => {
  const [displayName, setDisplayName] = useState<string>("");
  const [avatarImage, setAvatarImage] = useState<Blob | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [avatarDraft, setAvatarDraft] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const onChangeImageHandler: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void = (e) => {
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

  const signUp: (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>,
    email: string,
    password: string
  ) => Promise<void> = async (e, email, password) => {
    e.preventDefault();
    const authUser = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const avatarRef = ref(storage, `avatars/${authUser.user.uid}`);
    let url: string = "";
    if (avatarImage) {
      await uploadBytes(avatarRef, avatarImage);
      url = await getDownloadURL(avatarRef);
    }
    if (authUser.user) {
      await updateProfile(authUser.user, {
        displayName: displayName,
        photoURL: url,
      });
      const userRef: DocumentReference<DocumentData> = doc(
        db,
        "users",
        authUser.user.uid
      );
      const enterpriseRef: DocumentReference<DocumentData> = doc(
        db,
        "users",
        authUser.user.uid,
        "enterprise",
        authUser.user.uid
      );
      setDoc(userRef, {
        displayName: displayName,
        photoURL: url,
        userType: null,
        followerCount: 0,
      });
      setDoc(enterpriseRef, {
        introduction: "",
        backgroundURL: "",
        owner: "",
        typeOfWork: "",
        address: "",
      });
    }

    dispatch(
      updateUserProfile({
        displayName: displayName,
        photoURL: url,
      })
    );
    dispatch(toggleIsNewUser(true));
  };

  return (
    <div>
      <div>
        <div>
          <img
            id="avatar"
            data-testid="avatar"
            src={
              avatarDraft
                ? avatarDraft
                : `${process.env.PUBLIC_URL}/noAvatar.png`
            }
            alt="ユーザーのアバター画像"
          />
          <label htmlFor="selectAvatarImage" data-testid="labelForAvatar">
            <AddAPhoto />
          </label>
          <input
            type="file"
            id="selectAvatarImage"
            data-testid="selectAvatarImage"
            accept="image/png,image/jpeg"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onChangeImageHandler(e);
            }}
          />
        </div>
        <div>
          <button
            id="clearAvatarImage"
            onClick={() => {
              setAvatarImage(null);
              setAvatarDraft("");
            }}
          >
            画像を消す
          </button>
        </div>
        <p>ユーザー登録</p>
      </div>
      <form name="form">
        <div>
          <label htmlFor="displayName">会社名・個人名</label>
          <input
            name="textbox"
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setDisplayName(e.target.value);
            }}
            autoFocus
            required
          />
        </div>
        <div>
          <label htmlFor="email">メールアドレス</label>
          <input
            name="textbox"
            type="email"
            id="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
            }}
            placeholder="例) tsugumon@examle.com"
            required
          />
        </div>
        <div>
          <p data-testid="error1">エラーメッセージ</p>
          <p data-testid="error2">エラーメッセージ</p>
        </div>
        <div>
          <label htmlFor="password">パスワード</label>
          <input
            name="textbox"
            type={showPassword ? "text" : "password"}
            id="password"
            data-testid="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
            }}
            required
            pattern="[A-Z,a-z,0-9]{8,20}"
          />
          <div
            data-testid="showPasswordButton"
            onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              e.preventDefault();
              setShowPassword(!showPassword);
            }}
          >
            {showPassword ? <Visibility /> : <VisibilityOff />}
          </div>
          <div>
            <p>パスワードは8文字以上20文字以下の文字数で設定してください。</p>
            <p>
              パスワードに入力できる文字は英語大文字、英語小文字、数字の3種類です。
            </p>
            <p data-testid="error3">エラーメッセージ</p>
            <p data-testid="error4">エラーメッセージ</p>
          </div>
        </div>
        <div>
          <input
            type="submit"
            data-testid="signUpButton"
            value="登録する"
            onClick={(e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
              signUp(e, email, password);
            }}
          />
        </div>
        <div>
          <button onClick={props.backToLogin}>ログイン画面に戻る</button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
