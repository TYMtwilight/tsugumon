import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  DocumentData,
  FirestoreError,
  onSnapshot,
  orderBy,
  Query,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import { Message } from "../interfaces/Message";

export const useMessages: (roomId: string) => Message[] = (roomId) => {
  const [messages, setMessages] = useState<Message[]>([]);
  let isMounted: boolean = roomId !== undefined;
  const unsubscribe: () => void = async () => {
    const messagesQuery: Query<DocumentData> = query(
      collection(db, `rooms/${roomId}/messages`),
      orderBy("timestamp", "asc")
    );

    onSnapshot(
      messagesQuery,
      (messagesSnap: QuerySnapshot<DocumentData>) => {
        if (isMounted !== true) {
          if (process.env.NODE_ENV === "development") {
            console.log("onSnapshotの処理をリセットしました");
          }
          return;
        }
        const uploadedMessages: Message[] = messagesSnap.docs.map(
          (messageSnap: QueryDocumentSnapshot) => {
            const value: DocumentData = messageSnap.data();
            const message: Message = {
              messageId: messageSnap.id,
              message: value.message,
              senderUID: value.senderUID,
              receiverUID: value.receiverUID,
              timestamp: value.timestamp && value.timestamp.toDate(),
            };
            return message;
          }
        );
        setMessages(uploadedMessages);
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
  }, []);
  return messages;
};
