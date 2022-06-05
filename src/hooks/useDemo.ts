import { useState, useEffect } from "react";
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
  username: string;
  displayName: string;
  avatarURL: string;
  imageURL: string;
  caption: string;
  updatedAt: Date;
}

interface FetchedData {
  uid: string;
  username: string;
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
  const [progress, setProgress] = useState<"wait" | "run" | "done">("wait");

  const upload = async (isMounted: boolean) => {
    setProgress("run");
    fetch("data.json")
      .then((response: Response) => {
        return response.json();
      })
      .then((dataset: Dataset) => {
        dataset.posts.forEach(async (data) => {
          const uid: string = data.uid;
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
                    uid: uid,
                    username: data.username,
                    displayName: data.displayName,
                    avatarURL: data.avatarURL,
                    imageURL: downloadURL,
                    caption: data.caption,
                    updatedAt: new Date(data.updatedDate),
                  };
                  if (isMounted) {
                    await setDoc(postRef, postData);
                  }
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
      });
  };

  useEffect(() => {
    let isMounted = true;
    let abortControl = new AbortController();
    if (uploadDemo) {
      upload(isMounted);
    } else {
      if (isMounted) {
        setProgress("wait");
      }
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
console.log("It's OK");
export default useDemo;
