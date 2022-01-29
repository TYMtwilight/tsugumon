import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface User {
  uid: string;
  username: string;
  usertype: "employer" | "applicant" | null;
  icon_url: string;
}

const initialState: User = {
  uid: "",
  username: "",
  usertype: null,
  icon_url: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state = action.payload;
    },
    logout: (state) => {
      state = initialState;
    },
  },
});

// NOTE >> 各コンポーネントで使用できるようにuserSliceのアクションを
//         エクスポートします。
export const { login, logout } = userSlice.actions;
// NOTE >> ストアで取り込むため、userSliceのリデューサーをエクスポートします。
export default userSlice.reducer;
export const selectUser = (state: RootState) => state.user;
