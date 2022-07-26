import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import Home from "./routes/Home";
import Search from "./routes/Search";
import Post from "./routes/Post";
import Profile from "./routes/Profile";
import Setting from "./routes/Setting";
import SignUp from "./routes/SignUp";
import Upload from "./routes/Upload";
import { store } from "./app/store";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<App />}>
            <Route path="home" element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="notifications" element={<p>Notifications</p>} />
            <Route path="email" element={<p>Email</p>} />
            <Route path="upload" element={<Upload />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="setting" element={<Setting />} />
          </Route>
          <Route path=":username" element={<Profile />} />
          <Route path=":username/:docId" element={<Post />} />
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
