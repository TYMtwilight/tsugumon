import React, { useRef, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectUser, LoginUser, setUserProfile } from "../features/userSlice";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import { updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  getDocs,
  query,
  Query,
  QuerySnapshot,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  StorageReference,
  uploadString,
} from "firebase/storage";
import { resizeImage } from "../functions/ResizeImage";
import { checkUsername } from "../functions/CheckUsername";
import CloseRounded from "@mui/icons-material/CloseRounded";

const NewSetting = () => {
  const [avatarImage, setAvatarImage] = useState<string>("");
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const [backgroundURL, setBackgroundURL] = useState<string>("");
  const birthdayYear = useRef<HTMLSelectElement>(null);
  const birthdayMonth = useRef<HTMLSelectElement>(null);
  const birthday = useRef<HTMLSelectElement>(null);
  const [dates, setDates] = useState<number[]>([]);
  const displayName = useRef<HTMLInputElement>(null);
  const introduction = useRef<HTMLTextAreaElement>(null);
  const loginUser: LoginUser = useAppSelector(selectUser);
  const skill1 = useRef<HTMLInputElement>(null);
  const skill2 = useRef<HTMLInputElement>(null);
  const skill3 = useRef<HTMLInputElement>(null);

  const navigate: NavigateFunction = useNavigate();

  let isMounted: boolean = true;

  let years: number[] = [];
  const thisYear: number = new Date().getFullYear();
  for (let i = thisYear; i >= thisYear - 100; i--) {
    years.push(i);
  }
  const months: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const getDates: () => void = () => {
    const year = Number(birthdayYear.current!.value);
    const isLeapYear: boolean =
      (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const datesOfFebruary = isLeapYear ? 29 : 28;
    const datesOfYear: number[] = [
      31,
      datesOfFebruary,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ];
    const month: number = Number(birthdayMonth.current!.value);
    const dateArray: number[] = [];
    const datesOfMonth: number = datesOfYear[month - 1];
    for (let i = 1; i <= datesOfMonth; i++) {
      dateArray.push(i);
    }
    setDates(dateArray);
  };

  const onChangeImageHandler: (
    event: React.ChangeEvent<HTMLInputElement>,
    imageFor: "avatar" | "background"
  ) => void = (event, imageFor) => {
    const file: File = event.target.files![0];
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const processed: string = await resizeImage(reader.result as string);
      if (imageFor === "avatar") {
        setAvatarImage(processed);
      } else if (imageFor === "background") {
        setBackgroundImage(processed);
      } else {
        return;
      }
    };
    reader.onerror = () => {
      if (process.env.NODE_ENV === "development") {
        console.log(reader.error);
      }
    };
  };
  const handleSubmit = () => {
    console.log(`紹介文:${introduction.current?.value}\nアバター画像`);
  };

  const loginUserRef: DocumentReference<DocumentData> = doc(
    db,
    "users",
    `${loginUser.uid}`
  );

  useEffect(() => {
    if (isMounted === false) {
      return;
    }
    getDates();
    getDoc(loginUserRef).then(
      (userSnapshot: DocumentSnapshot<DocumentData>) => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setBackgroundURL(userSnapshot.data()!.backgroundURL);
        setBackgroundImage(userSnapshot.data()!.backgroundURL);
      }
    );
  }, []);

  return (
    <div>
      <button
        onClick={(event) => {
          event.preventDefault();
          navigate(-1);
        }}
      >
        戻る
      </button>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            onChangeImageHandler(event, "avatar");
          }}
        />
        <img
          src={
            loginUser.avatarURL
              ? avatarImage
                ? avatarImage
                : loginUser.avatarURL
              : `${process.env.PUBLIC_URL}/noAvatar.png}`
          }
          alt="アバター画像"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            onChangeImageHandler(event, "background");
          }}
        />
        <img
          src={
            backgroundImage !== ""
              ? backgroundImage
              : `${process.env.PUBLIC_URL}/noPhoto.png`
          }
          alt="背景画像"
        />
        <button
          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            event.preventDefault();
            backgroundImage === backgroundURL
              ? setBackgroundImage("")
              : setBackgroundImage(backgroundURL);
          }}
        >
          <CloseRounded />
        </button>
        <input
          type="text"
          ref={displayName}
          defaultValue={loginUser.displayName}
        />
        <textarea ref={introduction} defaultValue={loginUser.introduction} />
        <input type="submit" value="登録する" />
        {loginUser.userType === "normal" && (
          <div>
            <select ref={birthdayYear}>
              {years.map((year: number) => {
                return <option key={year}>{year}</option>;
              })}
            </select>
            <label>年</label>
            <select
              ref={birthdayMonth}
              onChange={(event) => {
                event.preventDefault();
                getDates();
              }}
            >
              {months.map((month: number) => {
                return <option key={month}>{month}</option>;
              })}
            </select>
            <label>月</label>
            <select ref={birthday}>
              {dates.map((date: number) => {
                return <option key={date}>{date}</option>;
              })}
            </select>
            <label>日</label>
            <input type="text" ref={skill1} />
          </div>
        )}
      </form>
    </div>
  );
};

export default NewSetting;
