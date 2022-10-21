import { db } from "../firebase";
import {
  DocumentData,
  collection,
  getDocs,
  where,
  query,
  Query,
} from "firebase/firestore";

export const checkUsername: (input: string) => Promise<{
  patternCheck: boolean;
  uniqueCheck: boolean;
  input: string;
}> = async (input) => {
  console.log("checkUsernameが実行されました");
  const checkIsSafe: () => boolean = () => {
    let isSafe: boolean = true;
    const regex: RegExp = /^[a-z|A-Z|0-9|_]+$/;
    if (input.length > 0) {
      isSafe = regex.test(input);
    }
    return isSafe;
  };
  const checkIsUnique: () => Promise<boolean> = async () => {
    const usernamesQuery: Query<DocumentData> = query(
      collection(db, "usernames"),
      where("username", "==", `@${input}`)
    );
    const isUnique: boolean = await getDocs(usernamesQuery).then((usernamesSnap) => {
      if (usernamesSnap.docs.length === 0) {
        return true;
      } else {
        return false;
      }
    });
    return isUnique;
  };
  const result = {
    patternCheck: checkIsSafe(),
    uniqueCheck: await checkIsUnique(),
    input: input,
  };
  return result;
};
