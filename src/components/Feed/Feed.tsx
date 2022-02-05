import React from "react";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
const Feed = () => {
  return (
    <div>
      Feed
      <button
        onClick={() => {
          signOut(auth).catch((error: any) => {
            console.log(`エラーが発生しました\n${error.message}`);
          });
        }}
      >
        logout
      </button>
    </div>
  );
};

export default Feed;
