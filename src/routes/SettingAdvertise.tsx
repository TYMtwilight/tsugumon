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
  setDoc,
} from "firebase/firestore";
import { resizeImage } from "../functions/ResizeImage";
import {
  ArrowBackIosNewRounded,
  PhotoLibraryOutlined,
  CloseRounded,
} from "@mui/icons-material";

const SettingAdvertise = () => {
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [advertiseImage, setAdvertiseImage] = useState<string>("");
  const [wanted, setWanted] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const closingHour: React.RefObject<HTMLSelectElement> =
    useRef<HTMLSelectElement>(null);
  const closingMinutes: React.RefObject<HTMLSelectElement> =
    useRef<HTMLSelectElement>(null);
  const location: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
  const maximumWage: React.RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);
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
        if (advertiseSnap.exists() && isMounted) {
          setAdvertiseImage(advertiseSnap.data()!.imageURL);
          closingHour.current!.value = advertiseSnap.data()!.closingHour;
          closingMinutes.current!.value = advertiseSnap.data()!.closingMinutes;
          setJobDescription(advertiseSnap.data()!.jobDescription);
          location.current!.value = advertiseSnap.data()!.location;
          maximumWage.current!.value = advertiseSnap.data()!.maximumWage;
          setMessage(advertiseSnap.data()!.message);
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
    setDoc(
      advertiseRef,
      {
        closingHour: closingHour.current!.value,
        closingMinutes: closingMinutes.current!.value,
        displayName: loginUser.displayName,
        imageURL: advertiseImage,
        jobDescription: jobDescription,
        location: location.current!.value,
        maximumWage: maximumWage.current!.value,
        message: message,
        minimumWage: minimumWage.current!.value,
        openingHour: openingHour.current!.value,
        openingMinutes: openingMinutes.current!.value,
        uid: loginUser.uid,
        username: loginUser.username,
        wanted: wanted,
      },
      { merge: true }
    ).then(() => {
      setTimeout(() => {
        navigate(`/${loginUser.username}`);
      }, 300);
    });
  };
  useEffect(() => {
    getAdvertise();
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isMounted = false;
    };
  }, [isFetched]);

  return (
    <div className="md:flex md:justify-center w-screen h-full min-h-screen bg-slate-400">
      <div className="w-screen md:w-1/2 lg:w-1/3 h-full bg-white">
        <div className="flex fixed w-screen md:w-1/2 lg:w-1/3 h-12 justify-center items-center top-0  z-10 bg-white">
          <button
            className="absolute left-2"
            onClick={() => {
              navigate(-1);
            }}
          >
            <ArrowBackIosNewRounded />
          </button>
          <p className="w-28 mx-auto font-bold">募集広告の編集</p>
        </div>
        <div className="mt-12">
          <div className="relative">
            <img
              className="w-full h-44 object-cover brightness-50"
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
                onChangeImageHandler(event);
              }}
              hidden
            />
            <label
              className="flex absolute bottom-2 left-4 text-white align-middle"
              htmlFor="advertiseImageInput"
            >
              <PhotoLibraryOutlined />
              <p className="ml-2">イメージ画像を選択</p>
            </label>
            <div className="absolute flex items-center inset-y-1/2 left-4 ">
              <img
                className="w-12 h-12 mr-2 border-2 border-white object-cover rounded-full"
                id="avatar"
                src={
                  loginUser.avatarURL
                    ? loginUser.avatarURL
                    : `${process.env.PUBLIC_URL}/noAvatar.png`
                }
                alt="アバター画像"
              />
              <p className="text-xl text-white font-semibold">
                {loginUser.displayName}
              </p>
            </div>
            <button
              className="absolute right-4 bottom-2 p-2 rounded-full border border-white text-white active:border-none active:bg-white active:text-slate-500 cursor-pointer duration-[100ms]"
              onClick={() => {
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
                placeholder="応募者へのメッセージを入力してください"
                value={message}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setMessage(event.target.value);
                }}
              />
            </div>
            <div className="mb-4">
              <p className="text-sm text-slate-500">勤務内容</p>
              <textarea
                className="w-full h-32 p-2 border-none bg-slate-200 rounded-md resize-none"
                value={jobDescription}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setJobDescription(event.target.value);
                }}
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
                <select ref={openingHour} className="bg-white">
                  {[
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                    17, 18, 19, 20, 21, 22, 23, 24,
                  ].map((hour: number) => {
                    return (
                      <option key={hour}>
                        {`0${hour}`.substring(`0${hour}`.length - 2)}
                      </option>
                    );
                  })}
                </select>
                <label className="w-2">:</label>
                <select ref={openingMinutes} className="bg-white">
                  {minutesArray.map((minutes) => {
                    return (
                      <option key={minutes}>
                        {`0${minutes}`.substring(`0${minutes}`.length - 2)}
                      </option>
                    );
                  })}
                </select>
                <label className="mx-2">~</label>
                <select ref={closingHour} className="bg-white">
                  {[
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                    17, 18, 19, 20, 21, 22, 23, 24,
                  ].map((hour: number) => {
                    return (
                      <option key={hour}>
                        {`0${hour}`.substring(`0${hour}`.length - 2)}
                      </option>
                    );
                  })}
                </select>
                <label className="w-2">:</label>
                <select ref={closingMinutes} className="bg-white">
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
                } rounded-full drop-shadow-lg bg-white`}
                onClick={() => {
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
              className="block w-24 h-8 m-auto border rounded-full font-bold border-emerald-500 text-emerald-500 hover:border-none hover:bg-emerald-500 hover:text-white 
              active:bg-emerald-500 active:text-white
              disabled:border-slate-400 disabled:text-slate-400 disabled:bg-slate-300 duration-[200ms]"
              onClick={() => {
                handleSubmit();
              }}
              disabled={message === "" || jobDescription === ""}
            >
              登録する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingAdvertise;
