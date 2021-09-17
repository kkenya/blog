---
title: sinonのstubとmockについて
date: "2021-09-17T13:07:59.710Z"
description: sinonのstubとmockについて整理したメモ
---

普段テストライブラリにはtypescriptのプロジェクトなら jest + sinon, javascriptのプロジェクトなら mocha + sinon を利用している。sinonのmockとstubの使い分けについて整理したメモ。

### 自分の結論

値の検証にはmockを利用する。[mockのドキュメント](https://sinonjs.org/releases/v11.1.2/mocks/)の `When to use mocks?` をみると

>If you want to control how your unit is being used and like stating expectations upfront (as opposed to asserting after the fact), use a mock.

とあるようにテスト対象のある関数の振る舞いを制御する際に、引数や呼び出しの検証は方法が豊富なmockを利用する。また、mockを利用することで、自分の予想と呼び出し時の引数が異なった際にも差分を出力してくれるので開発効率が上がる。
stubはテスト対象の処理が期待通りに実行されているかの関心とは異なる共通処理や呼び出し、例えば結合テストでのユーザーの認証など、呼び出し時の検証が必要ない外部依存の処理などに利用していこと思う。

### stubとmockの違い

下記のようにidを指定して記事を取得する `getArticle` 関数のテストを例に挙げる。この関数は外部APIに記事一件の取得をリクエストする。外部APIのネットワーク状態によってはサービスがレイテンシのリクエスト

```js
export const findArticle = async (
  id: number
): Promise<Article> => {
  return await articleApi.fetch(id);
};
```

### stubを利用する場合

```js
sinon.stub(articleApi, "fetch").withArgs(1).resolves({
id: 1,
title: "article1",
authorId: 2,
});

const result = await findArticle(1);
```

#### 呼び出し時の検証に利用しているメソッド

- withArgs

`withArgs` は指定された引数にのみに対してstubを行う。指定していない引数で対象のメソッドを呼び出した場合はstubされず、本来の処理が実行される。指定された引数のみを検証するため、 `withArgs(1)` とした場合に `findArticle(1, 2)` のように他の引数は検証せずstubされる。

### mockを利用する場合

```js
const articleMock = sinon.mock(articleApi);
articleMock.expects("fetch").once().withExactArgs(1).resolves({
id: 1,
title: "article1",
authorId: 2,
});

const result = await findArticle(1);

articleMock.verify();
```

#### 呼び出し時の検証に利用しているメソッド

- once
- withExactArgs
- verify

`once` は関数が一度のみ呼び出されたことを検証する。 `withExactArgs` は `withArgs` と異なり、指定された引数と追加の引数を厳格に検証する(mockも `withArgs` を利用できる)。 `once` と `withExactArgs` を組み合わせることで指定した引数で一度必ず呼び出されることを担保できる。 `verify` はmockに指定した条件を満たしているか検証し、条件を満たしていない場合はエラーをthrowする。
