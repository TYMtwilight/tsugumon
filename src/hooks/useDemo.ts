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
import { getRandomString } from "../functions/GetRandomString";
import { resizeImage } from "../functions/ResizeImage";
import { splitByHash } from "../functions/SplitByHash";

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
      username: string;
      displayName: string;
      image: string;
      caption: string;
      tags: string;
      timestamp: string;
    }
  ];
  option: {
    achademicHistory: string;
    address: string;
    birthdate: string;
    owner: string;
    skill1: string;
    skill2: string;
    skill3: string;
    typeOfWork: string;
  };
}

interface Post {
  uid: string;
  username: string;
  displayName: string;
  avatarURL: string;
  imageURL: string;
  caption: string;
  tags: string[];
  timestamp: Date;
}

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
    const fetchedUsers: FetchedUser[] = await object.users;
    for (let fetchedUser of fetchedUsers) {
      createUserWithEmailAndPassword(
        auth,
        fetchedUser.email,
        fetchedUser.password
      ).then(async (userCredential: UserCredential) => {
        const user: User = userCredential.user;
        const uid: string = user.uid;
        const avatarRef: StorageReference = ref(storage, `avatars/${uid}`);
        const avatarBuffer: ArrayBuffer = await (
          await fetch(`${process.env.PUBLIC_URL}/${fetchedUser.avatar}`)
        ).arrayBuffer();
        const avatarOrigin: string = arrayBufferToDataURL(avatarBuffer);
        const avatarImage: string = await resizeImage(avatarOrigin);
        const backgroundRef: StorageReference = ref(
          storage,
          `backgrounds/${uid}`
        );
        const backgroundBuffer: ArrayBuffer = await (
          await fetch(`${process.env.PUBLIC_URL}/${fetchedUser.background}`)
        ).arrayBuffer();
        const backgroundOrigin: string = arrayBufferToDataURL(backgroundBuffer);
        const backgroundImage: string = await resizeImage(backgroundOrigin);
        await uploadString(avatarRef, avatarImage, "data_url")
          .then(() => {
            uploadString(backgroundRef, backgroundImage, "data_url");
          })
          .then(async () => {
            const avatarURL: string = await getDownloadURL(avatarRef);
            // const backgroundURL: string = await getDownloadURL(backgroundRef);
            // NOTE >> ユーザーアカウントのプロフィール情報をアップデートします
            await updateProfile(user, {
              displayName: fetchedUser.displayName,
              photoURL: avatarURL,
            });
            const userRef: DocumentReference<DocumentData> = doc(
              db,
              `users/${uid}`
            );
            await setDoc(userRef, {
              avatarURL: avatarURL,
              backgroundURL: "backgroundURL",
              displayName: user.displayName,
              introduction: fetchedUser.introduction,
              uid: uid,
              userType: fetchedUser.userType,
              username: fetchedUser.username,
            });
            const usernameRef: DocumentReference<DocumentData> = doc(
              db,
              `usernames/${uid}`
            );
            setDoc(usernameRef, {
              uid: uid,
              username: fetchedUser.username,
            });
            const optionRef: DocumentReference<DocumentData> = doc(
              db,
              `option/${uid}/`
            );
            const birthdate: Date | null = fetchedUser.option.birthdate
              ? new Date(Date.parse(fetchedUser.option.birthdate))
              : null;
            await setDoc(optionRef, {
              achademicHistory: fetchedUser.option.achademicHistory,
              address: fetchedUser.option.address,
              birthdate: birthdate,
              owner: fetchedUser.option.owner,
              skill1: fetchedUser.option.skill1,
              skill2: fetchedUser.option.skill2,
              skill3: fetchedUser.option.skill3,
              typeOfWork: fetchedUser.option.typeOfWork,
              uid: uid,
              username: fetchedUser.username,
              userType: fetchedUser.userType,
            });
            if (fetchedUser.userType === "business") {
              const postsData = fetchedUser.posts;
              for (let postData of postsData) {
                const imageRef: StorageReference = ref(
                  storage,
                  `posts/${uid}/${getRandomString()}`
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
                    `posts/${getRandomString()}`
                  );
                  const tags: string[] = splitByHash(postData.tags);
                  const post: Post = {
                    uid: uid,
                    username: postData.username,
                    displayName: postData.displayName,
                    avatarURL: avatarURL,
                    imageURL: url,
                    caption: postData.caption,
                    tags: tags,
                    timestamp: new Date(postData.timestamp),
                  };
                  await setDoc(postRef, post);
                  setProgress("done");
                });
              }
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
