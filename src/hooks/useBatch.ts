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
  collection,
  CollectionReference,
  getDocs,
  QuerySnapshot,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { getRandomString } from "../functions/GetRandomString";
import { splitBySpace } from "../functions/SplitBySpace";

interface Post {
  uid: string;
  username: string;
  displayName: string;
  avatarURL: string;
  imageURL: string;
  caption: string;
  tags: string[];
  timestamp: FieldValue;
}

export const useBatch: (
  upload: boolean,
  postImage: string,
  caption: string,
  tagString: string
) => "wait" | "run" | "done" = (upload, postImage, caption, tagString) => {
  const [progress, setProgress] = useState<"wait" | "run" | "done">("wait");
  const loginUser: LoginUser = useAppSelector(selectUser);
  const batch: WriteBatch = writeBatch(db);
  console.log(tagString);
  const tags = splitBySpace(tagString);

  const setBatch: (downloadURL: string) => Promise<void> = async (
    downloadURL
  ) => {
    const postId: string = getRandomString();
    const postRef: DocumentReference<DocumentData> = doc(db, `posts/${postId}`);
    // TODO >> フォローしているユーザーのUIDを参照するコードを作成する
    const postData: Post = {
      uid: loginUser.uid,
      username: loginUser.username,
      displayName: loginUser.displayName,
      avatarURL: loginUser.avatarURL,
      imageURL: downloadURL,
      caption: caption,
      tags: tags,
      timestamp: serverTimestamp(),
    };
    batch.set(postRef, postData);
    const followersRef: CollectionReference<DocumentData> = collection(
      db,
      `users/${loginUser.uid}/followers`
    );
    const followersSnap: QuerySnapshot<DocumentData> = await getDocs(
      followersRef
    );
    const followersUidArray: string[] = followersSnap.docs.map(
      (followerSnap: QueryDocumentSnapshot<DocumentData>) => {
        return followerSnap.id;
      }
    );

    followersUidArray.forEach((followerUid: string) => {
      const feedRef: DocumentReference<DocumentData> = doc(
        db,
        `users/${followerUid}/feeds/${postId}`
      );
      batch.set(feedRef, postData);
    });
  };

  useEffect(() => {
    if (upload) {
      setProgress("run");
      const filename: string = getRandomString();
      const imageRef: StorageReference = ref(
        storage,
        `posts/${loginUser.uid}/${filename}`
      );
      const uploadPromise: Promise<UploadResult> = uploadString(
        imageRef,
        postImage,
        "data_url"
      );
      uploadPromise
        .then(async () => {
          await getDownloadURL(imageRef).then(async (downloadURL: string) => {
            // TODO >> フォローしているユーザーのFeedドキュメントにpostDataを書き込む処理を実装する
            setBatch(downloadURL).then(() => {
              batch.commit().then(() => {
                setProgress("done");
              });
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
