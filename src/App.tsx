import { useEffect } from "react";
import {BrowserRouter, Route} from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { selectUser, login, logout } from "./features/userSlice";
import Basis from "./components/Basis/Basis";
import UserAuthentication from "./components/UserAuthentication/UserAuthentication";
import { auth, db } from "./firebase";
import { onAuthStateChanged, Unsubscribe, User } from "firebase/auth";
import {
  doc,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
} from "firebase/firestore";

const App: React.FC = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe: Unsubscribe = onAuthStateChanged(
      auth,
      async (authUser: User | null) => {
        if (authUser) {
          let userType: "businessUser" | "normalUser" | null = null;
          const userRef: DocumentReference<DocumentData> = doc(
            db,
            "users",
            authUser.uid
          );
          const userSnap: DocumentSnapshot<DocumentData> = await getDoc(
            userRef
          );
          if (userSnap.exists()) {
            userType = userSnap.data().userType;
          } else {
            console.log("対象のドキュメントは見つかりませんでした。");
          }

          dispatch(
            login({
              uid: authUser.uid,
              displayName: authUser.displayName ? authUser.displayName : "",
              avatarURL: authUser.photoURL ? authUser.photoURL : "",
              userType: userType,
            })
          );
        } else {
          dispatch(logout());
        }
      }
    );

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  return <>{user.uid ? <Basis /> : <UserAuthentication />}</>;
};
export default App;
