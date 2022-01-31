import React, { useRef } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import LockIcon from "@material-ui/icons/Lock";
const UserAuthentication = () => {
  const email: React.MutableRefObject<string> = useRef("");
  const password: React.MutableRefObject<string> = useRef("");
  const signUp: React.MutableRefObject<boolean> = useRef(false);

  const Login: () => Promise<void> = async () => {
    if (email && password) {
      signInWithEmailAndPassword(auth, email.current, password.current);
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
              email.current = e.target.value;
            }}
            placeholder="例) tsugumon@example.com"
            autoFocus
            required
          />
        </div>
        <div>
          <label htmlFor="password">パスワード</label>
          <input
            type="password"
            id="password"
            data-testid="password"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              password.current = e.target.value;
            }}
            required
          />
          <p>8~20文字で入力してください。</p>
          <p>使用できる文字は英語の大文字と小文字、それから数字です。</p>
        </div>
        <input
          type="submit"
          data-testid="login_button"
          value="ログイン"
          onClick={Login}
        />
        <p>アカウントをお持ちではないですか？</p>
        <p
          onClick={() => {
            signUp.current = !signUp.current;
            console.log(signUp.current);
          }}
        >
          新規登録
        </p>
      </form>
    </div>
  );
};
export default UserAuthentication;
