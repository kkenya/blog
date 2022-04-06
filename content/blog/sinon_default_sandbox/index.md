---
title: sinonオブジェクトがデフォルトでsandbox環境だった
date: "2022-04-06T19:34:18+09:00"
status: publish
---

## 概要

基本的に `sandbox` を作成する必要はなく、インポートした `sinon` オブジェクトを利用すれば簡潔にテストできる

## 詳細

メソッドの振る舞いを偽装し、関数呼び出しを検証する際、今までは下のように `mock` を利用していた

```js
const mock = sinon.mock(myAPI);
mock
  .expects('method1')
  .once()
  .withExactArgs('arg1', 'arg2')
  .resolves({
    prop1: 'success'
  });

// ...

mock.verify();
```

複数の関数を検証したい場合(一つのテストで複数のmockを利用することの可否は別として)はmockごとに `verify` を呼ぶ必要がないように `sandbox` を利用していた

```js
const sandbox = sinon.createSandbox();

sandbox
  .mock(myAPI)
  .expects('method1')
  .once()
  .withExactArgs('arg1', 'arg2')
  .resolves({
    prop1: 'success'
  });

sandbox
  .mock(myExternalAPI)
  .expects('method2')
  .once()
  .withExactArgs('arg1')
  .resolves({
    prop2: 'ok'
  });

// ...

sandbox.verify();
```

sandboxの[ドキュメント](https://sinonjs.org/releases/v13/sandbox/)を読んでいると `sinon` のオブジェクト自体がデフォルトでサンドボックス環境らしく、 `sinon.createSandbox` でサンドボックスを生成する必要がなかった

> Default sandbox
> Since sinon@5.0.0, the sinon object is a default sandbox. Unless you have a very advanced setup or need a special configuration, you probably want to only use that one.

つまり上で書いた `sandbox` を利用したコードはインポートした `sinon` を利用するだけに置き換えられる

```js

sinon
  .mock(myAPI)
  .expects('method1')
  .once()
  .withExactArgs('arg1', 'arg2')
  .resolves({
    prop1: 'success'
  });

sinon
  .mock(myExternalAPI)
  .expects('method2')
  .once()
  .withExactArgs('arg1')
  .resolves({
    prop2: 'ok'
  });

// ...

sinon.verify();
```

これで何が嬉しいかというと、テスト毎に `sandbox` のインスタンスを生成する必要がないため `mocha` などのテスト終了時に呼び出される関数で共通して偽装した振る舞いの検証ができる

```js
// すべてのテストで共通化できる
afterEach(async () => {
  sinon.verifyAndRestore();
});
```

共通化することでテストコードの書き手が `verify` する必要がなく、 `mock` を書いたが `verify` を呼び出しておらず正しくテストできていない場合を回避できる

```js
const mock = sinon.mock(myAPI);
mock
  .expects('method1')
  .once()
  .withExactArgs('arg1', 'arg2')
  .resolves({
    prop1: 'success'
  });

const result = wrapperMethod();
/**
 * wrapperMethod内でmyAPI.method1を呼び出していないくても、
 * mock.verifyを実行していないためテストは成功してしまう
 */ 
assert.deepStrictEqual(result, 'ok');
```
