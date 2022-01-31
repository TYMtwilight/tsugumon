import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { selectUser, login, logout } from "./features/userSlice";
import { auth, db } from "./firebase";
import {
  doc,
  getDoc,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged, Unsubscribe } from "firebase/auth";
import UserAuthentication from "./components/UserAuthentication/UserAuthentication";

const App: React.FC = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe: Unsubscribe = onAuthStateChanged(
      auth,
      async (authUser) => {
        if (authUser) {
          const userRef: DocumentReference<DocumentData> = doc(
            db,
            `users.${authUser.uid}`
          );
          const userSnapshot: DocumentSnapshot<DocumentData> | void =
            await getDoc(userRef).catch((e: any) => {
              console.log(`エラーが発生しました\n${e.message}`);
            });
          if (userSnapshot) {
            const userData: DocumentData = userSnapshot.data()!;
            dispatch(
              login({
                uid: userData.id,
                username: userData.username,
                icon_url: userData.icon_url,
                user_type: userData.type,
              })
            );
          }
        } else {
          dispatch(logout());
        }
      }
    );
    return () => {
      unsubscribe();
    };
  }, [dispatch]);
  return <>{user.uid ? <h1>CheckUserType</h1> : <UserAuthentication />}</>;
};
export default App;
