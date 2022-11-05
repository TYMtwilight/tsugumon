import { useAppSelector } from "../app/hooks";
import { selectUser, LoginUser } from "../features/userSlice";
import { Link } from "react-router-dom";
import { useRooms } from "../hooks/useRooms";
import { Room } from "../interfaces/Room";
import { Partner } from "../interfaces/Partner";

const Messages = () => {
  const loginUser: LoginUser = useAppSelector(selectUser);
  const rooms: Room[] = useRooms();
  return (
    <ul className="w-screen md:w-1/2 lg:w-1/3 min-h-screen pt-28 bg-white">
      {rooms.map((room: Room) => {
        const messageId: string = room.id;
        const partner: Partner = {
          uid: room.uids[0] === loginUser.uid ? room.uids[1] : room.uids[0],
          username:
            room.usernames[0] === loginUser.username
              ? room.usernames[1]
              : room.usernames[0],
          displayName:
            room.displayNames[0] === loginUser.displayName
              ? room.displayNames[1]
              : room.displayNames[0],
          avatarURL:
            room.avatars[0] === loginUser.avatarURL
              ? room.avatars[1]
              : room.avatars[0],
        };
        return (
          <div className="flex w-full h-16 px-4 mb-4 bg-white" key={messageId}>
            <Link
              id="link"
              className="flex flex-row items-center"
              to={`/messages/${messageId}`}
            >
              <img
                className="block w-12 h-12 rounded-full object-cover"
                src={partner.avatarURL}
                alt="ユーザーのアバター画像"
              />
              <label htmlFor="link" className="px-2 py-2 leading-4">
                {partner.displayName}
              </label>
            </Link>
          </div>
        );
      })}
    </ul>
  );
};

export default Messages;
