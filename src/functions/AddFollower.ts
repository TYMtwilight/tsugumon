import { db } from "../firebase";
import {
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

interface FollowUser {
  avatarURL: string;
  displayName: string;
  uid: string;
  username: string;
  userType: "business" | "normal" | null;
}

export const addFollower: (
  following: FollowUser,
  follower: FollowUser
) => void = async (following, follower) => {
  const followerRef = doc(
    db,
    `users/${following.uid}/followers/${follower.uid}`
  );
  const followingRef = doc(
    db,
    `users/${follower.uid}/followings/${following.uid}`
  );
  const followerSnap: DocumentSnapshot<DocumentData> = await getDoc(
    followerRef
  );
  const followingSnap: DocumentSnapshot<DocumentData> = await getDoc(
    followingRef
  );
  if (!followerSnap.exists()) {
    setDoc(followerRef, follower);
  } else {
    deleteDoc(followerRef);
  }
  if (!followingSnap.exists()) {
    setDoc(followingRef, following);
  } else {
    deleteDoc(followingRef);
  }
};
