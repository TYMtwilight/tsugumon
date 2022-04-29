import { useState, useEffect } from "react";
import { useAppSelector } from "../app/hooks";
import { selectUser, User } from "../features/userSlice";
import { db, storage } from "../firebase";
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  StorageReference,
  UploadTask,
} from "firebase/storage";
import {
  doc,
  DocumentReference,
  DocumentData,
  setDoc,
} from "firebase/firestore";

interface PostData {
  uid: string;
  displayName: string;
  avatarURL: string;
  imageURL: string;
  caption: string;
  updatedAt: Date;
}

interface FetchedData {
  uid: string;
  displayName: string;
  avatarURL: string;
  image: string;
  caption: string;
  updatedDate: string;
}

interface Dataset {
  posts: FetchedData[];
}

const getRandomString: () => string = () => {
  const S: string =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const N: number = 16;
  const randomValues: number[] = Array.from(
    crypto.getRandomValues(new Uint32Array(N))
  );
  const randomString: string = randomValues
    .map((n) => S[n % S.length])
    .join("");
  return randomString;
};

export const useDemo: (uploadDemo: boolean) => "wait" | "run" | "done" = (
  uploadDemo
) => {
  const user: User = useAppSelector(selectUser);
  const uid: string = user.uid;
  // const [ready, setReady] = useState<boolean>(false);
  const [progress, setProgress] = useState<"wait" | "run" | "done">("wait");

  let fetchedData: FetchedData[] = [];

  const fetchData: () => Promise<void> = async () => {
    // console.log(ready);
    await fetch("data.json")
      .then((response: Response) => {
        return response.json();
      })
      .then((dataset: Dataset) => {
        fetchedData = dataset.posts;
        if (process.env.NODE_ENV === "development") {
          console.log(fetchedData);
        }
      });
    // console.log(fetchedData.length);
    // if(fetchedData.length){console.log(true);}
    // console.log(ready);
  };

  const upload = async () => {
    setProgress("run");
    await fetchData();
    if (fetchedData.length > 0) {
      fetchedData.forEach(async (data) => {
        const filename: string = getRandomString();
        const imageRef: StorageReference = ref(
          storage,
          `posts/${uid}/${filename}`
        );
        const res: Response = await fetch(
          `${process.env.PUBLIC_URL}/${data.image}`
        );
        const postImage: ArrayBuffer = await res.arrayBuffer();
        const uploadTask: UploadTask = uploadBytesResumable(
          imageRef,
          postImage
        );
        uploadTask
          .then(async () => {
            await getDownloadURL(imageRef)
              .then(async (downloadURL: string) => {
                const postId: string = getRandomString();
                const postRef: DocumentReference<DocumentData> = doc(
                  db,
                  `users/${uid}/businessUser/${uid}/posts/${postId}`
                );
                const postData: PostData = {
                  uid: data.uid,
                  displayName: data.displayName,
                  avatarURL: data.avatarURL,
                  imageURL: downloadURL,
                  caption: data.caption,
                  updatedAt: new Date(data.updatedDate),
                };
                await setDoc(postRef, postData);
              })
              .catch((e: any) => {
                if (process.env.NODE_ENV === "development") {
                  console.log(`エラーが発生しました\n${e.message}`);
                }
              });
          })
          .catch((e: any) => {
            if (process.env.NODE_ENV === "development") {
              console.log(`エラーが発生しました\n${e.message}`);
            }
          });
      });

      setProgress("done");
      if (process.env.NODE_ENV === "development") {
        console.log("登録が完了しました");
      }
    } else {
      return;
    }
  };

  useEffect(() => {
    if (uploadDemo) {
      upload();
    } else {
      setProgress("wait");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadDemo]);
  return progress;
};

export default useDemo;
