import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface User {
  uid: string;
  displayName: string | null;
  userType: "enterpriseUser" | "normalUser" | null;
  photoURL: string | null;
  isNewUser: boolean;
}
export interface UserProfile {
  displayName: string;
  photoURL: string;
}
export interface UserLogin {
  uid: string;
  displayName: string | null;
  userType: "enterpriseUser" | "normalUser" | null;
  photoURL: string | null;
}

const initialState: User = {
  uid: "",
  displayName: "",
  photoURL: "",
  userType: null,
  isNewUser: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    login: (state, action: PayloadAction<UserLogin>) => {
      state.uid = action.payload.uid;
      state.displayName = action.payload.displayName;
      state.userType = action.payload.userType;
      state.photoURL = action.payload.photoURL;
    },
    logout: (state) => {
      state.uid = "";
      state.displayName = "";
      state.userType = null;
      state.photoURL = "";
    },
    updateUserProfile: (state, action: PayloadAction<UserProfile>) => {
      state.displayName = action.payload.displayName;
      state.photoURL = action.payload.photoURL;
    },
    updateUserType: (
      state,
      action: PayloadAction<"enterpriseUser" | "normalUser" | null>
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
