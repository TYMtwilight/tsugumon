import { AnyAction, configureStore, Reducer } from "@reduxjs/toolkit";
import { persistStore, persistReducer, WebStorage } from "redux-persist";
import storage from "redux-persist/es/storage";
import userSliceReducer, { LoginUser } from "../features/userSlice";
import { PersistPartial } from "redux-persist/es/persistReducer";
import thunk from "redux-thunk";

const persistConfig: { key: string; storage: WebStorage } = {
  key: "root",
  storage,
};

const persistedReducer: Reducer<LoginUser & PersistPartial, AnyAction> =
  persistReducer(persistConfig, userSliceReducer);

// eslint-disable-next-line import/no-anonymous-default-export
export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: [thunk],
});
export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
