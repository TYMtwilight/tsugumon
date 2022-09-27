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
  QuerySnapshot,
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
import { checkIsUnique } from "../functions/useCheckIsUnique";
import ArrowBackRounded from "@mui/icons-material/ArrowBackIosNewRounded";
import PhotoLibraryOutlined from "@mui/icons-material/PhotoLibraryOutlined";
import PersonOutline from "@mui/icons-material/PersonOutline";
import CloseRounded from "@mui/icons-material/CloseRounded";

const SettingNormal = () => {
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [avatarImage, setAvatarImage] = useState<string>("");
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const [username, setUsername] = useState<{
    patternCheck: boolean;
    uniqueCheck: boolean;
    input: string;
  }>({
    patternCheck: true,
    uniqueCheck: true,
    input: "",
  });
  const [displayName, setDisplayName] = useState<string>("");
  const [isUnique, setIsUnique] = useState<boolean>(true);
  const [dates, setDates] = useState<number[]>([]);
  const address = useRef<HTMLInputElement>(null);
  const birthdayYear = useRef<HTMLSelectElement>(null);
  const birthdayMonth = useRef<HTMLSelectElement>(null);
  const birthday = useRef<HTMLSelectElement>(null);
  const introduction = useRef<HTMLTextAreaElement>(null);
  const skill1 = useRef<HTMLInputElement>(null);
  const skill2 = useRef<HTMLInputElement>(null);
  const skill3 = useRef<HTMLInputElement>(null);

  const navigate: NavigateFunction = useNavigate();
  const loginUser: LoginUser = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  let isMounted: boolean = true;

  let years: number[] = [];
  const thisYear: number = new Date().getFullYear();
  for (let i = thisYear; i >= thisYear - 100; i--) {
    years.push(i);
  }
  const months: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const loginUserRef: DocumentReference<DocumentData> = doc(
    db,
    "users",
    `${loginUser.uid}`
  );

  const optionRef: DocumentReference<DocumentData> = doc(
    db,
    "option",
    `${loginUser.uid}`
  );

  const postsQuery = query(
    collection(db, "posts"),
    where("uid", "==", loginUser.uid)
  );

  const avatarRef: StorageReference = ref(storage, `avatars/${loginUser.uid}`);
  const backgroundRef: StorageReference = ref(
    storage,
    `backgrounds/${loginUser.backgroundURL}`
  );

  const getUser = async () => {
    setAvatarImage(loginUser.avatarURL);
    setBackgroundImage(loginUser.backgroundURL);
    setDisplayName(loginUser.displayName);
    setUsername({
      patternCheck: true,
      uniqueCheck: true,
      input: loginUser.username.slice(1),
    });
    introduction.current!.value = loginUser.introduction;
    getDoc(optionRef).then((optionSnap: DocumentSnapshot<DocumentData>) => {
      address.current!.value = optionSnap.data()!.address;
      skill1.current!.value = optionSnap.data()!.skill1;
      skill2.current!.value = optionSnap.data()!.skill2;
      skill3.current!.value = optionSnap.data()!.skill3;
      const fetchedDate: Date | null = optionSnap.data()!.birthdate
        ? optionSnap.data()!.birthdate.toDate()
        : null;
      if (fetchedDate) {
        birthdayYear.current!.value = fetchedDate.getFullYear().toString();
        birthdayMonth.current!.value = (fetchedDate.getMonth() + 1).toString();
        getDates();
        birthday.current!.value = fetchedDate.getDate().toString();
      }
    });
    setIsFetched(true);
  };

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
  const handleSubmit = async () => {
    let avatarURL: string = "";
    if (avatarImage !== loginUser.avatarURL) {
      if (avatarImage) {
        await uploadString(avatarRef, avatarImage, "data_url");
        avatarURL = await getDownloadURL(avatarRef);
      } else {
        deleteObject(avatarRef);
      }
    } else {
      avatarURL = loginUser.avatarURL!;
    }

    let backgroundURL: string = "";
    if (backgroundImage !== loginUser.backgroundURL) {
      if (backgroundImage) {
        await uploadString(backgroundRef, backgroundImage, "data_url");
        backgroundURL = await getDownloadURL(backgroundRef);
      } else {
        deleteObject(backgroundRef);
      }
    } else {
      backgroundURL = loginUser.backgroundURL;
    }

    const birthdate: Date = new Date(
      parseInt(birthdayYear.current!.value),
      // NOTE >> プルダウンでは1月スタートになっているため、
      //         birthdayMonth.currentの値を-1してあげる必要が
      //         あります
      parseInt(birthdayMonth.current!.value) - 1,
      parseInt(birthday.current!.value)
    );

    dispatch(
      setUserProfile({
        avatarURL: avatarURL,
        backgroundURL: backgroundURL,
        displayName: displayName,
        username: `@${username.input}`,
      })
    );
    updateDoc(loginUserRef, {
      avatarURL: avatarURL,
      backgroundURL: backgroundURL,
      displayName: displayName,
      introduction: introduction.current!.value,
      username: `@${username.input}`,
    });
    updateDoc(optionRef, {
      address: address.current!.value,
      birthdate: birthdate,
    });
    updateProfile(auth.currentUser!, {
      displayName: displayName,
      photoURL: avatarURL,
    });
    getDocs(postsQuery)
      .then((posts: QuerySnapshot<DocumentData>) => {
        posts.forEach((post) => {
          const postRef = doc(db, "posts", post.id);
          updateDoc(postRef, {
            username: `@${username.input}`,
            displayName: displayName,
            avatarURL: avatarURL,
          });
        });
      })
      .then(() => {
        getDoc(optionRef).then((userSnap: DocumentSnapshot<DocumentData>) => {
          setTimeout(() => {
            navigate(`/${userSnap.data()!.username}`);
          }, 300);
        });
      });
  };

  useEffect(() => {
    if (isMounted === false) {
      return;
    }
    getUser();
    getDates();
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isMounted = false;
    };
  }, [isFetched]);

  return (
    <div className="pb-12 bg-slate-100">
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
        <p className="w-40 mx-auto font-bold">プロフィールの編集</p>
      </div>
      <div className="mt-12">
        <div className="flex relative justify-center items-center w-screen h-44">
          <img
            className="w-screen h-44 object-cover brightness-75"
            src={
              backgroundImage
                ? backgroundImage
                : `${process.env.PUBLIC_URL}/noPhoto.png`
            }
            alt="背景画像"
          />
          <input
            id="backgroundInput"
            type="file"
            accept="image/*"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              event.preventDefault();
              onChangeImageHandler(event, "background");
            }}
            hidden
          />
          <label
            className="flex absolute left-4 text-slate-100 hover:cursor-pointer"
            htmlFor="backgroundInput"
          >
            <PhotoLibraryOutlined fontSize="large" />
            <p className="ml-4 leading-8">背景を選択</p>
          </label>
          <button
            className="absolute right-4 bottom-4 p-2 rounded-full border border-slate-100 text-slate-100"
            onClick={(
              event: React.MouseEvent<HTMLButtonElement, MouseEvent>
            ) => {
              event.preventDefault();
              setBackgroundImage("");
            }}
            disabled={!backgroundImage}
          >
            <CloseRounded />
          </button>
        </div>
        <div className="relative">
          <input
            id="avatarInput"
            type="file"
            accept="image/*"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              event.preventDefault();
              onChangeImageHandler(event, "avatar");
            }}
            hidden
          />
          {avatarImage ? (
            <img
              className="-mt-8 ml-4 w-20 h-20 border-4 border-slate-100 rounded-full object-cover brightness-75"
              src={avatarImage}
              alt="アバター画像"
            />
          ) : (
            <div className="-mt-8 ml-4 w-20 h-20 border-4 border-slate-100 bg-slate-500 rounded-full" />
          )}
          <label
            className="absolute flex justify-center items-center w-20 h-20 border-4 top-0 left-4 border-slate-100 rounded-full text-slate-100 hover:cursor-pointer"
            htmlFor="avatarInput"
          >
            <div className="box rounded-full">
              <PersonOutline fontSize="large" />
            </div>
          </label>
          <button
            className="absolute bottom-0 left-24 p-1 border border-slate-500 rounded-full text-slate-500"
            onClick={(
              event: React.MouseEvent<HTMLButtonElement, MouseEvent>
            ) => {
              event.preventDefault();
              setAvatarImage("");
            }}
            disabled={!avatarImage}
          >
            <CloseRounded />
          </button>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <p className="text-sm text-slate-500">ユーザー名</p>
            <input
              className="h-8 w-full p-4 bg-slate-200 rounded-md"
              type="text"
              value={username.input}
              onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                event.preventDefault();
                setUsername(await checkUsername(event.target.value));
              }}
            />
            <p className="text-sm text-slate-500">
              {username.uniqueCheck === false &&
                "既に使用されているユーザー名です。"}
            </p>
            <p className="text-sm text-slate-500">
              {username.patternCheck === false &&
                "入力できない文字が含まれいます。"}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-slate-500">氏名</p>
            <input
              className="h-8 w-full p-4 bg-slate-200 rounded-md"
              type="text"
              value={displayName}
              onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                setDisplayName(event.target.value);
              }}
              onBlur={async (
                event: React.FocusEvent<HTMLInputElement, Element>
              ) => {
                event.preventDefault();
                setIsUnique(
                  await checkIsUnique(displayName, loginUser.displayName)
                );
              }}
            />
          </div>
          <p className="text-sm text-slate-500">
            {isUnique === false && "その氏名は既に使用されています。"}
          </p>
          <div className="mb-4">
            <p className="text-sm text-slate-500">紹介文</p>
            <textarea
              className="w-full h-32 p-2 border-none bg-slate-200 rounded-md resize-none"
              ref={introduction}
              defaultValue={loginUser.introduction}
            />
          </div>
          <div className="mb-4">
            <p className="text-sm text-slate-500">資格・技能</p>
            <input
              id="skill1"
              className="h-8 w-full p-4 mb-2 bg-slate-200 rounded-md"
              type="text"
              ref={skill1}
            />
            <input
              className="h-8 w-full p-4 mb-2 bg-slate-200 rounded-md"
              type="text"
              ref={skill2}
            />
            <input
              id="skill3"
              className="h-8 w-full p-4 mb-2 bg-slate-200 rounded-md"
              type="text"
              ref={skill3}
            />
          </div>
          <div className="mb-4">
            <p className="text-sm text-slate-500">生年月日</p>
            <div className="flex items-center h-8 w-full p-4 bg-slate-200 rounded-md">
              <select
                className="bg-slate-100"
                ref={birthdayYear}
                onChange={(event) => {
                  event.preventDefault();
                  getDates();
                }}
              >
                {years.map((year: number) => {
                  return <option key={year}>{year}</option>;
                })}
              </select>
              <label>年</label>
              <select
                className="bg-slate-100"
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
              <select className="bg-slate-100" ref={birthday}>
                {dates.map((date: number) => {
                  return <option key={date}>{date}</option>;
                })}
              </select>
              <label>日</label>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-sm text-slate-500">住所</p>
            <input
              className="h-8 w-full p-4 bg-slate-200 rounded-md "
              ref={address}
            />
          </div>
        </div>
        <button
          className="block w-24 h-8 m-auto border rounded-full font-bold border-emerald-500 text-emerald-500 hover:border-none hover:bg-emerald-500 hover:text-slate-100 disabled:border-slate-400 disabled:text-slate-400 disabled:bg-slate-300"
          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            event.preventDefault();
            handleSubmit();
          }}
          disabled={
            !isUnique ||
            !username.patternCheck ||
            !username.uniqueCheck ||
            username.input === ""
          }
        >
          登録する
        </button>
      </div>
    </div>
  );
};

export default SettingNormal;
