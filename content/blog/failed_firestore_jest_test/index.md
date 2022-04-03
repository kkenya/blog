---
title: firestoreをjestでテストして失敗した話
date: "2021-10-12T00:57:00+09:00"
status: draft
---

## 構成

cloudfunction(Nodejs) + firestoreでバックエンドサーバーを開発した。そもそもfirestoreがクライアントからの呼び出しに最適化されていてバックエンドサーバーを用意する必要がなかった。

例： pager, 認証

emulatorの `exec` コマンドにコマンドを渡すことで、エミュレーター起動→コマンド実行→エミュレーター終了できる
emulatorを起動後にjestを実行するのでemulatorは各テストからglobalにアクセスされる。つまりfirestoreにデータを保存するテストを並行して2つ実行すると同じデータストアを共有しているので相互の干渉してしまう。jestは各テスト毎に独立した環境で、複数並列に実行することがコンセプトとなるのでこの時点であっていない。


timestampについて
https://medium.com/firebase-developers/the-secrets-of-firestore-fieldvalue-servertimestamp-revealed-29dd7a38a82b
