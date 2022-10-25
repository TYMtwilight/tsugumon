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
    <div className="md:flex md:justify-center w-screen ">
      <div className="flex fixed sm:w-screen md:w-1/2 lg:w-1/3 h-12 justify-center items-center bg-white top-0 z-10">
        <button
          className="absolute left-2 align-middle"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            signOut(auth)
              .then(() => {
                dispatch(logout());
                navigate("/login", { replace: true });
              })
              .catch((error: any) => {
                console.log(`エラーが発生しました\n${error.message}`);
              });
          }}
        >
          <ArrowBackRounded />
        </button>
        <p className="w-screen text-center font-bold z-50">
          ユーザータイプを選択
        </p>
      </div>
      <div className="sm:w-screen md:w-1/2 lg:w-1/3 h-screen bg-white">
        <div className="pt-16 p-4 h-screen">
          <p className="text-center mb-2">ユーザータイプを選択してください</p>
          <p className="text-center mb-4 text-sm text-red-500">
            一度登録したユーザタイプは変更できません
          </p>
          <button
            className="relative w-full h-1/3 flex flex-col justify-center mb-4"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              setUserType("business");
            }}
          >
            <img
              className="absolute w-full h-full left-0 top-0 object-cover rounded-lg brightness-50 box-border"
              src={`${process.env.PUBLIC_URL}/images/businessUser.jpg`}
              alt="企業ユーザーの画像"
            />
            <div
              className={`absolute w-full h-full rounded-lg z-20  ${
                userType === "business"
                  ? "bg-gradient-to-br from-emerald-700/70 to-lime-500/70 shadow-xl duration-200"
                  : "bg-slate-400"
              }`}
            />
            <p className="w-full align-middle text-center text-white text-2xl font-bold z-30">
              企業ユーザー
            </p>
            <p className="w-68 mx-auto text-sm text-white z-30">
              働き手を探している企業や事業者向け
            </p>
            <p className="w-64 mx-auto text-sm text-left text-white my-4 z-30">
              企業ユーザーは、記事やプロフィールの閲覧機能、DM機能、検索機能のほか、記事の投稿や求人広告の掲示といった機能を利用できます。
            </p>
          </button>
          <button
            className="relative w-full h-1/3 flex flex-col justify-center mb-4"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              setUserType("normal");
            }}
          >
            <img
              className="absolute w-full h-full left-0 top-0 object-cover rounded-lg brightness-50 box-content"
              src={`${process.env.PUBLIC_URL}/images/normalUser.jpg`}
              alt="一般ユーザーの画像"
            />
            <div
              className={`absolute w-full h-full  rounded-lg z-20
         ${
           userType === "normal"
             ? "bg-gradient-to-br from-cyan-700/70 to-violet-500/70 shadow-xl duration-200"
             : "bg-slate-400"
         }
          `}
            />
            <p className="w-full align-middle text-center text-white text-2xl font-bold z-30">
              一般ユーザー
            </p>
            <p className="w-68 mx-auto text-sm text-white z-30">
              就め先や移住先を探しているかた向け
            </p>
            <p className="w-64 mx-auto text-sm text-left text-white my-4 z-30">
              一般ユーザーは、記事やプロフィールの閲覧機能、DM機能や検索機能を利用できます。
            </p>
          </button>
          <button
            className="block w-40 h-8 mx-auto border rounded-full font-bold border-emerald-500 text-emerald-500 hover:border-none hover:bg-emerald-500 hover:text-white disabled:border-slate-400 disabled:text-slate-400 disabled:bg-slate-300"
            onClick={(
              event: React.MouseEvent<HTMLButtonElement, MouseEvent>
            ) => {
              registUserType(event, userType);
            }}
            disabled={!userType}
          >
            この内容で登録する
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectUserType;
