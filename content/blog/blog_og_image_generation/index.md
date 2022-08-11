---
title: OG画像を自動生成する
date: "2022-08-07T20:03:52+09:00"
status: draft
---

OG画像とは

## [The Open Graph Protocol](https://ogp.me/)

ogp画像、og画像とも呼ばれる

## パターン

Puppeteerなどのヘッドレスブラウザからスクリーンショットを撮る

ImageMagic, [node-canvas](https://github.com/Automattic/node-canvas)などで画像を生成する

## 要件

タイトルから生成するのか

記事ごとに画像を設定したいのか

### 実装パターン

headless browserでスクリーンショットを取る

画像を合成する

クライアントリでスクリーンショットを取る

ローカルで生成して静的に持つ

push時に生成する？など

gatsbyの画像最適化の恩恵を受けられるか

ssgの際に画像合成、ソースに含める

タイトルの変更があった場合の再生成判定

毎回生成する

記事数=生成数

一つあたりの生成時間計測

生成がローカルのコンピューティングリソースに依存する

リクエストごとの処理

CDNでキャッシュするので生成数は少ない

生成はFaaSを利用するのでリソースを調整可能

初回の生成が遅い

要計測

タイトルを変更した場合にキャッシュのinvalidationが必要

クライアントに悪用されない仕組み

CF lambda

lambda@edge

CloudRun

imgix

画像処理に特化したCDN

cloudina

メディアに特化

画像をアップロード、文章指定で構成できる

ogpのコンテント属性とは？

og画像

画像生成ライブラリ

ImageMagic

node-canvas

sharp

実装方針

キャッシュ

CDNのキッシュとは別にtwitterなどのクライアントでのキャッシュ
Cache-Controlの管理

レスポンスヘッダーの設定

画像の最適化どうするか?

画像を生成しておくパターン
既存の記事どうする？

## 参考

- [サイトのOGP画像を自動生成する](https://zenn.dev/panda_program/articles/generate-og-image)
  - node-canvasでブログのタイトルをテンプレート画像に合成する
  - 生成した画像を返すAPIエンドポイントをOGP画像のconent属性に指定する
- [Node.jsで動的なOGP画像の生成方法。軽量で環境に影響されない方法](https://std9.jp/articles/01fz9fve2cykj764xqqtbrc1dt)
  - opentype.jsでCSVを生成し、sharpでPNGに変換した画像を返すAPIを実装
- [cookpad レシピページのOGP画像を動的に生成する](https://techlife.cookpad.com/entry/dynamic-og-image)
  - ヘッドレスブラウザ（puppeteer）のレンダリング結果を画像として返すAPI
  - 300万以上のコンテンツがあり、すべてでOGP画像の生成が必要ではないためリクエストのタイミングで画像を生成
- [Cloud Functions + ImageMagickでOPG画像の動的生成してCloud Storageにアップロードする](https://www.memory-lovers.blog/entry/2019/06/26/194500)
  - Cloud FunctionでImageMagicの生成した画像URLを返す
- [FirebaseCloudFunctionsとcanvasだけで動的にOGP画像を生成し2020年を生き延びよう](https://qiita.com/_masaokb/items/4e5e7c91d3a582f60e5f)
  - node-canvasで生成した画像をCloud Strageにアップロードし、リダイレクトするAPI
- [Cloud FunctionsでSSRして、OGPタグを動的に書き換える](https://zenn.dev/nshhhin/articles/nicody-firebase-ogp)
  - コンテンツが公開設定された際に画像を生成し、Cloud Functionsがページ取得のリクエストでOG画像のメタタグを正規表現により書き換える
- [Cloudflare Workers で OG 画像を生成する](https://blog.keiya01.dev/entry/og-image-in-workers/)
  - Cloudflare Workersでnode-canvasの生成した画像を返す
- [SSGなサイトでOGP画像を動的生成したい](https://speakerdeck.com/kubotak/ssgnasaitodeogphua-xiang-wodong-de-sheng-cheng-sitai)
  - sharpとtext-svgでの事前生成
  - 形態素解析を利用し単語の区切りで改行する
- [Qiita記事のOGPイメージが新しくなりました](https://blog.qiita.com/qiita-article-ogp-renewal/)
  - imgixを利用している
