import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface LoginUser {
  avatarURL: string;
  displayName: string;
  introduction: string;
  isNewUser: boolean;
  uid: string;
  userType: "business" | "normal" | null;
  username: string;
}
export interface UserProfile {
  avatarURL: string;
  displayName: string;
  username: string;
}
export interface UserLogin {
  avatarURL: string;
  displayName: string;
  introduction: string;
  uid: string;
  userType: "business" | "normal" | null;
  username: string;
}

const initialState: LoginUser = {
  avatarURL: "",
  displayName: "",
  introduction:"",
  isNewUser: false,
  uid: "",
  userType: null,
  username: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    login: (state, action: PayloadAction<UserLogin>) => {
      state.avatarURL = action.payload.avatarURL;
      state.displayName = action.payload.displayName;
      state.introduction = action.payload.introduction;
      state.uid = action.payload.uid;
      state.username = action.payload.username;
      state.userType = action.payload.userType;
    },
    logout: (state: UserLogin) => {
      state.avatarURL = "";
      state.displayName = "";
      state.introduction ="";
      state.uid = "";
      state.username = "";
      state.userType = null;
    },
    setUserProfile: (state, action: PayloadAction<UserProfile>) => {
      state.displayName = action.payload.displayName;
      state.username = action.payload.username;
      state.avatarURL = action.payload.avatarURL;
    },
    updateUserType: (
      state,
      action: PayloadAction<"business" | "normal" | null>
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
  setUserProfile,
  updateUserType,
  toggleIsNewUser,
} = userSlice.actions;
// NOTE >> ストアで取り込むため、userSliceのリデューサーをエクスポートします。
export default userSlice.reducer;
export const selectUser = (state: RootState) => state.user;
