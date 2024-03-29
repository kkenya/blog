---
title: Gatsbyでテックブログを開設した
date: "2021-01-12T17:54:00+09:00"
status: published
---

## 背景

ブログを作るにあたり、マークダウンで記述できることを要件とした。
また、サーバーを運用するコストを減らすためSSGで生成したドキュメントをS3などのクラウドストレージにホスティングする。

よく見かける構成としてMicroCMSやContentfulなどのCMSを利用して記事を管理するパターンがあるが、次の理由で採用しなかった。

- 記事はVSCodeなどを利用してPCで編集するため、CSMから提供されるマークダウンエディタを活用する機会がない
- 個人開発のプロダクトなので仕事が忙しい場合はメンテナンスに時間が割けないことは明らかだったので外部サービスの依存を減らしたかった
- APIコールによる従量課金を考えると記事の表示ごとにCSRせず、デプロイ時に全ての記事を取得しSSGする方法が望ましいが、この構成でCMSを利用する利点がCMSを管理する欠点を上回らなかった

以上のことから[Gatsby](https://www.gatsbyjs.com/)を利用し、マークダウンはソースコードに含めGitHubで管理する。

### Gatsbyの学習

チュートリアルをこなして、基本的な開発の進め方とプラグインの使い方を学んだ。

### starterで雛形を生成する

[gatsby-starter-blog](https://www.gatsbyjs.com/starters/gatsbyjs/gatsby-starter-blog)を利用し、雛形を生成した。

生成したブログからプロフィールなどを書き換えていく。

※ TwitterなどのSNSアカウントのプロフィールに表示している項目をBiographyの先頭をとってBio（バイオ）と言うらしい。

## 環境変数の読み込みを有効にする

[Environment Variables](https://www.gatsbyjs.com/docs/how-to/local-development/environment-variables/)を参考に実装した。

`.env.development` , `.env.production` を追加し、`gatsby-config.js` で環境変数の読み込みを有効にする。

```js
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
```

環境変数の読み込みをサポートする `dotenv` は `gatsby` にプリインストールされているためインストールは不要。

## Google Analyticsを設定

[gatsby-plugin-google-gtag](https://www.gatsbyjs.com/plugins/gatsby-plugin-google-gtag)を導入し、Google Analyticsを有効にする。
Google Analyticsで発行したtrackingIdを環境変数から読み込み、スクリプトのタグを `<head>` セクションに設定するためオプションを指定。

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

ビルド後、ドキュメントからスクリプトが埋め込まれていることを確認。

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

Google Analyticsのコンソールから「管理 → データストリーム」を選択。

ストリームを選択し、「タグ付けの詳細設定」から「内部トラフィック ルール」を設定。

|項目|値|
|:--|:--|
|ルール名|自宅|
|traffic_type の値|internal|
|IP アドレス > マッチタイプ|IPアドレスが次と等しい|
|IP アドレス > 値|確認したGIP|

### Google シグナルを有効にする

コンソールの「管理 → 設定 → データ設定 → データ収集」から有効にする。

## [Google Search](https://search.google.com/search-console)

検索エンジンでのパフォーマンスを分析できるツール。

`kkenya.com` をGoogle Domainで取得したため、所有権の確認が自動的に完了していた
`お名前.com` などの外部サービスでドメインを取得した場合は、[確認方法に従い](https://support.google.com/webmasters/answer/9008080?hl=ja#choose_method&zippy=)対応する必要がある。

### [Google Search Console Insights](https://search.google.com/search-console/insights/)

Google Analyticsと連携することでページビュー数やアクセス経路を確認できる。
GitHubのREADMEからの被リンクで流入があったことを確認できた。

![page views for Google Search Console Insights](./google_search_console_insights_page_views.png)

### URL検査ツール

指定したURLがGoogleにインデックスされているか確認できる。
実行したところ登録されていなかった。

![inspect url for Google Search Console](./google_search_console_inspect_url.png)

「公開URLをテスト」を実行した結果、登録可能だったのでリクエストした。

![inspected result for Google Search Console](./google_search_console_inspected_result.png)

## メモ

### サイトがGoogleのインデックスに登録されているか調べる

Googleの検索でクエリを指定する。

```text
site:memo.kkenya.com
```

## gatsby-starter-blogで利用しているパッケージについて

gatsby-starter-blogで利用されているパッケージを把握した。

### Plugin/Transformer

#### [gatsby-plugin-image](https://www.gatsbyjs.com/plugins/gatsby-plugin-image/)

レスポンシブ対応、複数のフォーマット対応など画像の最適化に利用される。

#### [gatsby-plugin-sharp](https://www.gatsbyjs.com/plugins/gatsby-plugin-sharp/)

画像処理ライブラリの `sharp` をGatsbyプラグインで利用するためのヘルパー。
直接利用していなかったため削除した。
npm7以降では依存するパッケージのpeerDependenciesに記述されたパッケージもインストールするらしい（要調査）。
gatsby-plugin-imageから利用。

#### [gatsby-transformer-sharp](https://www.gatsbyjs.com/plugins/gatsby-transformer-sharp/)

画像処理を扱うGraphQLのトランスフォーマー。
gatsby-plugin-imageから利用。

#### [gatsby-plugin-manifest](https://www.gatsbyjs.com/plugins/gatsby-plugin-manifest/)

PWAのマニフェストを生成する。
PWA対応予定はないため削除。
`gatsby-plugin-offline` との利用が推奨されている。

#### [gatsby-plugin-offline](https://www.gatsbyjs.com/plugins/gatsby-plugin-offline/)

PWA対応予定はないため削除。

#### [gatsby-source-filesystem](https://www.gatsbyjs.com/plugins/gatsby-source-filesystem/)

gatsybyでローカルのファイルを扱うためのプラグイン。

### Markdown

#### [gatsby-transformer-remark](https://www.gatsbyjs.com/plugins/gatsby-transformer-remark)

マークダウンのプロセッサーであるremarkを利用してマークダウンを解析する。

#### [gatsby-remark-copy-linked-files](https://www.gatsbyjs.com/plugins/gatsby-remark-copy-linked-files/)

マークダウンでリンクしたローカルのファイルをrootディレクトリ（`public`）にコピーする `gatsby-transformer-remark` のプラグイン。

#### [gatsby-remark-images](https://www.gatsbyjs.com/plugins/gatsby-remark-images/)

マークダウンに含まれる画像を処理する `gatsby-transformer-remark` のプラグイン。
レスポンシブ画像対応のための基準となるピクセル数を `maxWidth` で設定する。

#### [gatsby-remark-responsive-iframe](https://www.gatsbyjs.com/plugins/gatsby-remark-responsive-iframe/)

マークダウンでiframeを利用できる `gatsby-transformer-remark` のプラグイン。

#### [gatsby-remark-prismjs](https://www.gatsbyjs.com/plugins/gatsby-remark-prismjs/)

PrismJSでマークダウンのコードブロック中のシンタックスハイライトを有効にする。
`gatsby-transformer-remark` のプラグイン。
行数の表示や言語ごとの細かなオプション指定が可能。

#### [gatsby-remark-smartypants](https://www.gatsbyjs.com/plugins/gatsby-remark-smartypants/)

[retext-smartypants](https://github.com/retextjs/retext-smartypants)を利用して `"` を `“` 、 `'` を `‘` のように句読点を置き換える。
`gatsby-transformer-remark` のプラグイン。
ビルド後記事を意図しない形式に置き換えられることを避けたいので利用しない。

### Font

Typefacesは非推奨になり、[FontSource](https://github.com/fontsource/fontsource)に移行したため、対応した。

#### [typeface-merriweather](https://github.com/KyleAMathews/typefaces/tree/master/packages/merriweather)

`Merriweather` を扱うためのfont, cssを含む。

非推奨となった `typeface-merriweather` を削除し、`fontsource-merriweather` を追加。

```shell
npm uninstall typeface-merriweather
npm install --save fontsource-merriweather
```

`gatsby-browser.js` のインポートを修正した。

```diff
-import "typeface-montserrat"
+import 'fontsource-montserrat/latin.css'
```

#### [typeface-montserrat](https://github.com/KyleAMathews/typefaces/tree/master/packages/montserrat)

`Montserrat` を扱うためのfont, cssを含む。

非推奨となった `typeface-merriweather` を削除し、`fontsource-merriweather` を追加。

```shell
npm uninstall typeface-montserrat
npm install --save fontsource-montserrat
```

`gatsby-browser.js` のインポートを修正した。

```diff
-import "typeface-merriweather"
+import 'fontsource-merriweather/latin.css'
```

### SEO

#### [gatsby-plugin-feed](https://www.gatsbyjs.com/plugins/gatsby-plugin-feed/)

RSSを作成する。

#### [gatsby-plugin-google-analytics](https://www.gatsbyjs.com/plugins/gatsby-plugin-google-analytics/)

非推奨になり、Google Analyticsを導入にはGA4に対応した[gatsby-plugin-google-gtag](https://www.gatsbyjs.com/plugins/gatsby-plugin-google-gtag)を利用する。

#### [react-helmet](https://github.com/nfl/react-helmet)

document headにelementを設定できる。
`gatsby@^4.19.0` 以降はDocument headを追加できるGatsby Head APIの利用が推奨され、今後deprecatedとなる。

#### [gatsby-plugin-react-helmet](https://www.gatsbyjs.com/plugins/gatsby-plugin-react-helmet/)

`react-helmet` を利用してHTMLドキュメントのHEADのメタタグなどを制御できる。
