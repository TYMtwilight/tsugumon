import { configureStore } from "@reduxjs/toolkit";
import userSliceReducer from "../features/userSlice";

export const store = configureStore({
  reducer: {
    user: userSliceReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
