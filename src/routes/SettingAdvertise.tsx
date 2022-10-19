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
  const [wanted, setWanted] = useState<boolean>(false);
  const closingHour: React.RefObject<HTMLSelectElement> =
    useRef<HTMLSelectElement>(null);
  const closingMinutes: React.RefObject<HTMLSelectElement> =
    useRef<HTMLSelectElement>(null);
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
  const openingHour: React.RefObject<HTMLSelectElement> =
    useRef<HTMLSelectElement>(null);
  const openingMinutes: React.RefObject<HTMLSelectElement> =
    useRef<HTMLSelectElement>(null);
  const navigate: NavigateFunction = useNavigate();
  const loginUser: LoginUser = useAppSelector(selectUser);
  let isMounted: boolean = true;
  const minutesArray: number[] = [];
  for (let i = 0; i < 60; i++) {
    minutesArray.push(i);
  }

  const advertiseRef: DocumentReference<DocumentData> = doc(
    db,
    `advertises/${loginUser.uid}`
  );
  const getAdvertise = () => {
    getDoc(advertiseRef).then(
      (advertiseSnap: DocumentSnapshot<DocumentData>) => {
        if (advertiseSnap.exists()) {
          setAdvertiseImage(advertiseSnap.data()!.imageURL);
          const closingHourSnap = advertiseSnap.data()?.closingHour;
          closingHour.current!.value = `0${closingHourSnap}`.substring(
            `0${closingHourSnap}`.length - 2
          );
          const closingMinutesSnap = advertiseSnap.data()?.closingMinutes;
          closingMinutes.current!.value = `0${closingMinutesSnap}`.substring(
            `0${closingMinutesSnap}`.length - 2
          );
          jobDescription.current!.value = advertiseSnap.data()!.jobDescription;
          location.current!.value = advertiseSnap.data()!.location;
          maximumWage.current!.value = advertiseSnap.data()!.maximumWage;
          message.current!.value = advertiseSnap.data()!.message;
          minimumWage.current!.value = advertiseSnap.data()!.minimumWage;
          const openingHourSnap = advertiseSnap.data()!.openingHour;
          openingHour.current!.value = `0${openingHourSnap}`.substring(
            `0${openingHourSnap}`.length - 2
          );
          const openingMinutesSnap = advertiseSnap.data()!.openingMinutes;

          openingMinutes.current!.value = `0${openingMinutesSnap}`.substring(
            `0${openingMinutesSnap}`.length - 2
          );
          setWanted(advertiseSnap.data()!.wanted);
          setIsFetched(true);
        } else {
          return;
        }
      }
    );
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
    event.target.value = "";
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
      wanted: wanted,
    }).then(() => {
      setTimeout(() => {
        navigate(`/${loginUser.username}`);
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
      <div className="bg-slate-100">
        <div className="relative mt-12">
          <img
            className="w-screen h-44 object-cover brightness-50"
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
            className="flex absolute bottom-2 left-4 text-slate-100"
            htmlFor="advertiseImageInput"
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
          </div>
          <button
            className="absolute right-4 bottom-2 p-2 rounded-full border border-slate-100 text-slate-100"
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
            <p className="text-sm text-slate-500">メッセージ</p>
            <textarea
              className="w-full h-32 p-2 border-none bg-slate-200 rounded-md resize-none"
              ref={message}
              placeholder="応募者へのメッセージを入力してください"
            />
          </div>
          <div className="mb-4">
            <p className="text-sm text-slate-500">勤務内容</p>
            <textarea
              className="w-full h-32 p-2 border-none bg-slate-200 rounded-md resize-none"
              ref={jobDescription}
            />
          </div>
          <div className="mb-4">
            <p className="text-sm text-slate-500">勤務地</p>
            <input
              className="h-8 w-full p-2 bg-slate-200 rounded-md"
              type="text"
              ref={location}
            />
          </div>
          <div className="mb-4">
            <p className="text-sm text-slate-500">給与</p>
            <input
              type="number"
              ref={minimumWage}
              className="w-20 h-8 p-2 bg-slate-200 rounded-md"
            />
            <label className="ml-2">円</label>
            <label className="mx-2">〜</label>
            <input
              type="number"
              ref={maximumWage}
              className="w-20 h-8 p-2 bg-slate-200 rounded-md"
            />
            <label className="ml-2">円</label>
          </div>
          <div className="mb-4">
            <p className="text-sm text-slate-500">勤務時間</p>
            <div className="flex items-center h-8 w-full p-2 bg-slate-200 rounded-md">
              <select ref={openingHour} className="bg-slate-100">
                {[
                  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                  18, 19, 20, 21, 22, 23, 24,
                ].map((hour: number) => {
                  return (
                    <option key={hour}>
                      {`0${hour}`.substring(`0${hour}`.length - 2)}
                    </option>
                  );
                })}
              </select>
              <label className="w-2">:</label>
              <select ref={openingMinutes} className="bg-slate-100">
                {minutesArray.map((minutes) => {
                  return (
                    <option key={minutes}>
                      {`0${minutes}`.substring(`0${minutes}`.length - 2)}
                    </option>
                  );
                })}
              </select>
              <label className="mx-2">~</label>
              <select ref={closingHour} className="bg-slate-100">
                {[
                  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                  18, 19, 20, 21, 22, 23, 24,
                ].map((hour: number) => {
                  return (
                    <option key={hour}>
                      {`0${hour}`.substring(`0${hour}`.length - 2)}
                    </option>
                  );
                })}
              </select>
              <label className="w-2">:</label>
              <select ref={closingMinutes} className="bg-slate-100">
                {minutesArray.map((minutes) => {
                  return (
                    <option key={minutes}>
                      {`0${minutes}`.substring(`0${minutes}`.length - 2)}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
        <div className="flex items-center mb-8">
          <div
            className={`relative w-16 h-8 mx-4 rounded-full ${
              wanted
                ? "bg-emerald-500 duration-[300ms]"
                : "bg-slate-200 duration-[300ms]"
            } `}
          >
            <button
              id="wanted"
              className={`absolute w-8 h-8 ${
                wanted ? "left-8 duration-[300ms]" : "left-0 duration-[300ms]"
              } rounded-full drop-shadow-lg bg-slate-100`}
              onClick={(
                event: React.MouseEvent<HTMLButtonElement, MouseEvent>
              ) => {
                event.preventDefault();
                setWanted((prev) => {
                  return !prev;
                });
              }}
            />
          </div>
          <label
            className={wanted ? "text-slate-800" : "text-slate-400"}
            htmlFor="wanted"
          >
            {wanted ? "公開する" : "公開しない"}
          </label>
        </div>
        <div className="pb-8">
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
