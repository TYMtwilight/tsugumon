import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  where,
} from "firebase/firestore";

interface Doc {
  username: string;
  id: string;
  timestamp: number;
}

export const useSearch: (searchTag: string | null) => Doc[] = (searchTag) => {
  const [docsArray, setDocsArray] = useState<Doc[]>([]);
  let isMounted: boolean = searchTag !== null;

  const getUserDocs: (uid: string) => Promise<Doc[]> = async (uid) => {
    const docsSnap: QuerySnapshot<DocumentData> = await getDocs(
      query(
        collection(db, "posts"),
        where("uid", "==", uid),
        orderBy("timestamp", "desc"),
        limit(20)
      )
    );
    const documents: Doc[] = docsSnap.docs.map(
      (document: QueryDocumentSnapshot<DocumentData>) => {
        return {
          username: document.data().username,
          id: document.id,
          timestamp: document.data().timestamp.toDate().getTime(),
        };
      }
    );
    return documents;
  };

  const getDocsArray: () => Promise<void> = async () => {
    setDocsArray([]);
    // NOTE >> 検索タグに合致するユーザーUIDを取得し、配列に格納します。
    const usersSnap: QuerySnapshot<DocumentData> = await getDocs(
      query(
        collection(db, "users"),
        where("cropsTags", "array-contains", searchTag)
      )
    );
    if (usersSnap.size === 0) return;
    const uidArray: string[] = usersSnap.docs!.map(
      (userSnap: QueryDocumentSnapshot<DocumentData>) => {
        return userSnap.id;
      }
    );
    // NOTE >> ユーザーUIDをキーとして、投稿のドキュメントIDを取得し、配列に格納します。
    uidArray.map(async (uid: string) => {
      const userDocs: Doc[] = await getUserDocs(uid);
      setDocsArray((prev: Doc[]) => {
        return prev.concat(userDocs).sort((firstDoc, secondDoc) => {
          return firstDoc.timestamp - secondDoc.timestamp;
        });
      });
    });
  };

  useEffect(() => {
    if (isMounted === false) {
      return;
    }
    getDocsArray();
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isMounted = false;
    };
  }, [searchTag]);

  return docsArray;
};
