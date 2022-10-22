import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { selectUser, logout, updateUserType } from "../features/userSlice";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import ArrowBackRounded from "@mui/icons-material/ArrowBackIosNewRounded";

const SelectUserType = () => {
  const [userType, setUserType] = useState<"business" | "normal">("business");

  const dispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const user = useAppSelector(selectUser);

  const registUserType: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    userType: "business" | "normal" | null
  ) => Promise<void> = async (event, userType) => {
    event.preventDefault();
    const userRef = doc(db, "users", user.uid);
    updateDoc(userRef, { userType: userType });
    dispatch(updateUserType(userType));
  };

  return (
    <div className="w-screen min-h-screen bg-slate-100">
      <div className="flex fixed top-0">
        <div className="flex relative h-12 w-screen items-center bg-slate-100">
          <button
            className="ml-2"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              signOut(auth)
                .then(() => {
                  dispatch(logout());
                  navigate("/login",{ replace:true });
                })
                .catch((error: any) => {
                  console.log(`エラーが発生しました\n${error.message}`);
                });
            }}
          >
            <ArrowBackRounded />
          </button>
          <p className="w-44 mx-auto font-bold">ユーザータイプを選択</p>
        </div>
      </div>
      <div className="pt-16 p-4">
        <p className="text-center mb-2">ユーザータイプを選択してください</p>
        <p className="text-center mb-4 text-sm text-red-500">
          一度登録したユーザタイプは変更できません
        </p>
        <button
          className="relative w-full h-64 flex flex-col justify-center mb-8"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            setUserType("business");
          }}
        >
          <img
            className="absolute w-full h-64 left-0 top-0 rounded-lg brightness-50"
            src={`${process.env.PUBLIC_URL}/images/businessUser.jpg`}
            alt="企業ユーザーの画像"
          />
          <div
            className={`absolute w-full h-64 rounded-lg z-20  ${
              userType === "business"
                ? "bg-gradient-to-br from-emerald-700/70 to-lime-500/70 shadow-xl"
                : "bg-slate-400"
            }`}
          />
          <p className="w-full align-middle text-center text-slate-100 text-2xl font-bold z-30">
            企業ユーザー
          </p>
          <p className="w-68 mx-auto text-slate-100 z-30">
            働き手を探している企業や事業者向け
          </p>
          <p className="w-64 mx-auto text-sm text-left text-slate-100 my-4 z-30">
            企業ユーザーは、記事やプロフィールの閲覧機能、DM機能、検索機能のほか、記事の投稿や求人広告の掲示といった機能を利用できます。
          </p>
        </button>
        <button
          className="relative w-full h-64 flex flex-col justify-center mb-8"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            setUserType("normal");
          }}
        >
          <img
            className="absolute w-full h-64 left-0 top-0 rounded-lg brightness-50"
            src={`${process.env.PUBLIC_URL}/images/normalUser.jpg`}
            alt="一般ユーザーの画像"
          />
          <div
            className={`absolute w-full h-64  rounded-lg z-20
         ${
           userType === "normal"
             ? "bg-gradient-to-br from-cyan-700/70 to-violet-500/70 shadow-xl"
             : "bg-slate-400"
         }
          `}
          />
          <p className="w-full align-middle text-center text-slate-100 text-2xl font-bold z-30">
            一般ユーザー
          </p>
          <p className="w-68 mx-auto text-slate-100 z-30">
            就め先や移住先を探しているかた向け
          </p>
          <p className="w-64 mx-auto text-sm text-left text-slate-100 my-4 z-30">
            一般ユーザーは、記事やプロフィールの閲覧機能、DM機能や検索機能を利用できます。
          </p>
        </button>
        <button
          className="block w-40 h-8 m-auto border rounded-full font-bold border-emerald-500 text-emerald-500 hover:border-none hover:bg-emerald-500 hover:text-slate-100 disabled:border-slate-400 disabled:text-slate-400 disabled:bg-slate-300"
          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            registUserType(event, userType);
          }}
          disabled={!userType}
        >
          この内容で登録する
        </button>
      </div>
    </div>
  );
};

export default SelectUserType;
