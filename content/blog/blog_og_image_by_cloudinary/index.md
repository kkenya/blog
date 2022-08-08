---
title: CloudinaryでOG画像を生成する
date: "2022-08-08T22:46:22+09:00"
status: draft
---

## Cloudinary

画像、動画のアップロードから変換、最適化、CDNでの配信が可能。

## 無料枠

1ユーザー1アカウントで月25クレジットを利用できる。
クレジットはAPIやストレージの利用により消費される。
無料枠はsignupすれば開始でき、クレジットカードの登録は必要ない。

- [PRICING](https://cloudinary.com/pricing)
- [Compare Plans](https://cloudinary.com/pricing/compare-plans)

### 1 Credit

- 100transformations
- 1GBのマネージドストレージ
- 1GBの表示帯域幅
- 500秒のSD動画
- 250秒のHD動画

## アカウント登録

email、pasword、国、オプショナルでsiteの入力後確認メールからsignup。

## テンプレート画像

幅1200px、高さ630pxで作成。

カラーパレットを利用

https://saruwakakun.com/design/gallery/palette

figmaで生成

フォルダの作成
画像アップロード
URLの取得


https://res.cloudinary.com/memo-kkenya-com/image/upload/v1659973449/ogp/og_image_h87i1i.png

[Transformation URL structure](https://cloudinary.com/documentation/image_transformations#transformation_url_structure)

[Transformation URL API](https://cloudinary.com/documentation/transformation_reference)でOG画像を生成する

memo-kkenya-com|cloud_name
image|asset_type
upload|delivery_type
|transformations
v1659973449|version
ogp/og_image_h87i1i|public_id_full_path
png|extention

`,` で区切る

text
l_text:Inter_48:ブログの校正にtextlintを導入した
supported font
https://support.cloudinary.com/hc/en-us/articles/203352832-What-is-the-list-of-supported-fonts-for-text-overlay-transformation-

color
hexで指定
co_rgb:454545

width
w_1045

auto line break
c_fit

URL

```url
https://res.cloudinary.com/memo-kkenya-com/image/upload/v1659977684/ogp/og_image_ge1u4n.png
```

```js

(new URL('https://res.cloudinary.com/memo-kkenya-com/image/upload/l_text:Sawarabi Gothic_48:ブログの校正にtextlintを導入した,co_rgb:454545,w_1045,c_fit/v1659977684/ogp/og_image_ge1u4n.png')).toString()
```

Sawarabi Gothic

全然フォントが使えない
Google Font利用できると言っているが、片っ端から指定して利用できたの一つ...
