import React, { useState, useRef } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import LockIcon from "@material-ui/icons/Lock";

const UserAuthentication = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const signUp: React.MutableRefObject<boolean> = useRef(false);

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
        <LockIcon />
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
            type="password"
            id="password"
            data-testid="password"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
            }}
            required
          />
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
              signUp.current = !signUp.current;
              console.log(signUp.current);
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
