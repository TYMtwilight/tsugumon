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

interface UserData {
  avatarURL: string;
  displayName: string;
  uid: string;
  username: string;
  userType: "business" | "normal" | null;
}

export const addLikes: (postId: string, userData: UserData) => void = async (
  postId,
  userData
) => {
  const likePostRef: DocumentReference<DocumentData> = doc(
    db,
    `users/${userData.uid}/likePosts/${postId}`
  );
  const likeUserRef: DocumentReference<DocumentData> = doc(
    db,
    `posts/${postId}/likeUsers/${userData.uid}`
  );
  const likePostSnap: DocumentSnapshot<DocumentData> = await getDoc(
    likePostRef
  );
  const likeUserSnap: DocumentSnapshot<DocumentData> = await getDoc(
    likeUserRef
  );
  if (!likePostSnap.exists()) {
    setDoc(likePostRef, { timestamp: new Date() });
    if (!likeUserSnap.exists()) {
      setDoc(likeUserRef, userData);
    }
  } else if (likePostSnap.exists()) {
    deleteDoc(likePostRef);
    if (likeUserSnap.exists()) {
      deleteDoc(likeUserRef);
    }
  }
};
