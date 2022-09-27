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
      const birthdate: Date | null = optionSnap.data()!.birthdate
        ? optionSnap.data()!.birthdate.toDate()
        : null;
      if (birthdate) {
        birthdayYear.current!.value = birthdate.getFullYear().toString();
        birthdayMonth.current!.value = (birthdate.getMonth() + 1).toString();
        getDates();
        birthday.current!.value = birthdate.getDate().toString();
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

    let birthdate: Date = new Date(
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
    <div>
      <div>
        <button
          onClick={(event) => {
            event.preventDefault();
            navigate(-1);
          }}
        >
          <ArrowBackRounded />
        </button>
        <p>プロフィールの編集</p>
      </div>
      <div>
        <div>
          <img
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
          <label htmlFor="backgroundInput">
            <PhotoLibraryOutlined />
            <p>背景を選択</p>
          </label>
          <button
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
        <div>
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
          {avatarImage ? <img src={avatarImage} alt="アバター画像" /> : <div />}
          <label htmlFor="avatarInput">
            <div>
              <PersonOutline />
            </div>
          </label>
          <button
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
        <div>
          <div>
            <p>ユーザー名</p>
            <input
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
          <div>
            <p>氏名</p>
            <input
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
          <div>
            <p>紹介文</p>
            <textarea
              ref={introduction}
              defaultValue={loginUser.introduction}
            />
          </div>
          <div>
            <p>資格・技能</p>
            <label htmlFor="skill1">その１</label>
            <input id="skill1" type="text" ref={skill1} />
            <label htmlFor="skill2">その２</label>
            <input id="skill2" type="text" ref={skill2} />
            <label htmlFor="skill3">その３</label>
            <input id="skill3" type="text" ref={skill3} />
          </div>
          <div>
            <select
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
          </div>
          <div>
            <p>住所</p>
            <input ref={address} />
          </div>
        </div>
        <button
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
