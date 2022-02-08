import React, { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { updateUserProfile } from "../../features/userSlice";
import { auth, db, storage } from "../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Visibility, VisibilityOff, AddAPhoto } from "@material-ui/icons";

const SignUp = (props: {
  backToLogin: React.MouseEventHandler<HTMLButtonElement> | undefined;
}) => {
  const [displayName, setDisplayName] = useState<string>("");
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [avatarDraft, setAvatarDraft] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const onChangeImageHandler: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void = (e) => {
    const file: File = e.target.files![0];
    if (file) {
      setAvatarImage(file);
      // NOTE >> 利用中のブラウザがBlobURLSchemeをサポートしていない場合は
      //         処理を中断します。
      if (!window.URL) return;
      const blobURL: string = window.URL.createObjectURL(file);
      setAvatarDraft(blobURL);
    }
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
    let url: string = "";
    if (avatarImage) {
      const S: string =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N: number = 16;
      const randomCharactor: string = Array.from(
        crypto.getRandomValues(new Uint32Array(N))
      )
        .map((n) => S[n % S.length])
        .join("");
      const fileName: string = randomCharactor + avatarImage.name;
      await uploadBytes(ref(storage, `avatars/${fileName}`), avatarImage);
      url = await getDownloadURL(ref(storage, `avatars/${fileName}`));
      console.log(url);
    }
    if (authUser.user) {
      await updateProfile(authUser.user, {
        displayName: displayName,
        photoURL: url,
      });
      const userRef = doc(db, "users", authUser.user.uid);
      setDoc(userRef, {
        displayName: displayName,
        photoURL: url,
        userType: null,
        followerCount: 0,
      });
    }

    dispatch(
      updateUserProfile({
        displayName: displayName,
        photoURL: url,
      })
    );
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
          <label htmlFor="selectAvatarImage">
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
            data-testid="clearAvatarImage"
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
      <form>
        <div>
          <label htmlFor="displayName">会社名・個人名</label>
          <input
            type="text"
            id="displayName"
            data-testid="displayName"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setDisplayName(e.target.value);
            }}
            required
            autoFocus
          />
        </div>
        <div>
          <label htmlFor="email">メールアドレス</label>
          <input
            type="email"
            id="email"
            data-testid="email"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
            }}
            placeholder="例) tsugumon@examle.com"
            required
          />
        </div>
        <div>
          <p>エラーメッセージ</p>
          <p>エラーメッセージ</p>
        </div>
        <div>
          <label htmlFor="password">パスワード</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            data-testid="password"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
            }}
            required
            pattern="[A-Z,a-z,0-9]{8,20}"
          />
          <div
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
              パスワードに入力できる文字は英語大文字、英語小文字、数字の３種類です。
            </p>
            <p>エラーメッセージ</p>
            <p>エラーメッセージ</p>
          </div>
        </div>
        <div>
          <input
            type="submit"
            data-testid="signup_button"
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
