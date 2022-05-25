import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface User {
  uid: string;
  username: string;
  displayName: string;
  userType: "businessUser" | "normalUser" | null;
  avatarURL: string;
  isNewUser: boolean;
}
export interface UserProfile {
  displayName: string;
  avatarURL: string;
}
export interface UserLogin {
  uid: string;
  username: string;
  displayName: string;
  userType: "businessUser" | "normalUser" | null;
  avatarURL: string;
}

const initialState: User = {
  uid: "",
  username: "",
  displayName: "",
  avatarURL: "",
  userType: null,
  isNewUser: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    login: (state, action: PayloadAction<UserLogin>) => {
      state.uid = action.payload.uid;
      state.username = action.payload.username;
      state.displayName = action.payload.displayName;
      state.userType = action.payload.userType;
      state.avatarURL = action.payload.avatarURL;
    },
    logout: (state) => {
      state.uid = "";
      state.displayName = "";
      state.userType = null;
      state.avatarURL = "";
    },
    updateUserProfile: (state, action: PayloadAction<UserProfile>) => {
      state.displayName = action.payload.displayName;
      state.avatarURL = action.payload.avatarURL;
    },
    updateUserType: (
      state,
      action: PayloadAction<"businessUser" | "normalUser" | null>
    ) => {
      state.userType = action.payload;
    },
    toggleIsNewUser: (state, action: PayloadAction<boolean>) => {
      state.isNewUser = action.payload;
    },
  },
});

// NOTE >> 各コンポーネントで使用できるようにuserSliceのアクションを
//         エクスポートします。
export const {
  login,
  logout,
  updateUserProfile,
  updateUserType,
  toggleIsNewUser,
} = userSlice.actions;
// NOTE >> ストアで取り込むため、userSliceのリデューサーをエクスポートします。
export default userSlice.reducer;
export const selectUser = (state: RootState) => state.user;
