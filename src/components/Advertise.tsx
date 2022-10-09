import { useAppSelector } from "../app/hooks";
import { LoginUser, selectUser } from "../features/userSlice";
import { Link } from "react-router-dom";
import {useAdvertise} from "../hooks/useAdvertise";
import { MailOutlined } from "@mui/icons-material";
import { AdvertiseData } from "../interfaces/AdvertiseData";

const Advertise = (username:string) => {
  const loginUser: LoginUser = useAppSelector(selectUser);
  const advertise: AdvertiseData = useAdvertise(username)!;
  const openingHour: string = `0${advertise.openingHour}`;
  const openingMinutes: string = `0${advertise.openingMinutes}`;
  const closingHour: string = `0${advertise.closingHour}`;
  const closingMinutes: string = `0${advertise.closingMinutes}`;
  return (
    <div>
      <div className="relative bg-slate-300">
        <img
          className="object-cover w-screen h-44 brightness-75"
          src={advertise!.imageURL}
          alt="イメージ画像"
        />
        <div className="absolute inset-y-1/2 left-4 ">
          <p className="text-xl text-slate-100 font-semibold">
            {advertise!.displayName}
          </p>
        </div>
        {loginUser && loginUser.uid !== advertise!.uid && (
          <Link
            to={`/messages/${loginUser.uid}-${advertise!.uid}`}
            state={{ receiverUID: advertise!.uid }}
          >
            <button className="flex absolute justify-center items-center w-8 h-8 right-2 bottom-2 rounded-full border border-emerald-500 text-emerald-500 bg-slate-100 hover:border-none hover:text-slate-100 hover:bg-emerald-500">
              <MailOutlined />
            </button>
          </Link>
        )}
      </div>
      <div className="p-4">
        <div className="mb-4">
          <p>{advertise!.message}</p>
        </div>
        <div className="mb-4">
          <p className="text-sm text-slate-500">勤務内容</p>
          <p className="ml-2">{advertise!.jobDescription}</p>
        </div>
        <div className="mb-4">
          <p className="text-sm text-slate-500">勤務地</p>
          <p className="ml-2">{advertise!.location}</p>
        </div>
        <div className="mb-4">
          <p className="text-sm text-slate-500">給与</p>
          <p className="ml-2">
            <label className="text-sm mr-2">月額</label>
            {advertise!.minimamWage.toLocaleString()}円 ~{" "}
            {advertise!.maximumWage.toLocaleString()}円
          </p>
        </div>
        <div className="mb-4">
          <p className="text-sm text-slate-500">勤務時間</p>
          <p className="ml-2">
            {openingHour.substring(openingHour.length - 2)}:
            {openingMinutes.substring(openingMinutes.length - 2)} ~
            {closingHour.substring(closingHour.length - 2)}:
            {closingMinutes.substring(closingMinutes.length - 2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Advertise!;
