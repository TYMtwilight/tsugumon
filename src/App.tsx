import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { selectUser, login, logout } from "./features/userSlice";
import Feed from "./components/Feed/Feed";
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
          let userType: "enterpriseUser" | "normalUser" | null = null;
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
              displayName: authUser.displayName,
              photoURL: authUser.photoURL,
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
  return <>{user.uid ? <Feed /> : <UserAuthentication />}</>;
};
export default App;
