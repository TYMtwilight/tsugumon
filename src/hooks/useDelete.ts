import { useState, useEffect } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectUser, LoginUser } from "../features/userSlice";
import { db, storage } from "../firebase";
import { ref, StorageReference, deleteObject } from "firebase/storage";
import {
  doc,
  DocumentReference,
  deleteDoc,
  DocumentData,
  collection,
  CollectionReference,
  getDocs,
  QuerySnapshot,
  QueryDocumentSnapshot,
  getDoc,
  DocumentSnapshot,
} from "firebase/firestore";

export const useDelete: (
  execute: boolean,
  postId: string
) => "wait" | "run" | "done" = (execute, postId) => {
  let isMounted: boolean = true;
  const navigate: NavigateFunction = useNavigate();
  const [progress, setProgress] = useState<"wait" | "run" | "done">("wait");
  const loginUser: LoginUser = useAppSelector(selectUser);

  const setDelete: () => Promise<void> = async () => {
    let imageLocation: string = "";
    const postRef: DocumentReference<DocumentData> = doc(db, `posts/${postId}`);
    navigate(-1);
    if (isMounted === false) {
      return;
    }
    getDoc(postRef)
      .then((postSnap: DocumentSnapshot) => {
        imageLocation = postSnap.data()!.imageLocation;
        deleteDoc(postRef);
      })
      .then(async () => {
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
          deleteDoc(feedRef);
        });
      })
      .then(() => {
        const imageRef: StorageReference = ref(storage, imageLocation);
        deleteObject(imageRef);
      })
      .then(() => {
        setProgress("done");
      })
      .catch((error: any) => {
        alert(`エラーが発生しました\n${error.message}`);
      });
  };

  useEffect(() => {
    if (execute) {
      setProgress("run");
      setDelete();
    } else {
      setProgress("wait");
    }
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execute]);
  return progress;
};
