import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { Link, Outlet } from "react-router-dom";
import { selectUser, login, logout } from "./features/userSlice";
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
import { Home, Search, Notifications, Email } from "@mui/icons-material";

const App: React.FC = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe: Unsubscribe = onAuthStateChanged(
      auth,
      async (authUser: User | null) => {
        if (authUser) {
          let userType: "business" | "normal" | null = null;
          let username: string = "";
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
            username = userSnap.data().username;
          } else {
            console.log("対象のドキュメントは見つかりませんでした。");
          }

          dispatch(
            login({
              uid: authUser.uid,
              username: username,
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

  if (user.uid) {
    return (
      <>
        <nav>
          <Link to="/home">
            <Home />
          </Link>
          <Link to="/search">
            <Search />
          </Link>
          <Link to="/notifications">
            <Notifications />
          </Link>
          <Link to="/email">
            <Email />
          </Link>
        </nav>
        <Outlet />
      </>
    );
  } else {
    return <UserAuthentication />;
  }
};
export default App;
