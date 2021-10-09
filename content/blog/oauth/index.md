---
title: OAuth
date: "2021-09-20T23:50:49+09:00"
status: draft
---

## TOFU(Truest On First Use)

### 機密クライアント(confidential client)

clientがAuthorization serverに自身を認証するために利用する共有シークレットをもつ
実装ではclient_secretを認可サーバーのトークン・エンドポイントに渡す

clientが指定するcallbackurlやスコープと違い認可サーバーが割り当てる

### フロント・チャネルとバック・チャネル

### 認可コードによる付与方式(Authorization Code Grant Type)

付与方式(Authorization Grant)
一般的には「OAuthフロー」として知られる

- 認可コードによる付与方式(Authorization Code Grant Type)
- インプリシット付与方式(Implicit Grant Type)
  - クライアントがブラウザ内にあるため、フロント・チャネルのみ使われる
- クライアント・クレデンシャルによる付与方式(Client Credentials Grant Type)

基本的な認可コードによる付与方式(Authorization Code Grant Type)を利用

アクセス・トークンを提示し、保護対象リソースを呼び出す

```mermaid
  c->a: resource ownerを認可サーバの認可エンドポイントに送る(コールバックURL, stateを指定)
r->a: 承認
    a-->r: ownerはcallbackUrlにリダイレクト
r->c: リダイレクトのリクエストからstate, 認可コード取得
  c->c: stateの検証
  c->>a: 認可コードを認可サーバのトークン・エンドポイントに送る(※1)
    a-->>c: OAuthのアクセス・トークン
  c->>c: アクセス・トークンを取り出して格納
```

※1
攻撃者が危険なリダイレクトURIを正当なクライアントに対してつかうことをふせぐため、認可リクエストで指定したリダイレクトURLを、トークン・エンドポイントのリクエストに含める

state
OAuthの任意のパラメータ
悪意あるユーザーエージェントがクライアントを使って認可サーバーの有効な認可コードを騙し取ることを防ぐランダムな値
認可エンドポイントを呼び出すURLのパラメータに含める

### Bearerトークンを保護対象リソースに渡すための3つの異なる方法

- Authorizationヘッダーに設定する
- POST送信時のformエンコードされたパラメーターをボディー内に設定する
- クエリー・パラメーター似せて血する方法

### リフレッシ・ュトークン(Refresh Token)

アクセス・トークンの有効期限が切れた場合に、ユーザーを巻き込むことなく新しいアクセス・トークンを取得するための方法
