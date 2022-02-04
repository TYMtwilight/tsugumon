import React, { useState } from "react";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Person, Visibility, VisibilityOff } from "@material-ui/icons";

const SignUp = (props: {
  backToLogin: React.MouseEventHandler<HTMLButtonElement> | undefined;
}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const signUp: (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => Promise<void> = async (e) => {
    e.preventDefault();
    if (email && password) {
      createUserWithEmailAndPassword(auth, email, password);
    }
  };

  return (
    <div>
      <div>
        <Person />
        <p>ユーザー登録</p>
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
            placeholder="例) tsugumon@examle.com"
            autoFocus
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
              signUp(e);
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
