import { useState } from "react";
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

export const useBatch = () => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const loginUser: LoginUser = useAppSelector(selectUser);
  const batch: WriteBatch = writeBatch(db);

  const setBatch: (
    postImage: string,
    caption: string,
    tagString: string
  ) => Promise<void> = async (postImage, caption, tagString) => {
    // NOTE >> 投稿データをpostコレクションに保存します
    setIsUploading(true);
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
        await getDownloadURL(imageRef).then(async (downloadURL: string) => {
          // TODO >> フォローしているユーザーのFeedドキュメントにpostDataを書き込む処理を実装する
          const postId: string = getRandomString();
          const tags = splitBySpace(tagString);
          const postRef: DocumentReference<DocumentData> = doc(
            db,
            `posts/${postId}`
          );
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
        });
      })
      .catch((error: any) => {
        alert(`エラーが発生しました\n${error.message}`);
      })
      .finally(() => {
        setIsUploading(false);
      });
  };
  return (
    <>
      <div>
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    </>
  );
};
