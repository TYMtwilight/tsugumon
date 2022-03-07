import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/userSlice";
import SelectUserType from "../SelectUserType/SelectUserType";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import EditProfileForEnterprise from "../EditProfile/EditBusinessUser";

const Feed = () => {
  const user = useAppSelector(selectUser);
  return (
    <>
      {user.userType ? (
        <div>
          <EditProfileForEnterprise />
          <button
            onClick={() => {
              signOut(auth).catch((error: any) => {
                console.log(`エラーが発生しました\n${error.message}`);
              });
            }}
          >
            logout
          </button>
        </div>
      ) : (
        <SelectUserType />
      )}
    </>
  );
};

export default Feed;
