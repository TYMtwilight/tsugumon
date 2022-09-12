import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import Followers from "./routes/Followers";
import Followings from "./routes/Followings";
import Home from "./routes/Home";
import Search from "./routes/Search";
import Post from "./routes/PostDetail";
import LikeUsers from "./routes/LikeUsers";
import Comments from "./routes/Comments";
import Profile from "./routes/Profile";
import NewSetting from "./routes/NewSetting";
import SignUp from "./routes/SignUp";
import Upload from "./routes/Upload";
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
            <Route path="notifications" element={<p>Notifications</p>} />
            <Route path="email" element={<p>Email</p>} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/setting" element={<NewSetting />} />
          <Route path="/:username" element={<Profile />} />
          <Route path="/:username/:docId" element={<Post />} />
          <Route path="/:username/:docId/likeUsers" element={<LikeUsers />} />
          <Route path="/:username/:docId/comments" element={<Comments />} />s
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
