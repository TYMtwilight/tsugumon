import React, { useState } from "react";
import Feed from "../Feed/Feed";
import { Home, Search, Notifications, Email } from "@mui/icons-material";

type Tab = "Feed" | "Search" | "Notifications" | "DM";
const Basis: React.FC = () => {
  const [tab, setTab] = useState<Tab>("Feed");
  return (
    <div>
      {tab === "Feed" && <Feed />}
      {tab === "Search" && <p>Search</p>}
      {tab === "Notifications" && <p>Notifications</p>}
      {tab === "DM" && <p>DM</p>}
      <button
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          setTab("Feed");
        }}
      >
        <Home />
      </button>
      <button
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          setTab("Search");
        }}
      >
        <Search />
      </button>
      <button
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          setTab("Notifications");
        }}
      >
        <Notifications />
      </button>
      <button
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          setTab("DM");
        }}
      >
        <Email />
      </button>
    </div>
  );
};

export default Basis;
