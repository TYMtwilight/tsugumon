import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  DocumentData,
  query,
  Query,
  where,
  getDocs,
  QuerySnapshot,
} from "firebase/firestore";
import { AdvertiseData } from "../interfaces/AdvertiseData";

export const useAdvertise: (username: string) => AdvertiseData = (username) => {
  let isMounted = true;
  const [advertise, setAdvertise] = useState<AdvertiseData>({
    closingHour: 0,
    closingMinutes: 0,
    displayName: "",
    imageURL: "",
    jobDescription: "",
    location: "",
    maximumWage: 0,
    message: "",
    minimumWage: "",
    openingHour: 0,
    openingMinutes: 0,
    uid: "",
    username: "",
    wanted: true,
  });
  const advertiseQuery: Query<DocumentData> = query(
    collection(db, "advertises"),
    where("username", "==", username)
  );
  const getAdvertise: () => Promise<void> = async () => {
    const advertiseSnap: QuerySnapshot<DocumentData> = await getDocs(
      advertiseQuery
    );
    if (isMounted === false) {
      return;
    }
    setAdvertise({
      closingHour: advertiseSnap.docs[0].data()?.closingHour,
      closingMinutes: advertiseSnap.docs[0].data()?.closingMinutes,
      displayName: advertiseSnap.docs[0].data()?.displayName,
      imageURL: advertiseSnap.docs[0].data()?.imageURL,
      jobDescription: advertiseSnap.docs[0].data()?.jobDescription,
      location: advertiseSnap.docs[0].data()?.location,
      maximumWage: advertiseSnap.docs[0].data()?.maximumWage,
      message: advertiseSnap.docs[0].data()?.message,
      minimumWage: advertiseSnap.docs[0].data()?.minimumWage,
      openingHour: advertiseSnap.docs[0].data()?.openingHour,
      openingMinutes: advertiseSnap.docs[0].data()?.openingMinutes,
      uid: advertiseSnap.docs[0].id,
      username: advertiseSnap.docs[0].data()?.username,
      wanted: advertiseSnap.docs[0].data()?.wanted,
    });
  };

  useEffect(() => {
    getAdvertise();
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isMounted = false;
    };
  }, []);

  return advertise;
};
