# 求人支援アプリ つぐもん
地元と移住者をつなぐ求人支援アプリケーションです。
<br>
地元企業は、毎日の仕事内容を写真に撮って投稿することで、情報発信をおこなうことができます。  
移住者は、移住先の企業がどんな仕事をしているのか、情報収集をすることができます。  
また、求人情報も載せることができるので、人材確保のツールとしても活用することができます。
<br>
<br>
<img width="1440" alt="スクリーンショット 2022-12-02 4 14 52" src="https://user-images.githubusercontent.com/98272835/205140047-efc140e0-f659-49f7-b96c-1194a625e464.png">
<br>
<br>
PCとスマートフォンの両方で使用されることを想定し、レスポンシブデザインにしました。
<br>

<img width="800" alt="PCでの表示" src="https://user-images.githubusercontent.com/98272835/205339801-23bee4e5-c1b1-4735-87fe-97bd40081f65.png">  
<br>

<img width="240" alt="スマートフォンでの表示" src="https://user-images.githubusercontent.com/98272835/205340608-d3a764cc-2d90-4194-a39e-0023b0b06e6d.png">  
<br>
<br>

# なぜこのアプリを作ろうと思ったのか
地方への移住にあたって最大の課題は「不安感」です。
<br>
中でも「仕事」の不安では、働き手が足らない地元と、働き先が見つからない移住者のミスマッチが発生しています。
<br>
移住先で、どんな仕事をするのか未知の状態で就職するのは、誰だって怖いです。
<br>
では、地元産業の業務内容をもっと見える化すれば、地元と移住者、双方の仕事の不安を解決できるのでは？
<br>
求人支援アプリ つぐもん は、そんな思いつきから作られた、地元と移住者をつなぐアプリケーションです。  
<br>
<br>
# つぐもん を使ってみる
<a href="https://tsugumon.vercel.app/"><img width="160" alt="つぐもん" src="https://user-images.githubusercontent.com/98272835/205316892-e21b7423-37f3-47d7-b921-8be18abe67b9.png"></a> 👈 クリックすると「つぐもん」のログイン画面へ移動します。
<br>

<img width="800" alt="ログイン画面" src="https://user-images.githubusercontent.com/98272835/205211530-367e69c2-d3d6-4409-ad40-283e7237b65e.png">

<br>
<br>
<img width="200" alt="QRコード" src="https://user-images.githubusercontent.com/98272835/205318202-1425d266-3f0e-4a28-936b-7b9351996f36.png">スマートフォンでもぜひお試しください🙇‍♂️
<br>
<br>

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
<br>
<br>

# システム構成図
<img width="800" alt="スクリーンショット 2022-12-03 12 01 48" src="https://user-images.githubusercontent.com/98272835/205419403-7d49e86f-438e-43ae-b2bf-bea1bc4f16e2.png">
<br>
<br>

# データ構成図

