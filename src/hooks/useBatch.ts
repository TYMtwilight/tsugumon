import { useState, useEffect } from "react";
import { useAppSelector } from "../app/hooks";
import { selectUser, LoginUser } from "../features/userSlice";
import { db, storage } from "../firebase";
import {
  ref,
  getDownloadURL,
  uploadString,
  StorageReference,
  UploadResult,
} from "firebase/storage";
import {
  doc,
  DocumentReference,
  writeBatch,
  serverTimestamp,
  WriteBatch,
  FieldValue,
  DocumentData,
} from "firebase/firestore";

interface PostData {
  uid: string;
  username: string;
  displayName: string;
  avatarURL: string;
  imageURL: string;
  caption: string;
  updatedAt: FieldValue;
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

export const useBatch: (
  upload: boolean,
  postImage: string,
  caption: string
) => "wait" | "run" | "done" = (upload, postImage, caption) => {
  const user: LoginUser = useAppSelector(selectUser);
  const uid: string = user.uid;
  const username: string = user.username;
  const displayName: string = user.displayName;
  const avatarURL: string = user.avatarURL;
  const [progress, setProgress] = useState<"wait" | "run" | "done">("wait");
  useEffect(() => {
    if (upload) {
      setProgress("run");
      const filename: string = getRandomString();
      const imageRef: StorageReference = ref(
        storage,
        `posts/${uid}/${filename}`
      );
      const uploadPromise: Promise<UploadResult> = uploadString(
        imageRef,
        postImage,
        "data_url"
      );
      uploadPromise
        .then(async () => {
          await getDownloadURL(imageRef).then(async (downloadURL: string) => {
            const postId: string = getRandomString();
            const postRef: DocumentReference<DocumentData> = doc(
              db,
              `posts/${postId}`
            );
            // TODO >> フォローしているユーザーのUIDを参照するコードを作成する
            const postData: PostData = {
              uid: uid,
              username: username,
              displayName: displayName,
              avatarURL: avatarURL,
              imageURL: downloadURL,
              caption: caption,
              updatedAt: serverTimestamp(),
            };
            const batch: WriteBatch = writeBatch(db);
            batch.set(postRef, postData);
            // TODO >> フォローしているユーザーのFeedドキュメントにpostDataを書き込む処理を実装する
            await batch.commit().then(() => {
              setProgress("done");
            });
          });
        })
        .catch((error: any) => {
          alert(`エラーが発生しました\n${error.message}`);
        });
    } else {
      setProgress("wait");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upload]);
  return progress;
};
export default useBatch;
