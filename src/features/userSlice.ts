import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface User {
  uid: string;
  username: string;
  user_type: "employer" | "applicant" | null;
  icon_url: string;
}

const initialState: User = {
  uid: "",
  username: "",
  user_type: null,
  icon_url: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    login: (state, action: PayloadAction<User["uid"]>) => {
      state.uid = action.payload;
    },
    logout: (state) => {
      state.uid = "";
    },
  },
});

// NOTE >> 各コンポーネントで使用できるようにuserSliceのアクションを
//         エクスポートします。
export const { login, logout } = userSlice.actions;
// NOTE >> ストアで取り込むため、userSliceのリデューサーをエクスポートします。
export default userSlice.reducer;
export const selectUser = (state: RootState) => state.user;
