import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { selectUser, login, logout, LoginUser } from "./features/userSlice";
import { auth, db } from "./firebase";
import { onAuthStateChanged, Unsubscribe, User, signOut } from "firebase/auth";
import {
  doc,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
} from "firebase/firestore";
import TabBar from "./components/TabBar";

const App: React.FC = () => {
  const loginUser: LoginUser = useAppSelector(selectUser)!;
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe: Unsubscribe = onAuthStateChanged(
      auth,
      async (authUser: User | null) => {
        if (authUser) {
          const userRef: DocumentReference<DocumentData> = doc(
            db,
            "users",
            authUser.uid
          );
          const userSnap: DocumentSnapshot<DocumentData> = await getDoc(
            userRef
          );
          if (userSnap.exists()) {
            dispatch(
              login({
                avatarURL: authUser.photoURL ? authUser.photoURL : "",
                backgroundURL: userSnap.data().backgroundURL,
                displayName: authUser.displayName ? authUser.displayName : "",
                introduction: userSnap.data().introduction,
                uid: authUser.uid,
                username: userSnap.data().username,
                userType: userSnap.data().userType,
              })
            );
          } else {
            if (process.env.NODE_ENV === "development") {
              console.log("対象のドキュメントは見つかりませんでした。");
            }
            dispatch(logout());
          }
        } else {
          dispatch(logout());
        }
      }
    );
    return () => {
      unsubscribe();
      if (loginUser.uid === "") {
        signOut(auth);
      }
    };
  }, [dispatch, loginUser.uid]);

  if (loginUser.uid !== "") {
    return (
      <div className="w-screen min-h-screen h-full bg-slate-100">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
        </Routes>
        <TabBar invisibleAtSmall={false} />
        <Outlet />
      </div>
    );
  } else {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    );
  }
};
export default App;
