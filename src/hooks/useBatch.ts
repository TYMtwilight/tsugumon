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
  DocumentData,
  collection,
  CollectionReference,
  getDocs,
  QuerySnapshot,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { getRandomString } from "../functions/GetRandomString";
import { splitBySpace } from "../functions/SplitBySpace";
import { Post } from "../interfaces/Post";

export const useBatch: (
  upload: boolean,
  postImage: string,
  caption: string,
  tagString: string
) => "wait" | "run" | "done" = (upload, postImage, caption, tagString) => {
  let isMounted: boolean = true;
  const [progress, setProgress] = useState<"wait" | "run" | "done">("wait");
  const loginUser: LoginUser = useAppSelector(selectUser);
  const batch: WriteBatch = writeBatch(db);
  const tags = splitBySpace(tagString);

  const setBatch: (
    downloadURL: string,
    imageLocation: string
  ) => Promise<void> = async (downloadURL, imageLocation) => {
    // NOTE >> 投稿データをpostコレクションに保存します
    const postId: string = getRandomString();
    const postRef: DocumentReference<DocumentData> = doc(db, `posts/${postId}`);
    const postData: Post = {
      avatarURL: loginUser.avatarURL,
      caption: caption,
      displayName: loginUser.displayName,
      imageLocation: imageLocation,
      imageURL: downloadURL,
      tags: tags,
      timestamp: serverTimestamp(),
      uid: loginUser.uid,
      username: loginUser.username,
    };
    if (isMounted === false) {
      return;
    }
    batch.set(postRef, postData);
    // NOTE >> 投稿データをフォロワーのfeedコレクションに保存します
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
      const imageLocation: string = `posts/${loginUser.uid}/${filename}`;
      const imageRef: StorageReference = ref(storage, imageLocation);
      const uploadPromise: Promise<UploadResult> = uploadString(
        imageRef,
        postImage,
        "data_url"
      );
      uploadPromise
        .then(async () => {
          await getDownloadURL(imageRef).then((downloadURL: string) => {
            // TODO >> フォローしているユーザーのFeedドキュメントにpostDataを書き込む処理を実装する
            setBatch(downloadURL, imageLocation).then(() => {
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
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upload]);
  return progress;
};
export default useBatch;
