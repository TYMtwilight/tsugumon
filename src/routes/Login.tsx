import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
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
    lengthCheck: true,
    patternCheck: true,
    input: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const login: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<void> = async (event) => {
    event.preventDefault();
    if (email && password) {
      signInWithEmailAndPassword(auth, email, password.input).then(() => {
        navigate("/", { replace: true });
      });
    }
  };

  const demoLogin: () => void = () => {
    signInWithEmailAndPassword(auth, "tsugumon@gmail.com", "tsugumon").then(
      () => {
        navigate("/", { replace: true });
      }
    );
  };

  return (
    <div className="md:flex md:justify-center md:h-screen md:px-4 md:py-8 bg-slate-100">
      <div className="sm:w-screen md:w-1/3 md:rounded-2xl bg-white">
        <header className="flex w-full h-44 justify-center items-center mb-4 bg-hero bg-cover bg-bottom md:rounded-t-2xl brightness-125">
          <h1 className="font-kiwi text-2xl text-slate-50">つぐもん</h1>
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
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(event.target.value);
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
            <div className="flex flex-col pb-12">
              <div className="flex flex-row">
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
                    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                  ) => {
                    event.preventDefault();
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
              <div className="h-8 mt-2">
                {password.lengthCheck === false && (
                  <p className="text-sm text-red-500 ">
                    パスワードの入力文字数は8文字以上20文字以下です
                  </p>
                )}
              </div>
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
            className="w-48 h-8 rounded-md border hover:border-none border-slate-500 text-slate-500 hover:text-slate-100 font-bold hover:bg-slate-500"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              demoLogin();
            }}
          >
            デモユーザーでログイン
          </button>
        </footer>
      </div>
      <Outlet />
    </div>
  );
};
export default UserAuthentication;
