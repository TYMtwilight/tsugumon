import React, { useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { useNavigate } from "react-router-dom";
import { setUserProfile, toggleIsNewUser } from "../features/userSlice";
import { auth, db, storage } from "../firebase";
import { checkPassword } from "../functions/CheckPassword";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  User,
  UserCredential,
} from "firebase/auth";
import {
  doc,
  DocumentData,
  DocumentReference,
  setDoc,
  collection,
  getDocs,
  where,
  query,
  QuerySnapshot,
  CollectionReference,
  Query,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  StorageReference,
  uploadBytes,
} from "firebase/storage";
import { Visibility, VisibilityOff, AddAPhoto } from "@mui/icons-material";

const SignUp: React.VFC = () => {
  const types: string[] = ["image/png", "image/jpeg"];
  const [displayName, setDisplayName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [usernamePattern, setUsernamePattern] = useState<boolean>(true);
  const [duplicate, setDuplicate] = useState<boolean>(false);
  const [avatarImage, setAvatarImage] = useState<ArrayBuffer | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<{
    lengthCheck: boolean;
    patternCheck: boolean;
    targetValue: string;
  }>({
    lengthCheck: false,
    patternCheck: true,
    targetValue: "",
  });
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onChangeAvatarImage: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = (event) => {
    const file: File = event.target.files![0];
    const reader: FileReader = new FileReader();
    if (types.includes(file.type)) {
      reader.addEventListener("load", () => {
        const arrayBuffer: ArrayBuffer = reader.result as ArrayBuffer;
        setAvatarImage(arrayBuffer);
      });
      // NOTE >> ブラウザがBlobURLSchemeをサポートしていない場合は処理を中断
      if (!window.URL) return;
      setAvatarPreview(window.URL.createObjectURL(file));
      reader.readAsArrayBuffer(file);
      event.target.value = "";
    } else {
      alert("拡張子が「png」もしくは「jpg」の画像ファイルを選択してください。");
    }
  };

  const checkUsername: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void> = async (event) => {
    setUsername(`@${event.target.value}`);

    setUsernamePattern(true);
    const regex = /^[a-z|A-Z|0-9|_]+$/;
    if (event.target.value.length > 0) {
      setUsernamePattern(regex.test(event.target.value));
    }

    setDuplicate(false);
    const usersRef: CollectionReference<DocumentData> = collection(db, "users");
    const usersQuery: Query<DocumentData> = query(
      usersRef,
      where("username", "==", `@${event.target.value}`)
    );
    const usersSnap: QuerySnapshot<DocumentData> = await getDocs(usersQuery);
    usersSnap.forEach(() => {
      setDuplicate(true);
      setUsername("");
    });
  };

  const signUp: (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => Promise<void> = async (event) => {
    event.preventDefault();
    let url: string = "";
    await createUserWithEmailAndPassword(
      auth,
      email,
      password.targetValue
    ).then(async (userCredential: UserCredential) => {
      const user: User = userCredential.user;
      const avatarRef: StorageReference = ref(storage, `avatars/${user.uid}`);
      if (avatarImage) {
        await uploadBytes(avatarRef, avatarImage);
        url = await getDownloadURL(avatarRef);
      }
      await updateProfile(user, {
        displayName: displayName,
        photoURL: url,
      });
      const userRef: DocumentReference<DocumentData> = doc(
        db,
        `users/${user.uid}`
      );
      setDoc(userRef, {
        displayName: displayName,
        username: username,
        photoURL: url,
        userType: null,
        followerCount: 0,
      });
    });
    navigate("/", { replace: true });
    dispatch(
      setUserProfile({
        displayName: displayName,
        username: username,
        avatarURL: url,
      })
    );
    dispatch(toggleIsNewUser(true));
  };

  return (
    <div>
      <p>ユーザー登録</p>
      <form name="form">
        <div>
          <label htmlFor="displayName">会社名・個人名</label>
          <input
            name="textbox"
            type="text"
            id="displayName"
            value={displayName}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setDisplayName(event.target.value);
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
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(event.target.value);
            }}
            placeholder="例) tsugumon@examle.com"
            required
          />
        </div>
        <div>
          <div>
            <img
              id="avatar"
              src={
                avatarPreview
                  ? avatarPreview
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
              accept="image/png,image/jpeg"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onChangeAvatarImage(event);
              }}
            />
          </div>
          <div>
            <button
              id="clearAvatarImage"
              onClick={() => {
                setAvatarImage(null);
                setAvatarPreview("");
              }}
            >
              画像を消す
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="password">パスワード</label>
          <p>パスワードは8文字以上20文字以下の文字を入力してください。</p>
          <p>
            入力できる文字はアルファベットの大文字、小文字、数字、_(アンダーバー)の4種類です。
          </p>
          <input
            name="textbox"
            type={showPassword ? "text" : "password"}
            id="password"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(checkPassword(event));
            }}
          />
          <div
            onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              event.preventDefault();
              setShowPassword(!showPassword);
            }}
          >
            {showPassword ? <Visibility /> : <VisibilityOff />}
          </div>
          <p>{!password.patternCheck && "入力できない文字が含まれいます。"}</p>
          <p>
            {!password.lengthCheck && "8文字以上20文字以下で入力してください。"}
          </p>
        </div>
        <div>
          <label>ユーザー名を入力</label>
          <p>
            入力できる文字はアルファベットの大文字、小文字、数字、_(アンダーバー)の4種類です。
          </p>
          <input
            type="text"
            id="username"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              checkUsername(event);
            }}
          />
          <p>{duplicate && "既に使用されているユーザー名です。"}</p>
          <p>
            {usernamePattern === false && "入力できない文字が含まれいます。"}
          </p>
        </div>
        <div>
          <input
            type="submit"
            value="登録する"
            onClick={(
              event: React.MouseEvent<HTMLInputElement, MouseEvent>
            ) => {
              signUp(event);
            }}
            disabled={!displayName || !email || !username || !password}
          />
        </div>
        <div>
          <button
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              navigate(-1);
            }}
          >
            ログイン画面に戻る
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
