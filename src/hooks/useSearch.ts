import { useState, useEffect } from "react";
import {
  collection,
  DocumentData,
  getDocs,
  query,
  Query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

export const useSearch: (filter: string | null) => string[] = (filter) => {
  const [usernames, setUsernames] = useState<string[]>([]);
  let isMounted: boolean = true;
  if (filter === null) {
    isMounted = false;
  }
  const usersQuery: Query<DocumentData> = query(
    collection(db, "users"),
    where("cropsTags", "array-contains", filter)
  );

  const getUsername: () => void = async () => {
    if (isMounted === false) {
      setUsernames([]);
    }
    getDocs(usersQuery).then((userSnaps: QuerySnapshot<DocumentData>) => {
      setUsernames(
        userSnaps.docs.map((userSnap: QueryDocumentSnapshot<DocumentData>) => {
          return userSnap.data().username;
        })
      );
    });
  };

  useEffect(() => {
    getUsername();
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isMounted = false;
    };
  }, [filter]);

  return usernames;
};
