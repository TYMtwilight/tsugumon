import { useState, useEffect } from "react";
import { db, storage, auth } from "../firebase";
import {
  ref,
  getDownloadURL,
  StorageReference,
  uploadString,
} from "firebase/storage";
import {
  doc,
  DocumentReference,
  DocumentData,
  setDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  User,
  UserCredential,
} from "firebase/auth";
import { resizeImage } from "../functions/ResizeImage";

interface FetchedUser {
  email: string;
  username: string;
  password: string;
  displayName: string;
  avatar: string;
  userType: string;
  introduction: string;
  background: string;
  cropsTags: string[];
  posts: [
    {
      uid: string;
      username: string;
      displayName: string;
      avatarURL: string;
      image: string;
      caption: string;
      timestamp: string;
    }
  ];
  option: "business" | "normal";
  business?: {
    address: string;
    owner: string;
    typeOfWork: string;
  };
  normal?: {
    birthdate: string;
    skill: string;
  };
}

interface Post {
  uid: string;
  username: string;
  displayName: string;
  avatarURL: string;
  imageURL: string;
  caption: string;
  timestamp: Date;
}

const getUniqueName: () => string = () => {
  const S: string =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const N: number = 16;
  const randomValues: number[] = Array.from(
    crypto.getRandomValues(new Uint32Array(N))
  );
  const randomString: string = randomValues
    .map((n) => S[n % S.length])
    .join("");
  const uniqueName: string = randomString;
  return uniqueName;
};

const arrayBufferToDataURL: (buffer: ArrayBuffer) => string = (buffer) => {
  let binaryString: string = "";
  const bytes: Uint8Array = new Uint8Array(buffer);
  const length: number = bytes.length;
  for (let i = 0; i < length; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }
  const base64 = window.btoa(binaryString);
  return `data:image/jpeg;base64,${base64}`;
};

export const useDemo: (uploadDemo: boolean) => "wait" | "run" | "done" = (
  uploadDemo
) => {
  const [progress, setProgress] = useState<"wait" | "run" | "done">("wait");
  const registData: () => void = async () => {
    setProgress("run");
    const response: Response = await fetch("data.json");
    const object: any = await response.json();
    const usersData: FetchedUser[] = await object.users;
    for (let userData of usersData) {
      createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      ).then(async (userCredential: UserCredential) => {
        const user: User = userCredential.user;
        const uid: string = user.uid;
        const avatarRef: StorageReference = ref(storage, `avatars/${uid}`);
        const avatarBuffer: ArrayBuffer = await (
          await fetch(`${process.env.PUBLIC_URL}/${userData.avatar}`)
        ).arrayBuffer();
        const avatarOrigin: string = arrayBufferToDataURL(avatarBuffer);
        const avatarImage: string = await resizeImage(avatarOrigin);
        const backgroundRef: StorageReference = ref(
          storage,
          `backgrounds/${uid}`
        );
        const backgroundBuffer: ArrayBuffer = await (
          await fetch(`${process.env.PUBLIC_URL}/${userData.background}`)
        ).arrayBuffer();
        const backgroundOrigin: string = arrayBufferToDataURL(backgroundBuffer);
        const backgroundImage: string = await resizeImage(backgroundOrigin);
        await uploadString(avatarRef, avatarImage, "data_url")
          .then(async () => {
            await uploadString(backgroundRef, backgroundImage, "data_url");
          })
          .then(async () => {
            const avatarURL: string = await getDownloadURL(avatarRef);
            const backgroundURL: string = await getDownloadURL(backgroundRef);
            // NOTE >> ユーザーアカウントのプロフィール情報をアップデートします
            await updateProfile(user, {
              displayName: userData.displayName,
              photoURL: avatarURL,
            });
            const userRef: DocumentReference<DocumentData> = doc(
              db,
              `users/${uid}`
            );
            await setDoc(userRef, {
              avatarURL: avatarURL,
              backgroundURL: backgroundURL,
              cropsTags:userData.cropsTags,
              displayName: user.displayName,
              introduction: userData.introduction,
              userType: userData.userType,
              username: userData.username,
            });
            const optionRef: DocumentReference<DocumentData> = doc(
              db,
              `option/${uid}/`
            );
            if (userData.userType === "business") {
              await setDoc(optionRef, {
                address: userData.business!.address,
                birthdate: "",
                owner: userData.business!.owner,
                skill: "",
                typeOfWork: userData.business!.typeOfWork,
                username: userData.username,
                userType: userData.userType,
              });
            } else {
              await setDoc(optionRef, {
                address: "",
                birthdate: userData.normal!.birthdate,
                owner: "",
                skill: userData.normal!.skill,
                typeOfWork: "",
                username: userData.username,
                userType: userData.userType,
              });
            }
            const postsData = userData.posts;
            for (let postData of postsData) {
              const imageRef: StorageReference = ref(
                storage,
                `posts/${uid}/${getUniqueName()}`
              );
              const postBuffer: ArrayBuffer = await (
                await fetch(`${process.env.PUBLIC_URL}/${postData.image}`)
              ).arrayBuffer();
              const postOrigin: string = arrayBufferToDataURL(postBuffer);
              const postImage: string = await resizeImage(postOrigin);
              uploadString(imageRef, postImage, "data_url").then(async () => {
                const url: string = await getDownloadURL(imageRef);
                const postRef: DocumentReference<DocumentData> = doc(
                  db,
                  `posts/${getUniqueName()}`
                );
                const post: Post = {
                  uid: uid,
                  username: postData.username,
                  displayName: postData.displayName,
                  avatarURL: avatarURL,
                  imageURL: url,
                  caption: postData.caption,
                  timestamp: new Date(postData.timestamp),
                };
                await setDoc(postRef, post);
                setProgress("done");
              });
            }
          });
      });
    }
  };

  useEffect(() => {
    let isMounted = true;
    let abortControl = new AbortController();
    if (uploadDemo && isMounted) {
      registData();
    }

    return () => {
      abortControl.abort();
      isMounted = false;
      setProgress("wait");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadDemo]);
  return progress;
};
