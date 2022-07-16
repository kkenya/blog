---
title: Gatsbyを4系に更新した
date: "2022-07-16T22:13:03+09:00"
status: published
---

[ドキュメント](https://www.gatsbyjs.com/docs/reference/release-notes/migrating-from-v3-to-v4/)のマイグレーション手順に従いGatsbyを3系から4系に更新した
パッケージの依存関係が崩れる可能性があるので適宜ビルドできるか確認しながら進めたが、破壊的な変更はほとんどなくパッケージの更新で対応できた

## Nodejs更新

Nodejs16, npm8を利用する
CI/CDのランタイムも合わせて更新

## Gatsby更新

Gatsby自身のバージョン更新

```shell
npm install gatsby@latest
```

下のように各プラグインのpeerDependenciesがgatsby3に依存しており、buildできない

```shell
warn Plugin gatsby-plugin-image is not compatible with your gatsby version 4.18.2 - It requires gatsby@^3.0.0-next.0
```

一つづつ依存を解消することは難しいため、[npm-check-updates](https://github.com/raineorshine/npm-check-updates)を利用して一括でパッケージを更新

オプションなしの実行では差分のみ検出する

```shell
% npx npm-check-updates -u
Upgrading ~/work/github.com/kkenya/blog/package.json
[====================] 27/27 100%

 gatsby-plugin-feed               ^3.11.0  →  ^4.18.1
 gatsby-plugin-google-analytics   ^3.11.0  →  ^4.18.0
 gatsby-plugin-image              ^1.11.0  →  ^2.18.1
 gatsby-plugin-manifest           ^3.11.0  →  ^4.18.1
 gatsby-plugin-offline            ^4.11.0  →  ^5.18.1
 gatsby-plugin-react-helmet       ^4.11.0  →  ^5.18.0
 gatsby-plugin-sharp              ^3.11.0  →  ^4.18.1
 gatsby-remark-copy-linked-files   ^4.8.0  →  ^5.18.0
 gatsby-remark-images              ^5.8.0  →  ^6.18.1
 gatsby-remark-prismjs             ^5.8.0  →  ^6.18.0
 gatsby-remark-responsive-iframe   ^4.8.0  →  ^5.18.0
 gatsby-remark-smartypants         ^4.8.0  →  ^5.18.0
 gatsby-source-filesystem         ^3.11.0  →  ^4.18.1
 gatsby-transformer-remark         ^4.8.0  →  ^5.18.1
 gatsby-transformer-sharp         ^3.11.0  →  ^4.18.1
 prismjs                          ^1.24.1  →  ^1.28.0
 react                            ^17.0.1  →  ^18.2.0
 react-dom                        ^17.0.1  →  ^18.2.0
 typeface-merriweather             0.0.72  →   1.1.13
 typeface-montserrat               0.0.75  →   1.1.13
 prettier                           2.3.2  →    2.7.1
 textlint                         ^12.0.2  →  ^12.2.1
 textlint-rule-preset-jtf-style   ^2.3.12  →  ^2.3.13

Run npm install to install new versions.
```

`-u` オプションで `package.json` の書き換えを行う
実行後パッケージをインストール

```shell
npx npm-check-updates -u
npm install
```

依存パッケージの脆弱性を[npm-audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)で修正する

```shell
npm audit fix
```

### 破壊的な変更

[gatsby-plugin-gatsby-cloud](https://www.gatsbyjs.com/plugins/gatsby-plugin-gatsby-cloud/)でタイトルを設定していないためエラーになった
Gatsby Cloudを利用しないためパッケージ自体を削除して対応
