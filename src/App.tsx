import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { Link, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { selectUser, login, logout } from "./features/userSlice";
import Auth from "./routes/Auth";
import { auth, db } from "./firebase";
import { onAuthStateChanged, Unsubscribe, User } from "firebase/auth";
import {
  doc,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
} from "firebase/firestore";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import EmailIcon from "@mui/icons-material/Email";
const App: React.FC = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe: Unsubscribe = onAuthStateChanged(
      auth,
      async (authUser: User | null) => {
        if (authUser) {
          let introduction: string = "";
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
            introduction = userSnap.data().introduction;
            userType = userSnap.data().userType;
            username = userSnap.data().username;
          } else {
            console.log("対象のドキュメントは見つかりませんでした。");
          }

          dispatch(
            login({
              avatarURL: authUser.photoURL ? authUser.photoURL : "",
              displayName: authUser.displayName ? authUser.displayName : "",
              introduction: introduction,
              uid: authUser.uid,
              username: username,
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
      <div className="w-full max-h-screen bg-slate-100">
        <nav>
          <Link to="/home">
            <HomeIcon />
          </Link>
          <Link to="/search">
            <SearchIcon />
          </Link>
          <Link to="/notifications">
            <NotificationsIcon />
          </Link>
          <Link to="/email">
            <EmailIcon />
          </Link>
        </nav>
        <Outlet />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
        </Routes>
      </div>
    );
  } else {
    return <Auth />;
  }
};
export default App;
