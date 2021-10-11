---
title: sinonのstubとmockについて
date: "2021-09-17T13:07:59.710Z"
status: published
---

普段テストの記述にTypescriptのプロジェクトならテストフレームワークにjest、JavaScriptならmochaを導入している。テスト対象の依存先の振る舞いを変更するためにはSinonのmock, stubを利用する。Sinonを利用する際にmockとstubの使い分けについて整理した。

## 自分の結論

Sinonを利用して振る舞いを上書きしたオブジェクト(または関数)の検証にはmockを利用する。これは[mockのドキュメント](https://sinonjs.org/releases/v11.1.2/mocks/)の `When to use mocks?` にも書かれている。

>If you want to control how your unit is being used and like stating expectations upfront (as opposed to asserting after the fact), use a mock.

上記の引用にあるようにテスト対象のある関数の振る舞いを制御する際、引数や呼び出しの検証方法が豊富なmockを利用する。また、mockを利用することで、期待した引数と呼び出し時の引数が異なった際にも差分を出力してくれるので開発効率が上がる。stubの場合、期待した引数と呼び時の引数が異なるとオブジェクトはラップされず、対象の処理が実行されるため失敗に気づきにくい。
stubはテスト対象の処理が期待通りに実行されているかの関心とは異なる共通処理や呼び出しに利用する。例えば、結合テストでのユーザーの認証など呼び出し時の検証が必要ない外部依存の処理などに利用する。

## stubとmockの違い

例として、IDを指定して記事を取得する `getArticle` 関数のテストを挙げる。この関数は外部APIに記事一件の取得をリクエストし、取得結果を返す。外部APIのネットワーク状態によってレイテンシやレイトリミットによってテストの成功失敗が左右されるため、振る舞いをラップし外部間の環境に依存しないことが望ましい。sinonを利用すると対象の処理は実行されず、指定した値を返すように振る舞いを上書きできる。

```js
export const findArticle = async (
  id: number
): Promise<Article> => {
  return await articleApi.fetch(id);
};
```

### stubを利用したテスト

stubを利用して記述したテストを下に示す。

```js
sinon.stub(articleApi, "fetch").withArgs(1).resolves({
id: 1,
title: "article1",
authorId: 2,
});

const result = await findArticle(1);
```

#### 利用しているメソッド

- withArgs

`withArgs` を利用すると指定された引数でラップしたメソッドが呼び出された場合のみにstubする。指定していない引数で対象のメソッドを呼び出した場合はstubされず、本来の処理が実行される。指定された引数のみを検証するため、 `withArgs(1)` とした場合に `findArticle(1, 2)` のように以降の引数は検証せずstubされる。

### mockを利用する場合

mockを利用して記述したテストを下に示す。

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

#### 利用しているメソッド

- once
- withExactArgs
- verify

`once` は関数が一度のみ呼び出されたことを検証する。 `withExactArgs` は `withArgs` と異なり、呼び出し時の引数を厳格に検証するため、指定した引数以降に追加の引数がある場合はmockされない。mockも `withArgs` を利用できる。 `once` と `withExactArgs` を組み合わせることにより、指定した引数で必ず一度呼び出されることを担保できる。 `verify` はmockした返り値をテスト対象のメソッド呼び出し後に指定した条件を満たしているか検証し、条件を満たしていない場合はエラーをthrowする。

### mockとstubの比較

stubとmockで提供するAPIの違いが大きい。stubでは `withArgs` を利用して呼び出し時に期待した引数で実行されているか検証できる。だが、これは値の検証よりも引数Aの際は結果1を返す、引数Bの際は結果2を返すと言ったstubの場合分けに利用する意味合いが強い。対して、mockには例に挙げたようにmock対象が何度実行されたか、期待した引数と一致しているかなど検証用のAPIが豊富であり、柔軟な記述ができる。
