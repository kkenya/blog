---
title: テックブログを開設する(Gatsby)
date: "2021-01-12T17:54:00+09:00"
status: published
---

記事はマークダウンで記述しGitHubで管理することを要件として、SSGで静的サイトを生成する [Gatsby](https://www.gatsbyjs.com/)でブログを作成した

### Gatsbyでやったこと

チュートリアルをこなして、基本的な開発の進め方とプラグインの使い方を学んだ

### starterで雛形を生成する

[gatsby-starter-blog](https://www.gatsbyjs.com/starters/gatsbyjs/gatsby-starter-blog)を利用し、雛形を生成した

生成したブログからプロフィールなどを書き換えていく
Twitterのアカウントプロフィールとかを表示している項目のことをBiographyの先頭をとってBio(バイオ)と言うらしい

## 利用しているパッケージについて

### Plugin, Transformer

#### [gatsby-plugin-image](https://www.gatsbyjs.com/plugins/gatsby-plugin-image/)

画像のレスポンシブ、複数のフォーマット対応に利用
コンポーネントを利用していないがgatsby-config.js でコメントアウトすると記事が全て表示されなくなった

#### [gatsby-plugin-sharp](https://www.gatsbyjs.com/plugins/gatsby-plugin-sharp/)

画像処理ライブラリの `sharp` をGatsbyプラグインで利用するためのヘルパー
直接利用していなかったため削除
npm7以降では依存するパッケージのpeerDependenciesに記述されたパッケージもインストールする?
gatsby-plugin-imageから利用

#### [gatsby-transformer-sharp](https://www.gatsbyjs.com/plugins/gatsby-transformer-sharp/)

画像処理を扱うGraphQLのトランスフォーマー
gatsby-plugin-imageから利用

#### [gatsby-plugin-manifest](https://www.gatsbyjs.com/plugins/gatsby-plugin-manifest/)

PWAのマニフェストを生成する
`gatsby-plugin-offline` との利用が推奨されている
PWA対応予定はないため削除

#### [gatsby-plugin-offline](https://www.gatsbyjs.com/plugins/gatsby-plugin-offline/)

PWA対応予定はないため削除

#### [gatsby-source-filesystem](https://www.gatsbyjs.com/plugins/gatsby-source-filesystem/)

gatsybyでローカルのファイルを扱うためのプラグイン

### Markdown

#### [gatsby-transformer-remark](https://www.gatsbyjs.com/plugins/gatsby-transformer-remark)

マークダウンのプロセッサーであるremarkを利用してマークダウンを解析する

#### [gatsby-remark-copy-linked-files](https://www.gatsbyjs.com/plugins/gatsby-remark-copy-linked-files/)

マークダウンでリンクしたローカルのファイルを `public` といった  rootディレクトリにコピーする `gatsby-transformer-remark` のプラグイン

#### [gatsby-remark-images](https://www.gatsbyjs.com/plugins/gatsby-remark-images/)

マークダウンに含まれる画像を処理する `gatsby-transformer-remark` のプラグイン
レスポンシブ画像対応のための基準となるピクセル数を `maxWidth` で設定する

#### [gatsby-remark-responsive-iframe](https://www.gatsbyjs.com/plugins/gatsby-remark-responsive-iframe/)

マークダウンでiframeを利用することができる `gatsby-transformer-remark` のプラグイン

#### [gatsby-remark-prismjs](https://www.gatsbyjs.com/plugins/gatsby-remark-prismjs/)

PrismJSでマークダウンのコードブロック中のシンタックスハイライトを有効にする
行数の表示や言語ごとの細かなオプション指定が可能
`gatsby-transformer-remark` のプラグイン

#### [gatsby-remark-smartypants](https://www.gatsbyjs.com/plugins/gatsby-remark-smartypants/)

[retext-smartypants](https://github.com/retextjs/retext-smartypants)を利用して `"` を `“` 、 `'` を `‘` のように句読点を置き換える
ビルド後に意図しない形式に置き換わることを避けたいので利用しない
`gatsby-transformer-remark` のプラグイン

### Font

Typefacesは非推奨になり、[FontSource](https://github.com/fontsource/fontsource)に移行したため、対応した

#### [typeface-merriweather](https://github.com/KyleAMathews/typefaces/tree/master/packages/merriweather)

`Merriweather` を扱うためのfont, cssを含む

非推奨となった `typeface-merriweather` を削除し、`fontsource-merriweather` を追加

```shell
npm uninstall typeface-merriweather
npm install --save fontsource-merriweather
```

`gatsby-browser.js` のインポートを修正する

```diff
-import "typeface-montserrat"
+import 'fontsource-montserrat/latin.css'
```

#### [typeface-montserrat](https://github.com/KyleAMathews/typefaces/tree/master/packages/montserrat)

`Montserrat` を扱うためのfont, cssを含む

非推奨となった `typeface-merriweather` を削除し、`fontsource-merriweather` を追加

```shell
npm uninstall typeface-montserrat
npm install --save fontsource-montserrat
```

`gatsby-browser.js` のインポートを修正する

```diff
-import "typeface-merriweather"
+import 'fontsource-merriweather/latin.css'
```

### SEO

#### [gatsby-plugin-feed](https://www.gatsbyjs.com/plugins/gatsby-plugin-feed/)

RSSを作成する

#### [gatsby-plugin-google-analytics](https://www.gatsbyjs.com/plugins/gatsby-plugin-google-analytics/)

非推奨になり、Google Analyticsを導入にはGA4に対応した[gatsby-plugin-google-gtag](https://www.gatsbyjs.com/plugins/gatsby-plugin-google-gtag)を利用する

#### [react-helmet](https://github.com/nfl/react-helmet)

サイトのmetaタグやOGPを設定できる

#### [gatsby-plugin-react-helmet](https://www.gatsbyjs.com/plugins/gatsby-plugin-react-helmet/)

`react-helmet` を利用してHTMLドキュメントのHEADのメタタグなどを制御できる

## 環境変数の読み込みを有効にする

[Environment Variables](https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/)を参考に実装

`.env.development` , `.env.production` を追加し、`gatsby-config.js` で環境変数の読み込みを有効にする

```js
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
```

環境変数の読み込みをサポートする `dotenv` は `gatsby` にプリインストールされているためインストールは不要

## Google Analyticsの設定

[gatsby-plugin-google-gtag](https://www.gatsbyjs.com/plugins/gatsby-plugin-google-gtag)を導入し、Google Analyticsを有効にする
Google Analyticsで発行したtrackingIdを環境変数から読み込む
`<head>` セクションに設定するためオプションを指定

```js
{
  resolve: `gatsby-plugin-google-gtag`,
  options: {
    trackingIds: [
      process.env.GOOGLE_ANALYTICS_TRACKING_ID, // Google Analytics / GA
    ],
    pluginConfig: {
      head: true,
    },
  },
},
```

ビルドしてスクリプトが埋め込まれていることを確認

```shell
gatsby build
gatsby serve
```

```html
<html>
    <head>
      <script type="module">
        <script async="" src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"></script>
      </script>
    </head>
</html>
```

### 自宅のIPアドレスを計測から除外する

管理 > データストリーム

ストリームを選択し、「タグ付けの詳細設定」から内部トラフィック　ルールを設定

|項目|値|
|:--|:--|
|ルール名|自宅|
|traffic_type の値|internal|
|IP アドレス > マッチタイプ|IPアドレスが次と等しい|
|IP アドレス > 値|確認したGIP|

### Google シグナルを有効にする

コンソールから有効にする

管理 > 設定 > データ設定 > データ収集
