---
title: Gatsbyで生成したブログにRSSフィードを導入する
date: "2022-07-23T15:31:54+09:00"
status: published
---

GatsbyのブログにRSSフィードを導入した。

ドキュメントの[Adding an RSS Feed](https://www.gatsbyjs.com/docs/how-to/adding-common-features/adding-an-rss-feed/)に従って実装。

## 環境

- Markdownをremarkでパースしている

## [gatsby-plugin-feed](https://www.gatsbyjs.com/plugins/gatsby-plugin-feed/)

### パッケージのインストール

```shell
npm install gatsby-plugin-feed
```

### 設定

gatsby-plugin-feedは内部的に[dylang/node-rss](https://github.com/dylang/node-rss)を利用しており、クエリのフィールド名はこのパッケージのオプションに対応する。

`query` オプションですべてのRSSに共通したフィールドを指定する。

[このクエリは `baseQuery` として `feeds` の各要素のクエリ実行結果に統合される](https://github.com/gatsbyjs/gatsby/blob/45bb97ab545e7e597123cac14331e3633d719d63/packages/gatsby-plugin-feed/src/gatsby-node.js#L28)

例えば `gatsby-config.js` に設定したメタ情報である `siteUrl` をnode-rssのオプションである `site_url` に指定している。

```js
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
```

`feeds` はファイル（locale）ごとに設定する。生成するファイルが1つなら要素は1つとなる。

`feeds` の各要素では `output` , `query` , `title` , `serialize` が必須。
`serialize` には `options.query` のクエリとfeedごとの `options.feeds[n].qeury` を統合した実応結果が引数に渡される。

例では `site` と `allMarkdownRemark`。
`serialize` 関数の返り値はnode-rssの[itemOptions](https://github.com/dylang/node-rss#itemoptions)に対応する。

### RSSフィードに画像を設定する

`gatsby-config.js` の `siteMetadata` にサムネイルのURLを設定。

```js
module.exports = {
  siteMetadata: {
    title: `蛙のテックブログ`,
    description: `Web系ソフトウェアエンジニアの備忘録`,
    siteUrl: `https://memo.kkenya.com`,
    thumbnailUrl: `https://memo.kkenya.com/favicon.ico`,
    // ...省略
  }
}
```

gatsby-plugin-feedの `options.query` に画像URL `image_url` を指定。

```js
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                thumbnailUrl
                site_url: siteUrl
                image_url: thumbnailUrl
              }
            }
          }
        `,
        feeds: [
```

### 記事ごとの画像設定

`seriarize` 関数で `enclosure` を指定する。
全ての記事で共通の画像を設定した。frontmatterで記事ごとにogp画像を設定可能にし、なければデフォルトの画像を取得するなどの対応が考えられる。

```js
module.exports = {
  siteMetadata: {
    // ...
    articleDefaultImageUrl: `${siteUrl}/aritcle_default_image.jpg`,
    articleDefaultImageSize: 1386534,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: ``,
        feeds: [
          {
            title: "KKenya TechBlog",
            output: "/rss.xml",
            query: ``,
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                const { excerpt, fields, html, frontmatter } = edge.node
                const { title, date } = frontmatter
                const {
                  siteUrl,
                  articleDefaultImageUrl,
                  articleDefaultImageSize,
                } = site.siteMetadata
                const url = `${siteUrl}${fields.slug}`

                return {
                  title,
                  description: excerpt,
                  date,
                  url,
                  guid: url,
                  custom_elements: [{ "content:encoded": html }],
                  enclosure: {
                    url: articleDefaultImageUrl,
                    size: articleDefaultImageSize,
                  },
                }
              })
            },
          },
        ],
      },
    },
  ],
}
```

### ビルド

devサーバーでは確認できないため、ビルドして確認する。

```shell
gatsby build && gatsby serve
```

### 動作確認

`/rss.xml` にアクセス (e.g. `http://localhost:9000/rss.xml` )して確かめる。

- 生成できている
- 画像が設定されている
- HTMLの `head` にフィードのリンクが設定されている

```html
<link rel="alternate" type="application/rss+xml" title="KKenya TechBlog" href="/rss.xml">
```

デプロイ後は実際にRSSリーダーでフィードの購読、サムネイル画像が表示されていること。

### [Feed Validation Service](https://validator.w3.org/feed/)

W3CのFeed Validation Serviceで仕様に準拠しているか検証できる。
URLを入力しCheckを実行すると、RSSフィードを取得され有効な形式であること・より適切な形式があるか確認できる。
生成したXMLを `Validate by Direct Input` に入力し、ローカルのXMLを検証することも可能。

![rss_feed_validator_result](./rss_feed_validator_result.png)

## メモ

### gatsby-plugin-feedでfor...ofを利用し配列の要素をimmutableに操作していた

[gatsby/packages/gatsby-plugin-feed/src/gatsby-node.js](https://github.com/gatsbyjs/gatsby/blob/564a8f7358edd2599199e79c902468fa83f916b2/packages/gatsby-plugin-feed/src/gatsby-node.js#L25)のコードリーディングで詰まったのでメモ。

```js
arr = [
  { title: 'a', query: 'aaa' },
  { title: 'b', query: 'bbb' },
  { title: 'c', query: 'ccc' }
]
// スプレッド構文で展開することによって arr の要素をシャローコピーする
// スプレッド構文がない場合後続のfeed.resultの代入でarrの各要素が破壊的に変更される
for (const { ...feed } of arr) {
  feed.resut = `result: ${feed.title} run ${feed.query}`
  console.log(feed)
}
// { title: 'a', query: 'aaa', resut: 'result: a run aaa' }
// { title: 'b', query: 'bbb', resut: 'result: b run bbb' }
// { title: 'c', query: 'ccc', resut: 'result: c run ccc' }
```

### 参考

- [www.rssboard.org](https://www.rssboard.org/rss-draft-1#element-channel-item-enclosure)
- [GatsbyJSでRSSフィードを作成](https://www.ya-n.com/blog/2019-07-24-rss-feed/)
- [RSS・AtomフィードはValidatorでチェックしよう](https://torum.hatenablog.com/entry/2021/06/23/094834)
