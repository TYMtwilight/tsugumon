import { useState, useEffect } from "react";
import { useAppSelector } from "../app/hooks";
import { selectUser, LoginUser } from "../features/userSlice";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
  QueryDocumentSnapshot,
  query,
  Query,
  FirestoreError,
  where,
  orderBy,
} from "firebase/firestore";
import { Room } from "../interfaces/Room";

export const useRooms: () => Room[] = () => {
  let isMounted: boolean = true;
  const loginUser: LoginUser = useAppSelector(selectUser);
  const [rooms, setRooms] = useState<Room[]>([]);

  const unsubscribe = async () => {
    const messagesQuery: Query<DocumentData> = query(
      collection(db, "rooms"),
      where("uids", "array-contains", loginUser.uid),
      orderBy("timestamp", "asc")
    );
    onSnapshot(
      messagesQuery,
      (roomsSnap: QuerySnapshot<DocumentData>) => {
        const mappedArray: Room[] = roomsSnap.docs.map(
          (roomSnap: QueryDocumentSnapshot<DocumentData>) => {
            return {
              id: roomSnap.id,
              uids: roomSnap.data().uids,
              avatars: roomSnap.data().avatars,
              usernames: roomSnap.data().usernames,
              displayNames: roomSnap.data().displayNames,
              timestamp: roomSnap.data().timestamp,
            };
          }
        );
        if (isMounted) {
          setRooms(mappedArray);
        }
      },
      (error: FirestoreError) => {
        if (process.env.NODE_ENV === "development") {
          console.error(error);
        }
      }
    );
  };

  useEffect(() => {
    unsubscribe();
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isMounted = false;
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return rooms;
};
