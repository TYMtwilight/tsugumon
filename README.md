# 求人支援アプリ つぐもん
地元と移住者をつなぐ求人支援アプリケーションです。  


地元企業は、毎日の仕事内容を写真に撮って投稿することで、情報発信をおこなうことができます。  
移住者は、移住先の企業がどんな仕事をしているのか、情報収集をすることができます。  
また、求人情報も載せることができるので、人材確保のツールとしても活用することができます。


<img width="1440" alt="スクリーンショット 2022-12-02 4 14 52" src="https://user-images.githubusercontent.com/98272835/205140047-efc140e0-f659-49f7-b96c-1194a625e464.png">

PCとスマートフォンの両方で使用されることを想定し、レスポンシブデザインにしました。

**PCでの表示**　　

<img width="800" alt="PCでの表示" src="https://user-images.githubusercontent.com/98272835/205339801-23bee4e5-c1b1-4735-87fe-97bd40081f65.png">  

**スマートフォンでの表示**  

<img width="320" alt="スマートフォンでの表示" src="https://user-images.githubusercontent.com/98272835/205340608-d3a764cc-2d90-4194-a39e-0023b0b06e6d.png">  
  
  
# つぐもん を使ってみる

<a href="https://tsugumon.vercel.app/"><img width="160" alt="つぐもん" src="https://user-images.githubusercontent.com/98272835/205316892-e21b7423-37f3-47d7-b921-8be18abe67b9.png"></a> 👈 クリックすると「つぐもん」のログイン画面へ移動します。


  <img width="800" alt="ログイン画面" src="https://user-images.githubusercontent.com/98272835/205211530-367e69c2-d3d6-4409-ad40-283e7237b65e.png">

<img width="200" alt="QRコード" src="https://user-images.githubusercontent.com/98272835/205318202-1425d266-3f0e-4a28-936b-7b9351996f36.png"> 👈 スマートフォンでもぜひお試しください。  
　　
　　
# なぜこのアプリを作ろうと思ったのか
地方への移住にあたって最大の課題は「不安感」です。  
中でも「仕事」の不安では、働き手が足らない地元と、働き先が見つからない移住者のミスマッチが発生しています。  
移住先で、どんな仕事をするのか未知の状態で就職するのは、誰だって怖いです。  
では、地元産業の業務内容をもっと見える化すれば、地元と移住者、双方の仕事の不安を解決できるのでは？  
求人支援アプリ つぐもん は、そんな思いつきから作られた、地元と移住者をつなぐアプリケーションです。  
  


# 使用技術
- React.js 17.0.2
- Redux 7.2.6
- React Router 6.3.0
- Tailwind CSS 3.0.16
- TypeScript 4.1.5
- Firebase 9.6.5
  - Authentication
  - Firestore Database
  - Storage　　
  
  
  
# システム構成図
<img width="800" alt="スクリーンショット 2022-12-03 12 01 48" src="https://user-images.githubusercontent.com/98272835/205419403-7d49e86f-438e-43ae-b2bf-bea1bc4f16e2.png">  
  
  
# データ構成図
![Entity Relationship Diagram (2)](https://user-images.githubusercontent.com/98272835/205436063-3d1e2c5e-758e-4a5b-8225-8e951504ef9d.png)

　　
　　
# 機能一覧
## 1. フィード機能
<img width="800" alt="スクリーンショット 2022-11-23 13 05 14" src="https://user-images.githubusercontent.com/98272835/205436334-3714cb40-60a2-4540-a4fd-763c29abc13c.png">
  
  
## 2. 検索機能
<img width="800" alt="スクリーンショット 2022-11-23 13 08 19" src="https://user-images.githubusercontent.com/98272835/205436386-12eefcaa-7566-43ab-98d4-87402fe48e61.png">
  

## 3. 投稿機能
<img width="800" alt="スクリーンショット 2022-11-23 13 18 58" src="https://user-images.githubusercontent.com/98272835/205436423-6b05eca2-1584-4263-b732-2ab62a5cac2c.png">








