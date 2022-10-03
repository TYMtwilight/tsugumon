import { useAppSelector } from "../app/hooks";
import { selectUser, LoginUser } from "../features/userSlice";
import { Link } from "react-router-dom";
import { useRooms } from "../hooks/useRooms";
import { Room } from "../interfaces/Room";

interface Partner {
  uid: string;
  username: string;
  avatarURL: string;
}

const Rooms = () => {
  const loginUser: LoginUser = useAppSelector(selectUser);
  const rooms: Room[] = useRooms();
  return (
    <div>
      <ul>
        {rooms.map((room: Room) => {
          const messageId: string = `${room.senderUID}-${room.receiverUID}`;
          const isSender: boolean = room.senderUID === loginUser.uid;
          const partner: Partner = {
            uid: isSender ? room.receiverUID : room.senderUID,
            username: isSender ? room.receiverName : room.senderName,
            avatarURL: isSender ? room.receiverAvatar : room.senderAvatar,
          };
          return (
            <div key={messageId}>
              <Link to={`/messages/${messageId}`} >
                <li>
                  <div>
                    <img src={partner.avatarURL} alt="ユーザーのアバター画像" />
                  </div>
                  <div>
                    <p>{partner.username}</p>
                  </div>
                </li>
              </Link>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default Rooms;
