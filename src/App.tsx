import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { selectUser, login, logout } from "./features/userSlice";
import { auth } from "./firebase";
import { onAuthStateChanged, Unsubscribe, User } from "firebase/auth";
import UserAuthentication from "./components/UserAuthentication/UserAuthentication";
import Feed from "./components/Feed/Feed";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  return <>{user.uid ? <Feed /> : <UserAuthentication />}</>;
};
export default App;
