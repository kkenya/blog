---
title: Cloud Functionsのディレクトリ構造で `husky` のインストールにハマった
date: "2022-05-01T02:38:20+09:00"
status: published
---

## 環境

|module|version|
|:--|:--|
|husky|7.0.4|

## 結論

プロジェクトのルートディレクトリに `husky` をインストールし、サブディレクトリのnpm-scriptには `--prefix` オプションを指定する

## 内容

Cloud Functionsで開発する際のディレクトリ構造は、 `functions` ディレクトリ配下に `package.json` やソースコードを配置するアプリケーションのソースコードを一階層ネストした構造になっている。そのため、アプリケーションの開発時は基本的に `functions` 上で行う。

```shell
├── .git
└── functions
    ├── src
    ├── node_modules
    └── package.json
```

`functions` 直下で[huskyのREADME](https://github.com/typicode/husky)に沿って設定を進めると、npm-script設定後の実行で同じ階層に `.git` がないためエラーになる

```shell
% npm set-script prepare "husky install"
% npm run prepare

> prepare
> husky install

.git can't be found (see https://git.io/Jc3F9)
```

これは `.git` と同じ階層で `husky` のインストールを行うことで解決できる

```shell
├── .git
├── node_modules
├── package.json # huskyをインストール
└── functions
    ├── src
    ├── node_modules
    └── package.json
```

pre-commit, pre-pushといったイベント時にフックされるコマンドもディレクトリ構造によって変更する必要がある。
例えば、READMEにあるcommitにフックしてテストを実行する場合下記のように設定するが、今回のディレクトリ構造では実行できない。

```shell
npx husky add .husky/pre-commit "npm test"
```

```shell
├── .git
├── node_modules
├── package.json # フック時に対象とするnpm-script
└── functions
    ├── src
    ├── node_modules
    └── package.json # 実行したいnpm-scriptのtestが定義されている
```

これは `--prefix` オプションを指定することで `functions/package.json` のnpm-scriptを実行できる。

```git
 #!/bin/sh
 . "$(dirname "$0")/_/husky.sh"

-npm test
+npm --prefix functions test
```
