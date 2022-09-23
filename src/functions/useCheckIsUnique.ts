import { db } from "../firebase";
import {
  DocumentData,
  collection,
  getDocs,
  where,
  query,
  Query,
} from "firebase/firestore";

export const checkIsUnique: (
  input: string,
  prev: string
) => Promise<boolean> = async (input, prev) => {
  const checkIsUnique: () => Promise<boolean> = async () => {
    const usersQuery: Query<DocumentData> = query(
      collection(db, "users"),
      where("displayName", "==", `${input}`)
    );
    const isUnique: boolean = await getDocs(usersQuery).then((usersSnap) => {
      if (usersSnap.docs.length === 0) {
        return true;
      } else if (usersSnap.docs.length === 1) {
        if (prev === input) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    });
    return isUnique;
  };
  const result = await checkIsUnique();
  return result;
};
