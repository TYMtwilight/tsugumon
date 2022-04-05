import React from "react";
const ProfileForEnterprise = () => {
  return (
    <div>
      <div id="top">
        <img id="background" alt="背景画像" />
        <img id="avatar" alt="アバター画像" />
        {/* TODO >> ログインユーザーがプロフィール画面のユーザーと異なる場合には、
                    「フォロー」ボタンを表示するようにする  */}
        <button>編集する</button>
      </div>
      <div id="profile">
        <p id="introduction">説明文</p>
        <button>さらに表示</button>
        <div id="followerCount">
          <p>フォロワー</p>
          <p>人</p>
        </div>
        <div id="followeeCount">
          <p>フォロー中</p>
          <p>人</p>
        </div>
        <div>
          <p id="owner"></p>
        </div>
        <div>
          <p id="typeOfWork"></p>
        </div>
        <div>
          <p id="address"></p>
        </div>
      </div>
    </div>
  );
};

export default ProfileForEnterprise;
