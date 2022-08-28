import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { auth } from "../firebase";
import { useDemo } from "../hooks/useDemo";
import { signInWithEmailAndPassword } from "firebase/auth";
import { checkPassword } from "../functions/CheckPassword";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { blueGrey } from "@mui/material/colors";

const UserAuthentication = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<{
    lengthCheck: boolean;
    patternCheck: boolean;
    input: string;
  }>({
    lengthCheck: false,
    patternCheck: true,
    input: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [upload, setUpload] = useState<boolean>(false);
  const progress: "wait" | "run" | "done" = useDemo(upload);

  const login: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<void> = async (event) => {
    event.preventDefault();
    if (email && password) {
      signInWithEmailAndPassword(auth, email, password.input);
    }
  };

  useEffect(() => {
    switch (progress) {
      case "wait":
        if (process.env.NODE_ENV === "development") {
          console.log(`${progress}: アップロードの待機中`);
          setUpload(false);
        }
        break;
      case "run":
        if (process.env.NODE_ENV === "development") {
          console.log(`${progress}: アップロードの実行中`);
        }
        break;
      case "done":
        if (process.env.NODE_ENV === "development") {
          console.log(`${progress}: アップロード完了`);
          setUpload(false);
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  return (
    <div>
      <div>
        <header className="flex h-40 justify-center items-center bg-hero bg-cover bg-bottom brightness-125">
          <h1 className="font-kiwi text-2xl text-slate-100">つぐもん</h1>
        </header>
        <form className="p-4">
          <div className="mb-12">
            <label className="block" htmlFor="email">
              メールアドレス
            </label>
            <input
              className="block w-10/12 h-8 px-4 rounded-md outline-none bg-slate-200"
              name="textbox"
              type="email"
              id="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
              }}
              placeholder="例) tsugumon@example.com"
              autoFocus
              required
            />
          </div>
          <div>
            <label className="block" htmlFor="password">
              パスワード
            </label>
            <div className="flex">
              <input
                className="block w-10/12 h-8 px-4 rounded-md outline-none bg-slate-200"
                type={showPassword ? "text" : "password"}
                id="password"
                data-testid="password"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  event.preventDefault();
                  setPassword(checkPassword(event));
                }}
                required
              />
              <button
                className="ml-4"
                onClick={(
                  e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                ) => {
                  e.preventDefault();
                  setShowPassword(!showPassword);
                }}
              >
                {showPassword ? (
                  <Visibility color="primary" />
                ) : (
                  <VisibilityOff sx={{ color: blueGrey[500] }} />
                )}
              </button>
            </div>
            <div className="h-12">
              {password.lengthCheck === false && (
                <p className="text-sm text-slate-400 ">
                  パスワードは８文字以上入力してください
                </p>
              )}
            </div>
            <div className="flex justify-center">
              <button
                className="w-24 h-8 font-bold rounded-md border border-emerald-500 text-emerald-500 hover:border-none hover:text-slate-100 hover:bg-emerald-500 disabled:border-none disabled:text-slate-100 disabled:bg-slate-300"
                data-testid="loginButton"
                onClick={(
                  event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                ) => {
                  login(event);
                }}
                disabled={!email || !password.input || !password.lengthCheck}
              >
                ログイン
              </button>
            </div>
          </div>
        </form>
        <div className="flex justify-center">
          <p>
            新規登録は
            <Link className="text-sky-500 underline" to="/signup">
              こちら
            </Link>
          </p>
        </div>
        <footer className="flex mt-16 justify-center">
          <button
            className="w-40 h-8 rounded-md border hover:border-none border-slate-500 text-slate-500 hover:text-slate-100 font-bold hover:bg-slate-500"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              setUpload(true);
            }}
          >
            デモデータの登録
          </button>
        </footer>
      </div>
      <Outlet />
    </div>
  );
};
export default UserAuthentication;
