import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  DocumentData,
  query,
  Query,
  where,
  getDocs,
} from "firebase/firestore";

interface UserData {
  avatarURL: string;
  backgroundURL: string;
  cropsTags: string[];
  displayName: string;
  introduction: string;
  userType: "business" | "normal" | null;
}

interface OptionData {
  address: string;
  birthdate: string;
  owner: string;
  skill: string;
  typeOfWork: string;
}

export const useProfile = (username: string) => {
  const [user, setUser] = useState<UserData>({
    avatarURL: "",
    backgroundURL: "",
    cropsTags: [],
    displayName: "",
    introduction: "",
    userType: null,
  });
  const [option, setOption] = useState<OptionData>({
    address: "",
    birthdate: "",
    owner: "",
    skill: "",
    typeOfWork: "",
  });
  let isMounted: boolean = true;

  const getUser = async () => {
    if (isMounted === false) {
      return;
    }
    const userQuery: Query<DocumentData> = query(
      collection(db, "users"),
      where("username", "==", username)
    );
    const userSnap = await getDocs(userQuery);
    setUser({
      avatarURL: userSnap.docs[0].data().avatarURL,
      backgroundURL: userSnap.docs[0].data().backgroundURL,
      cropsTags: userSnap.docs[0].data().cropsTags,
      displayName: userSnap.docs[0].data().displayName,
      introduction: userSnap.docs[0].data().introduction,
      userType: userSnap.docs[0].data().userType,
    });
  };

  const getOption = async () => {
    if (isMounted === false) {
      return;
    }
    const optionQuery: Query<DocumentData> = query(
      collection(db, "option"),
      where("username", "==", username)
    );
    const optionSnap = await getDocs(optionQuery);
    setOption({
      address: optionSnap.docs[0].data().address,
      birthdate: optionSnap.docs[0].data().birthdate,
      owner: optionSnap.docs[0].data().owner,
      skill: optionSnap.docs[0].data().skill,
      typeOfWork: optionSnap.docs[0].data().typeOfWork,
    });
  };

  useEffect(() => {
    getUser();
    getOption();
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (user && option) {
    console.log({ user: user, option: option });
    return { user: user, option: option };
  }
};
