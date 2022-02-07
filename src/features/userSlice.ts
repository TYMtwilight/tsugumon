import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface UserProfile {
  displayName: string;
  photoURL: string;
}

export interface User {
  uid: string;
  displayName: string;
  userType: "enterpriseUser" | "normalUser" | null;
  photoURL: string;
}

const initialState: User = {
  uid: "",
  displayName: "",
  userType: null,
  photoURL: "",
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
    updateUserProfile: (state, action: PayloadAction<UserProfile>) => {
      state.displayName = action.payload.displayName;
      state.photoURL = action.payload.photoURL;
    },
    updateUserType: (
      state,
      action: PayloadAction<"enterpriseUser"|"normalUser"|null>
    ) => {
      state.userType = action.payload;
    },
  },
});

// NOTE >> 各コンポーネントで使用できるようにuserSliceのアクションを
//         エクスポートします。
export const { login, logout, updateUserProfile, updateUserType } = userSlice.actions;
// NOTE >> ストアで取り込むため、userSliceのリデューサーをエクスポートします。
export default userSlice.reducer;
export const selectUser = (state: RootState) => state.user;
