import { db } from "../firebase";
import {
  doc,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

export const addLikes: (postId: string, loginUid: string) => void = async (
  postId,
  loginUid
) => {
  const loginUserRef: DocumentReference<DocumentData> = doc(
    db,
    `users/${loginUid}`
  );
  const likeUserRef: DocumentReference<DocumentData> = doc(
    db,
    `posts/${postId}/likeUsers/${loginUid}`
  );
  const loginUserSnap: DocumentSnapshot<DocumentData> = await getDoc(
    loginUserRef
  );
  const likeUserSnap: DocumentSnapshot<DocumentData> = await getDoc(
    likeUserRef
  );
  if (!likeUserSnap.exists()) {
    setDoc(likeUserRef, {
      avatarURL: loginUserSnap.data()!.avatarURL,
      displayName: loginUserSnap.data()!.displayName,
      introduction: loginUserSnap.data()!.introduction,
      uid: loginUid,
      username: loginUserSnap.data()!.username,
      userType: loginUserSnap.data()!.userType,
    });
  } else {
    deleteDoc(likeUserRef);
  }
};
