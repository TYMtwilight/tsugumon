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
      where("users", "array-contains", loginUser.uid),
      orderBy("timestamp", "asc")
    );
    onSnapshot(
      messagesQuery,
      (roomsSnap: QuerySnapshot<DocumentData>) => {
        const mappedArray: Room[] = roomsSnap.docs.map(
          (roomSnap: QueryDocumentSnapshot<DocumentData>) => {
            return {
              senderUID: roomSnap.data().senderUID,
              senderAvatar: roomSnap.data().senderAvatar,
              senderName: roomSnap.data().senderName,
              senderDisplayName: roomSnap.data().displayName,
              receiverUID: roomSnap.data().receiverUID,
              receiverAvatar: roomSnap.data().receiverAvatar,
              receiverName: roomSnap.data().receiverName,
              receiverDisplayName:roomSnap.data().displayName,
              timestamp: roomSnap.data().timestamp,
            };
          }
        );
        if (isMounted) {
          console.log(mappedArray);
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
