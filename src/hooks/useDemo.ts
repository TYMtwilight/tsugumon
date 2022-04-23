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
  writeBatch,
  WriteBatch,
  DocumentData,
} from "firebase/firestore";

interface PostData {
  uid: string;
  displayName: string;
  avatarURL: string;
  imageURL: string;
  caption: string;
  updatedAt: Date;
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
  const displayName: string = user.displayName;
  const avatarURL: string = user.avatarURL;
  const [progress, setProgress] = useState<"wait" | "run" | "done">("wait");
  const caption = "この夕焼けを見てると、今日も1日頑張ったな〜ってなります";

  useEffect(() => {
    if (uploadDemo) {
      setProgress("run");
      const filename: string = getRandomString();
      const imageRef: StorageReference = ref(
        storage,
        `posts/${uid}/${filename}`
      );
      const upload = async () => {
        const res: Response = await fetch(
          `${process.env.PUBLIC_URL}/demo/1.jpg`
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
                  displayName: displayName,
                  avatarURL: avatarURL,
                  imageURL: downloadURL,
                  caption: caption,
                  updatedAt: new Date(),
                };
                const batch: WriteBatch = writeBatch(db);
                batch.set(postRef, postData);
                await batch
                  .commit()
                  .then(() => {
                    setProgress("done");
                  })
                  .catch((e: any) => {
                    if (process.env.PUBLIC_URL === "development") {
                      console.log(`エラーが発生しました\n${e.message}`);
                    }
                  });
              })
              .catch((e: any) => {
                if (process.env.PUBLIC_URL === "development") {
                  console.log(`エラーが発生しました\n${e.message}`);
                }
              });
          })
          .catch((e: any) => {
            if (process.env.PUBLIC_URL === "development") {
              console.log(`エラーが発生しました\n${e.message}`);
            }
          });
      };
      upload();
    } else {
      setProgress("wait");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadDemo]);
  return progress;
};
