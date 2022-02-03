import React, { useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Lock, Visibility, VisibilityOff } from "@material-ui/icons";

const UserAuthentication = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [signUp, setSignUp] = useState<boolean>(false);

  const login: (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => Promise<void> = async (e) => {
    e.preventDefault();
    if (email && password) {
      signInWithEmailAndPassword(auth, email, password);
    }
  };
  return (
    <div>
      <div>
        <Lock />
        <p>ログイン</p>
      </div>
      <form>
        <div>
          <label htmlFor="email">メールアドレス</label>
          <input
            type="email"
            id="email"
            data-testid="email"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
            }}
            placeholder="例) tsugumon@example.com"
            autoFocus
            required
          />
          <div>
            <p>エラーメッセージ</p>
            <p>エラーメッセージ</p>
          </div>
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
            <p>エラーメッセージ</p>
            <p>エラーメッセージ</p>
          </div>
        </div>
        <div>
          <input
            type="submit"
            data-testid="login_button"
            value="ログイン"
            onClick={(e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
              login(e);
            }}
          />
        </div>
        <div>
          <p>アカウントをお持ちではないですか？</p>
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              e.preventDefault();
              setSignUp(!signUp);
              console.log(signUp);
            }}
          >
            新規登録
          </button>
        </div>
      </form>
    </div>
  );
};
export default UserAuthentication;
