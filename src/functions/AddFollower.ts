import { db } from "../firebase";
import {
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

interface UserData {
  avatarURL: string;
  displayName: string;
  username: string;
  userType: "business" | "normal" | null;
}

export const addFollower: (
  followerUID: string,
  followingUID: string,
  followerData: UserData,
  followingData: UserData
) => void = async (
  followerUID,
  followingUID,
  followerData,
  followingData
) => {
  const followerRef = doc(db, `users/${followingUID}/followers/${followerUID}`);
  const followingRef = doc(
    db,
    `users/${followerUID}/followings/${followingUID}`
  );
  const followerSnap: DocumentSnapshot<DocumentData> = await getDoc(
    followerRef
  );
  const followingSnap: DocumentSnapshot<DocumentData> = await getDoc(
    followingRef
  );
  if (!followerSnap.exists()) {
    setDoc(followerRef, followerData);
  } else {
    deleteDoc(followerRef);
  }
  if (!followingSnap.exists()) {
    setDoc(followingRef, followingData);
  } else {
    deleteDoc(followingRef);
  }
};
