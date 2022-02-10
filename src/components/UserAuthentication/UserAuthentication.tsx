import React, { useState } from "react";
import SignUp from "../SignUp/SignUp";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Lock, Visibility, VisibilityOff } from "@mui/icons-material";

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

  const closeSignUp = () => {
    setSignUp(false);
  };

  return (
    <div>
      <div>
        <Lock />
        <p data-testid="title">ログイン</p>
      </div>
      <form name="form">
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
            placeholder="例) tsugumon@example.com"
            autoFocus
            required
          />
          <div>
            <p data-testid="error1">エラーメッセージ</p>
            <p data-testid="error2">エラーメッセージ</p>
          </div>
        </div>
        <div>
          <label htmlFor="password">パスワード</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            data-testid="password"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
            }}
            required
          />
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              e.preventDefault();
              setShowPassword(!showPassword);
            }}
          >
            {showPassword ? <Visibility /> : <VisibilityOff />}
          </button>
          <div>
            <p data-testid="error3">エラーメッセージ</p>
            <p data-testid="error4">エラーメッセージ</p>
          </div>
        </div>
        <div>
          <input
            type="submit"
            data-testid="loginButton"
            value="ログイン"
            onClick={(e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
              login(e);
            }}
            disabled={!email || !password}
          />
        </div>
        <div>
          <p>アカウントをお持ちではないですか？</p>
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              e.preventDefault();
              setSignUp(true);
              console.log(signUp);
            }}
          >
            新規登録
          </button>
        </div>
      </form>
      {signUp && <SignUp backToLogin={closeSignUp} />}
    </div>
  );
};
export default UserAuthentication;
