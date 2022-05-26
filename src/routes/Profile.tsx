import React from "react";
import { Params, useParams } from "react-router-dom";

const Profile: React.VFC = () => {
  let params:Readonly<Params<string>>= useParams();
  return <h2>{params.username}のプロフィール画面</h2>;
};

export default Profile;
