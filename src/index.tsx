import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import Feed from "./routes/Feed";
import SignUp from "./routes/SignUp";
import Profile from "./routes/Profile";
import { store } from "./app/store";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";
import Upload from "./routes/Upload";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="upload" element={<Upload />} />
            <Route path="home" element={<Feed />} />
            <Route path="search" element={<p>Search</p>} />
            <Route path="notification" element={<p>Notification</p>} />
            <Route path="email" element={<p>Email</p>} />
            <Route path="signup" element={<SignUp />} />
            <Route path=":username" element={<Profile />} />
          </Route>
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
