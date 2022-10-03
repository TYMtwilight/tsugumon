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

  const unsubscribe = async (communicator: "senderUID" | "receiverUID") => {
    const roomsQuery: Query<DocumentData> = query(
      collection(db, "rooms"),
      where(communicator, "==", loginUser.uid),
      orderBy("timestamp", "asc")
    );
    onSnapshot(
      roomsQuery,
      (roomsSnap: QuerySnapshot<DocumentData>) => {
        const mappedArray: Room[] = roomsSnap.docs.map(
          (roomSnap: QueryDocumentSnapshot<DocumentData>) => {
            return {
              senderUID: roomSnap.data().senderUID,
              senderAvatar: roomSnap.data().senderAvatar,
              senderName: roomSnap.data().senderName,
              receiverUID: roomSnap.data().receiverUID,
              receiverAvatar: roomSnap.data().receiverAvatar,
              receiverName: roomSnap.data().receiverName,
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
    unsubscribe("senderUID");
    unsubscribe("receiverUID");
    return () => {
      unsubscribe("senderUID");
      unsubscribe("receiverUID");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return rooms;
};
