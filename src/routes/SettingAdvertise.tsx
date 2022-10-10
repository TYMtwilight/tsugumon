import React, { useRef, useState, useEffect } from "react";
import { useAppSelector } from "../app/hooks";
import { selectUser, LoginUser } from "../features/userSlice";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  doc,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { resizeImage } from "../functions/ResizeImage";
import ArrowBackRounded from "@mui/icons-material/ArrowBackIosNewRounded";
import PhotoLibraryOutlined from "@mui/icons-material/PhotoLibraryOutlined";
import CloseRounded from "@mui/icons-material/CloseRounded";

const SettingBusiness = () => {
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [advertiseImage, setAdvertiseImage] = useState<string>("");
  const closingHour: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
  const closingMinutes: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
  const jobDescription: React.RefObject<HTMLTextAreaElement> =
    useRef<HTMLTextAreaElement>(null);
  const location: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
  const maximumWage: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
  const message: React.RefObject<HTMLTextAreaElement> =
    useRef<HTMLTextAreaElement>(null);
  const minimumWage: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
  const openingHour: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
  const openingMinutes: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
  const wanted: React.RefObject<HTMLInputElement> = useRef(null);

  const navigate: NavigateFunction = useNavigate();
  const loginUser: LoginUser = useAppSelector(selectUser);
  let isMounted: boolean = true;
  const advertiseRef: DocumentReference<DocumentData> = doc(
    db,
    "advertises",
    `${loginUser.uid}`
  );

  const getAdvertise: () => Promise<void> = async () => {
    const advertiseSnap: DocumentSnapshot<DocumentData> = await getDoc(
      advertiseRef
    );
    if (advertiseSnap.exists()) {
      setAdvertiseImage(advertiseSnap.data()!.advertiseImage);
      closingHour.current!.value = advertiseSnap.data()!.closingHour;
      closingMinutes.current!.value = advertiseSnap.data()!.closingMinutes;
      jobDescription.current!.value = advertiseSnap.data()!.jobDescription;
      location.current!.value = advertiseSnap.data()!.location;
      maximumWage.current!.value = advertiseSnap.data()!.maximumWage;
      message.current!.value = advertiseSnap.data()!.message;
      minimumWage.current!.value = advertiseSnap.data()!.minimumWage;
      openingHour.current!.value = advertiseSnap.data()!.openingHour;
      openingMinutes.current!.value = advertiseSnap.data()!.openingMinutes;
      wanted.current!.value = advertiseSnap.data()!.wanted;
    } else {
      return;
    }
  };

  const onChangeImageHandler: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = (event) => {
    const file: File = event.target.files![0];
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const processed: string = await resizeImage(reader.result as string);
      setAdvertiseImage(processed);
    };
    reader.onerror = () => {
      if (process.env.NODE_ENV === "development") {
        console.log(reader.error);
      }
    };
  };

  const handleSubmit = async () => {
    // NOTE >> getDownloadURL()を使ってStorageから画像のURLを取得することも
    //         検討しましたが、useEffect内の処理（ステートに既存の画像URLを
    //         読み込む処理）で、エラーが起きてしまうのを避けるため、
    //         Firestoreに直接、画像のDataURLを書き込み、読み込むかたちに変更しました。

    updateDoc(advertiseRef, {
      closingHour: closingHour.current!.value,
      closingMinutes: closingMinutes.current!.value,
      displayName: loginUser.displayName,
      imageURL: advertiseImage,
      jobDescription: jobDescription.current!.value,
      location: location.current!.value,
      maximumWage: maximumWage.current!.value,
      message: message.current!.value,
      minimumWage: minimumWage.current!.value,
      openingHour: openingHour.current!.value,
      openingMinutes: openingMinutes.current!.value,
      uid: loginUser.uid,
      username: loginUser.username,
      wanted: wanted.current!.value,
    }).then(() => {
      setTimeout(() => {
        navigate(`/loginUser.username}`);
      }, 300);
    });
  };
  useEffect(() => {
    if (isMounted === false) {
      return;
    }
    getAdvertise();
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isMounted = false;
    };
  }, [isFetched]);

  return (
    <div className="bg-slage-100">
      <div className="flex fixed justify-center items-center top-0 w-screen h-12 z-10 bg-slate-100">
        <button
          className="absolute left-2"
          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            event.preventDefault();
            navigate(-1);
          }}
        >
          <ArrowBackRounded />
        </button>
        <p className="w-40 mx-auto font-bold">募集広告の編集</p>
      </div>
      <div className="relative bg-slate-300">
        <img
          className="w-screen h-44 object-cover brightness-75"
          src={
            advertiseImage
              ? advertiseImage
              : `${process.env.PUBLIC_URL}/noPhoto.png`
          }
          alt="イメージ画像"
        />
        <input
          id="advertiseImageInput"
          type="file"
          accept="image/*"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            onChangeImageHandler(event);
          }}
          hidden
        />
        <label
          className="flex absolute left-4 text-slate-100"
          htmlFor="advertiseInput"
        >
          <PhotoLibraryOutlined fontSize="large" />
          <p className="ml-4 leading-8">イメージ画像を選択</p>
        </label>
        <div className="absolute flex items-center inset-y-1/2 left-4 ">
          <img
            className="w-12 h-12 mr-2 border-2 border-slate-100 object-cover rounded-full"
            id="avatar"
            src={
              loginUser.avatarURL
                ? loginUser.avatarURL
                : `${process.env.PUBLIC_URL}/noAvatar.png`
            }
            alt="アバター画像"
          />
          <p className="text-xl text-slate-100 font-semibold">
            {loginUser.displayName}
          </p>
          <button
            className="absolute right-4 bottom-4 p-2 rounded-full border border-slate-100 text-slate-100"
            onClick={(
              event: React.MouseEvent<HTMLButtonElement, MouseEvent>
            ) => {
              event.preventDefault();
              setAdvertiseImage("");
            }}
            disabled={!advertiseImage}
          >
            <CloseRounded />
          </button>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <textarea
              className="w-full h-32 p-2 border-none bg-slate-200 rounded-md resize-none"
              ref={message}
              placeholder="応募者へのメッセージを入力してください"
            />
          </div>
          <div className="mb-4">
            <p className="text-sm text-slate-500">勤務内容</p>
            <textarea
              className="w-full h-32 ml-2 border-none bg-slate-200 rounded-md resize-none"
              ref={jobDescription}
            />
          </div>
          <div className="mb-4">
            <p className="text-sm text-slate-500">勤務地</p>
            <input
              className="h-8 w-full ml-2 bg-slate-200 rounded-md"
              type="text"
              ref={location}
            />
          </div>
          <div className="mb-4">
            <p className="text-sm text-slate-500">給与</p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-slate-500">勤務時間</p>
          </div>
        </div>
        <div className="mb-8">
          <button
            className="block w-24 h-8 m-auto border rounded-full font-bold border-emerald-500 text-emerald-500 hover:border-none hover:bg-emerald-500 hover:text-slate-100 disabled:border-slate-400 disabled:text-slate-400 disabled:bg-slate-300"
            onClick={(
              event: React.MouseEvent<HTMLButtonElement, MouseEvent>
            ) => {
              event.preventDefault();
              handleSubmit();
            }}
          >
            登録する
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingBusiness;
