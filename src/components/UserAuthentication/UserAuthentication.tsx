import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { auth } from "../../firebase";
import { useDemo } from "../../hooks/useDemo";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Lock, Visibility, VisibilityOff } from "@mui/icons-material";

const UserAuthentication = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [upload, setUpload] = useState<boolean>(false);
  const progress: "wait" | "run" | "done" = useDemo(upload);

  const login: (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => Promise<void> = async (e) => {
    e.preventDefault();
    if (email && password) {
      signInWithEmailAndPassword(auth, email, password);
    }
  };

  useEffect(() => {
    switch (progress) {
      case "wait":
        if (process.env.NODE_ENV === "development") {
          console.log(`${progress}: アップロードの待機中`);
        }
        setUpload(false);
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
  }, [progress]);

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
            onClick={(
              event: React.MouseEvent<HTMLInputElement, MouseEvent>
            ) => {
              login(event);
            }}
            disabled={!email || !password}
          />
        </div>
        <div>
          <p>アカウントをお持ちではないですか？</p>
          <Link to="/signup">新規登録</Link>
        </div>
      </form>
      <button
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          event.preventDefault();
          setUpload(true);
        }}
      >
        デモデータの登録
      </button>
      <Outlet />
    </div>
  );
};
export default UserAuthentication;
