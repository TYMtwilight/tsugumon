import { useState, useEffect } from "react";
import { db, storage, auth } from "../firebase";
import {
  ref,
  getDownloadURL,
  StorageReference,
  uploadBytes,
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

interface FetchedUser {
  email: string;
  username: string;
  password: string;
  displayName: string;
  avatar: string;
  userType: string;
  introduction: string;
  background: string;
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
        const avatarImage: ArrayBuffer = await (
          await fetch(`${process.env.PUBLIC_URL}/${userData.avatar}`)
        ).arrayBuffer();
        const backgroundRef: StorageReference = ref(
          storage,
          `backgrounds/${uid}`
        );
        const backgroundImage: ArrayBuffer = await (
          await fetch(`${process.env.PUBLIC_URL}/${userData.background}`)
        ).arrayBuffer();
        await uploadBytes(avatarRef, avatarImage)
          .then(async () => {
            await uploadBytes(backgroundRef, backgroundImage);
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
              const postImage: ArrayBuffer = await (
                await fetch(`${process.env.PUBLIC_URL}/${postData.image}`)
              ).arrayBuffer();
              uploadBytes(imageRef, postImage).then(async () => {
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
