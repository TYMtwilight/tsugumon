import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { selectUser, logout,updateUserType } from "../features/userSlice";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

const SelectUserType = () => {
  if (process.env.NODE_ENV === "development") {
    console.log("SelectUserTypeがレンダリングされました");
  }
  const [userType, setUserType] = useState<"business" | "normal" | null>(null);

  const dispatch = useAppDispatch();
  const navigate:NavigateFunction = useNavigate();
  const user = useAppSelector(selectUser);

  const registUserType: (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>,
    userType: "business" | "normal" | null
  ) => Promise<void> = async (e, userType) => {
    e.preventDefault();
    const userRef = doc(db, "users", user.uid);
    updateDoc(userRef, { userType: userType });

    dispatch(updateUserType(userType));
  };

  return (
    <div>
      <p>ユーザータイプを選択してください。</p>
      <form>
        <div>
          <label htmlFor="businessUser">
            <p>企業ユーザー</p>
            <p>働き手を探している企業や事業者向け</p>
            <p>
              企業ユーザーは記事やプロフィールの閲覧機能、DM機能、検索機能のほか、記事の投稿や求人広告の掲示といった機能を利用できます。
            </p>
          </label>
          <input
            type="radio"
            value="businessUser"
            name="userType"
            id="businessUser"
            data-testid="businessUser"
            onChange={() => {
              setUserType("business");
            }}
          />
        </div>

        <div>
          <label htmlFor="normalUser">
            <p>一般ユーザー</p>
            <p>就め先を探している方・移住を検討している方向け</p>
            <p>
              一般ユーザーは記事やプロフィールの閲覧機能、DM機能や検索機能を利用できます。
            </p>
          </label>
          <input
            type="radio"
            value="normalUser"
            name="userType"
            id="normalUser"
            data-testid="normalUser"
            onChange={() => {
              setUserType("normal");
            }}
          />
        </div>

        <input
          type="submit"
          value="この内容で登録する"
          onClick={(e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
            registUserType(e, userType);
          }}
          disabled={!userType}
        />
      </form>
      <button
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          event.preventDefault();
          signOut(auth)
            .then(() => {
              dispatch(logout());
              navigate("/login");
            })
            .catch((error: any) => {
              console.log(`エラーが発生しました\n${error.message}`);
            });
        }}
      >
        logout
      </button>
    </div>
  );
};

export default SelectUserType;
