import React, { useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { useNavigate } from "react-router-dom";
import { setUserProfile, toggleIsNewUser, login } from "../features/userSlice";
import { auth, db, storage } from "../firebase";
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
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  StorageReference,
  uploadString,
} from "firebase/storage";
import { Visibility, VisibilityOff, CloseRounded } from "@mui/icons-material";
import { checkPassword } from "../functions/CheckPassword";
import { checkUsername } from "../functions/CheckUsername";
import { resizeImage } from "../functions/ResizeImage";
import ArrowBackRounded from "@mui/icons-material/ArrowBackIosNewRounded";
import PersonOutline from "@mui/icons-material/PersonOutline";

const SignUp: React.VFC = () => {
  const [displayName, setDisplayName] = useState<string>("");
  const [username, setUsername] = useState<{
    patternCheck: boolean;
    uniqueCheck: boolean;
    input: string;
  }>({
    patternCheck: true,
    uniqueCheck: true,
    input: "",
  });
  const [avatarImage, setAvatarImage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<{
    lengthCheck: boolean;
    patternCheck: boolean;
    input: string;
  }>({
    lengthCheck: true,
    patternCheck: true,
    input: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const closeToast = () => {
    setShowToast(false);
  };

  const onChangeImageHandler: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = async (event) => {
    const file: File = event.target.files![0];
    if (["image/png", "image/jpeg"].includes(file.type) === true) {
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const processed: string = await resizeImage(reader.result as string);
        setAvatarImage(processed);
      };
      reader.onerror = () => {
        if (process.env.NODE_ENV === "development") {
          console.log(reader.error);
        }
      };
      // NOTE >> ブラウザがBlobURLSchemeをサポートしていない場合は処理を中断
    } else {
      alert("拡張子が「png」もしくは「jpg」の画像ファイルを選択してください。");
    }
    event.target.value = "";
  };

  const signUp: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<void> = async (event) => {
    event.preventDefault();
    let url: string = "";
    await createUserWithEmailAndPassword(auth, email, password.input)
      .then(async (userCredential: UserCredential) => {
        const user: User = userCredential.user;
        const avatarRef: StorageReference = ref(storage, `avatars/${user.uid}`);
        if (avatarImage) {
          await uploadString(avatarRef, avatarImage, "data_url");
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
          avatarURL: url,
          backgroundURL: "",
          displayName: displayName,
          introduction: "",
          uid: user.uid,
          userType: null,
          username: `@${username.input}`,
        });
        const usernameRef: DocumentReference<DocumentData> = doc(
          db,
          `usernames/${user.uid}`
        );
        setDoc(usernameRef, {
          uid: `${user.uid}`,
          username: `@${username.input}`,
        });
        const optionRef: DocumentReference<DocumentData> = doc(
          db,
          `option/${user.uid}`
        );
        setDoc(optionRef, {
          achademicHistory: "",
          address: "",
          birthdate: null,
          owner: "",
          skill1: "",
          skill2: "",
          skill3: "",
          typeOfWork: "",
          uid: user.uid,
          userType: null,
          username: `@${username.input}`,
        });
        dispatch(
          setUserProfile({
            avatarURL: url,
            backgroundURL: "",
            displayName: displayName,
            introduction: "",
            username: `@${username.input}`,
          })
        );
        dispatch(toggleIsNewUser(true));
        dispatch(
          login({
            avatarURL: url,
            backgroundURL: "",
            displayName: displayName,
            introduction: "",
            uid: user.uid,
            username: `@${username.input}`,
            userType: null,
          })
        );
      })
      .then(() => {
        setShowToast(true);
        setTimeout(() => {
          closeToast();
          navigate("/", { replace: true });
        }, 2000);
      })
      .catch((error: any) => {
        if (error.message === "Firebase: Error (auth/email-already-in-use).") {
          alert("このメールアドレスは既に使われています。");
        } else {
          console.log(error.message);
        }
      });
  };

  return (
    <div className="md:flex lg:flex lg:justify-center md:justify-center h-screen bg-slate-100">
      <div className="flex flex-col sm:w-screen md:w-1/2 lg:w-1/3 bg-white">
        <div className="flex fixed w-full md:w-1/2 lg:w-1/3 h-12 justify-center items-center bg-white z-10">
          <button
            className="absolute left-2"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              navigate("/navigate", { replace: true });
            }}
          >
            <ArrowBackRounded />
          </button>
          <p className="mx-auto font-bold">ユーザー登録</p>
        </div>
        <div className="pt-16 p-4">
          <div className="flex w-full justify-center">
            <input
              id="avatarInput"
              type="file"
              accept="image/*"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                event.preventDefault();
                onChangeImageHandler(event);
              }}
              hidden
            />
            <div className="relative w-20 h-20 mb-8 rounded-full">
              {avatarImage ? (
                <img
                  className="w-20 h-20 rounded-full object-cover brightness-75"
                  src={avatarImage}
                  alt="アバター画像"
                />
              ) : (
                <div className="w-20 h-20 bg-slate-500 rounded-full" />
              )}
              <label
                htmlFor="avatarInput"
                className="absolute flex justify-center items-center w-20 h-20 top-0 left-0 rounded-full text-slate-100 hover:cursor-pointer"
              >
                <PersonOutline fontSize="large" />
              </label>
              <button
                className="absolute bottom-0 left-24 p-1 border border-slate-500 rounded-full text-slate-500"
                onClick={(
                  event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                ) => {
                  event.preventDefault();
                  setAvatarImage("");
                }}
                disabled={!avatarImage}
              >
                <CloseRounded />
              </button>
            </div>
          </div>
          <div></div>
          <div className="mb-12">
            <label htmlFor="displayName" className="text-sm text-slate-500">
              会社名・個人名
            </label>
            <input
              id="displayName"
              className="h-8 w-full p-4 bg-slate-200 rounded-md"
              type="text"
              value={displayName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setDisplayName(event.target.value);
              }}
              autoFocus
              required
            />
          </div>
          <div className="mb-12">
            <label htmlFor="email" className="text-sm text-slate-500">
              メールアドレス
            </label>
            <input
              id="email"
              className="h-8 w-full p-4 bg-slate-200 rounded-md"
              name="textbox"
              type="email"
              value={email}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(event.target.value);
              }}
              placeholder="例) tsugumon@examle.com"
              required
            />
          </div>
          <div className="mb-8">
            <label htmlFor="username" className="text-sm text-slate-500">
              ユーザー名
            </label>
            <p className="my-2 text-xs">
              入力できる文字はアルファベットの大文字、小文字、数字、_(アンダーバー)の4種類です。
            </p>
            <input
              id="username"
              className="h-8 w-full pl-4 py-4 pr-12 bg-slate-200 rounded-md"
              type="text"
              onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                event.preventDefault();
                setUsername(await checkUsername(event.target.value));
              }}
            />
            <div className="h-4">
              <p className="my-2 text-sm text-red-500">
                {username.uniqueCheck === false &&
                  "既に使用されているユーザー名です。"}
              </p>
              <p className="my-2 text-sm text-red-500">
                {username.patternCheck === false &&
                  "入力できない文字が含まれいます。"}
              </p>
            </div>
          </div>
          <div className="mb-8">
            <label htmlFor="password" className="text-sm text-slate-500">
              パスワード
            </label>
            <p className="my-2 text-xs">
              8文字以上20文字以下の文字を入力してください。
            </p>
            <p className="my-2 text-xs">
              入力できる文字はアルファベットの大文字、小文字、数字、_(アンダーバー)の4種類です。
            </p>
            <div className="relative">
              <input
                id="password"
                className="h-8 w-full pl-4 py-4 pr-12 bg-slate-200 rounded-md"
                type={showPassword ? "text" : "password"}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  event.preventDefault();
                  setPassword(checkPassword(event));
                }}
              />
              <div
                className="absolute flex justify-center items-center w-8 h-8 top-0 right-2"
                onClick={(
                  event: React.MouseEvent<HTMLDivElement, MouseEvent>
                ) => {
                  event.preventDefault();
                  setShowPassword(!showPassword);
                }}
              >
                {showPassword ? (
                  <p className="text-emerald-500">
                    <Visibility />
                  </p>
                ) : (
                  <p className="text-slate-500">
                    <VisibilityOff />
                  </p>
                )}
              </div>
            </div>
            <div className="h-12">
              {!password.lengthCheck && (
                <p className="my-2 text-sm text-red-500">
                  8文字以上20文字以下で入力してください。
                </p>
              )}
              {!password.patternCheck && (
                <p className="my-2 text-sm text-red-500">
                  入力できない文字が含まれています。
                </p>
              )}
            </div>
          </div>
          <button
            className="block w-24 h-8 m-auto border rounded-full font-bold border-emerald-500 text-emerald-500 hover:border-none hover:bg-emerald-500 hover:text-slate-100 disabled:border-slate-400 disabled:text-slate-400 disabled:bg-slate-300"
            onClick={(
              event: React.MouseEvent<HTMLButtonElement, MouseEvent>
            ) => {
              signUp(event);
            }}
            disabled={
              !displayName ||
              !email ||
              !username.patternCheck ||
              !username.uniqueCheck ||
              !username.input ||
              !password.lengthCheck ||
              !password.patternCheck ||
              !password.input
            }
          >
            登録する
          </button>
        </div>

        <div
          className={`w-80 h-12 
                          m-auto p-4 
                          text-center 
                          leading-3 
                          text-white 
                          bg-emerald-500 
                          rounded-lg 
                          font-bold
                          ${showToast ? "opacity-1" : "opacity-0"}             
                          duration-300
                        `}
        >
          <p>ユーザー登録が完了しました。</p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