![Entity Relationship Diagram (2)](https://user-images.githubusercontent.com/98272835/205436063-3d1e2c5e-758e-4a5b-8225-8e951504ef9d.png)  
<br>
<br>
# 機能一覧
### 1. フィード機能  　
フォロー中のユーザーの投稿を、リアルタイムでホーム画面に表示します。
<br>
投稿のタイミングでリアルタイムに情報を更新する際、FirestoreがRead Heavyにならないよう気をつけました。
<br>
<br>
<img width="800" alt="スクリーンショット 2022-11-23 13 05 14" src="https://user-images.githubusercontent.com/98272835/205436334-3714cb40-60a2-4540-a4fd-763c29abc13c.png">
<br>
<br>
### 2. 検索機能  
投稿に付けられたタグをキーワードに検索をおこないます。
<br>
入力された半角スペースや全角スペース、改行などの文字を、キーワードの区切り文字として処理するよう、気をつけました。
<br>
<br>
<img width="800" alt="スクリーンショット 2022-11-23 13 08 19" src="https://user-images.githubusercontent.com/98272835/205436386-12eefcaa-7566-43ab-98d4-87402fe48e61.png">
<br>
<br>
### 3. 投稿機能
画像を投稿する機能です。「キャプション」欄には画像の説明文を、「タグ」欄には検索のキーワードを入力します。　　　　
<br>
<br>
<img width="800" alt="スクリーンショット 2022-11-23 13 18 58" src="https://user-images.githubusercontent.com/98272835/205436423-6b05eca2-1584-4263-b732-2ab62a5cac2c.png">
<br>
<br>
### 4. 通知機能
通知画面ではメッセージをやり取りしているユーザーの一覧を確認できます。
<br>
ユーザー名をクリックすれば、対象ユーザーとのメッセージ画面に遷移します。
<br>
⚠️ユーザーへの通知機能は実装方法を検討中のため、まだ実装しておりません。
<br>
<br>
<img width="800" alt="スクリーンショット 2022-12-03 22 55 21" src="https://user-images.githubusercontent.com/98272835/205444555-1d811213-2c79-42dc-b251-aac20708cba4.png">
<br>
<br>
### 5. DM機能
ユーザー同士でLINEのようなチャットのやり取りをおこなう機能です。
<br>
<br>
<img width="800" alt="スクリーンショット 2022-12-03 22 55 33" src="https://user-images.githubusercontent.com/98272835/205446048-9b93360e-ed2a-488a-9180-91455c7d823f.png">
<br>
<br>
### 6. プロフィール表示機能
ユーザーのプロフィールや、過去の投稿、募集中の広告を表示します。
<br>
「過去の投稿」や「募集中」のボタンをクリックすることで、表示内容を切り替えます。
<br>
<br>
<img width="800" alt="スクリーンショット 2022-11-23 14 00 38" src="https://user-images.githubusercontent.com/98272835/205446281-abe7b069-2190-41df-8542-ca349199fee0.png">
<br>
<br>
<img width="800" alt="スクリーンショット 2022-11-23 14 01 45" src="https://user-images.githubusercontent.com/98272835/205446289-23d37f17-9eeb-45ec-b950-4d3ab5627742.png">
<br>
<br>
### 7. プロフィール編集機能
ユーザー自身のプロフィールや、募集中の広告の編集をおこなう機能です。
<br>
ユーザー自身がプロフィールを表示している場合にかぎり、使用できるようにしています。
<br>
<br>
<img width="800" alt="スクリーンショット 2022-11-23 15 29 33" src="https://user-images.githubusercontent.com/98272835/205446317-78c32cda-fc93-46f5-91d0-18244b890cf4.png">
<br>
<br>
<img width="800" alt="スクリーンショット 2022-11-23 15 29 49" src="https://user-images.githubusercontent.com/98272835/205446328-26dbe2bd-ab87-4ca9-9de5-df79e576c9a7.png">
<br>
<br>
### 8. 投稿詳細表示機能
投稿画像をクリックすると、その投稿の詳細を確認できるようにしています。
<br>
また、投稿データ以外に、企業ユーザーの募集の広告も表示するようにしています。
<br>
<br>
<img width="1440" alt="スクリーンショット 2022-12-04 0 01 26" src="https://user-images.githubusercontent.com/98272835/205447439-fae0846b-da3f-4cba-9905-74689e5981a2.png">
<br>
<br>
### 9. コメント・いいね機能
ハートのボタンが「いいね」ボタン、吹きだしのボタンが「コメント」ボタンです。
<br>
「いいね」ボタンをクリックすると、いいね数が増減します。
<br>
「コメント」ボタンをクリックすると、コメント画面に遷移します。
<br>
数字の箇所をクリックすると、それぞれのユーザーの一覧が表示されます。
<br>
<br>
<img width="800" alt="スクリーンショット 2022-12-04 0 13 10" src="https://user-images.githubusercontent.com/98272835/205447996-cb5945ca-7bd4-4b5b-adfa-877a31297ede.png">
<br>
<br>
<img width="800" alt="スクリーンショット 2022-12-04 0 13 48" src="https://user-images.githubusercontent.com/98272835/205448024-faa5f2c2-c5e7-435f-8425-daa3a6c268bc.png">
<br>
<br>
<img width="800" alt="スクリーンショット 2022-12-04 0 14 07" src="https://user-images.githubusercontent.com/98272835/205448048-0ed3f757-35d7-45f0-bd93-45cbf30aca4b.png">
<br>
<br>
### 10. ログイン機能
入力されたメールアドレスとパスワードをもとに、ユーザーのログインを管理します。
<br>
入力規則を満たさない場合、フォームの下にアラートを表示するようにしました。
<br>
<br>
<img width="800" alt="スクリーンショット 2022-11-24 22 08 42" src="https://user-images.githubusercontent.com/98272835/205448288-74171775-2504-4918-b725-29a584b7c30b.png">
<br>
<br>
### 11. 新規ユーザー登録機能
新規ユーザーを登録する機能です。
<br>
入力されたユーザー名が既存のものと重複していた場合、警告を表示するようにしました。
<br>
<br>
<img width="800" alt="スクリーンショット 2022-12-04 0 22 22" src="https://user-images.githubusercontent.com/98272835/205448508-77bb58d5-e50a-4c1e-b58d-2422d124da86.png">









