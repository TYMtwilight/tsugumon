import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import Home from "./routes/Home";
import Search from "./routes/Search";
import Notifications from "./routes/Notifications";
import Followers from "./routes/Followers";
import Followings from "./routes/Followings";
import Post from "./routes/PostDetail";
import LikeUsers from "./routes/LikeUsers";
import Comments from "./routes/Comments";
import Profile from "./routes/Profile";
import SettingBusiness from "./routes/SettingBusiness";
import SettingNormal from "./routes/SettingNormal";
import SettingAdvertise from "./routes/SettingAdvertise";
import SignUp from "./routes/SignUp";
import Upload from "./routes/Upload";
import DirectMessage from "./routes/DirectMessage";
import { store } from "./app/store";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";
import Login from "./routes/Login";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />}>
            <Route path="home" element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
          <Route path="/messages/:messageId" element={<DirectMessage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/setting/business" element={<SettingBusiness />} />
          <Route path="/setting/normal" element={<SettingNormal />} />
          <Route path="/setting/advertise" element={<SettingAdvertise />} />
          <Route path="/:username/*" element={<Profile />} />
          <Route path="/:username/:docId" element={<Post />} />
          <Route path="/:username/:docId/likeUsers" element={<LikeUsers />} />
          <Route path="/:username/:docId/comments" element={<Comments />} />
          <Route path="/:username/followers" element={<Followers />} />
          <Route path="/:username/followings" element={<Followings />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
