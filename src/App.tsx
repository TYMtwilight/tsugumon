import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { selectUser, login, logout } from "./features/userSlice";
import { auth } from "./firebase";
import { onAuthStateChanged, Unsubscribe, User } from "firebase/auth";
import UserAuthentication from "./components/UserAuthentication/UserAuthentication";

const App: React.FC = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe: Unsubscribe = onAuthStateChanged(
      auth,
      async (authUser: User | null) => {
        if (authUser) {
          dispatch(login(authUser.uid));
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
