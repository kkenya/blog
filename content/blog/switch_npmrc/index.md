---
title: ディレクトリごとにnpmrcを切り替えたかった
date: "2022-04-24T14:26:05+09:00"
status: draft
---

privateなパッケージの管理に外部のレジストリを利用しているが、個人のプロジェクトでは標準のレジストリを利用したい
ディレクトリの管理を下記のようにユーザーごとにわけており、 `company` 配下のリポジトリのみregistryを切り替えたい

```shell
~
└── work
    ├── kkenya # 標準のregistryを利用
    │   └── todo-app
    └── company1 # 配下でregistryを切り替えたい
        ├── project1
        └── project2
```

## 結論

あるディレクトリ配下全てのプロジェクトで設定を共有することはできず、プロジェクトごとに `.npmrc` を追加するか `Scoped packges` を利用する必要があった

### プロジェクトごとの　`.npmrc` を配置する

`.npmrc.company1` のように切り替えたい設定を記述した設定ファイルを用意し、適用させたいプロジェクト配下に `.npmrc` をシンボリックリンクで作成するシェルスクリプトを作成した

### `Scoped packages`

`@company1/project1` のように複数のパッケージを同一のスコープに分類し、npm configでスコープに紐づくregistryを設定することで、`npm install` で設定したスコープのパッケージのみ特定のレジストリからインストールすることができる

```shell
npm config set @myco:registry http://reg.example.com
```

- [Associating a scope with a registry](https://docs.npmjs.com/cli/v8/using-npm/scope#associating-a-scope-with-a-registry)

### 詳細

npmの設定ファイルである `.npmrc` の評価には4つの優先順位がある

- プロジェクトごとの設定ファイル(~/work/company1/project2/.npmrc)
- ユーザーごとの設定ファイル(~/.npmrc)
- グルーバルの設定ファイル($PREFIX/etc/npmrc)
- npmにビルドインされた設定ファイル

プロジェクトごとの設定ファイルでは `.npmrc` を配置したディレクトリ以下全てに設定を適用させることはできず、適用させたいプロジェクト直下にそれぞれ `.npmrc` を配置する必要がある

```shell
~
├── .npmrc
└── work
    └── company1
        ├── .npmrc # サブディレクトリに影響しない
        ├── project1 # ~/.npmrcが読み込まれる
        └── project2 # ~/.npmrcが読み込まれる
```

```shell
~
├── .npmrc
└── work
    └── company1
        ├── project1 # ~/work/company1/project1/.npmrcが読み込まれる
        │   └── .npmrc -> /Users/s06540/.npmrc.company1
        └── project2 # ~/work/company1/project2/.npmrcが読み込まれる
            └── .npmrc -> /Users/s06540/.npmrc.company1
```

対応として `.npmrc.company1` のように切り替えたい設定を記述した設定ファイルを用意し、適用させたいプロジェクト配下に `.npmrc` をシンボリックリンクで作成するシェルスクリプトを作成した

利用するregistryを記述した設定ファイル `.npmrc.company1` をホームディレクトリに配置

```text
registry=https://registryexample.test
```

シェルスクリプトを作成
カレントディレクトリ上でディレクトリのみを取得し、それぞれのディレクトリごとに `.npmrc.company1` を参照するシンボリックリンク `.npmrc` を作成するシェルスクリプトを作成する

```shell
#!/bin/bash

readonly NPMRC=".npmrc.company1"

directories=(`find $(pwd) -type d -mindepth 1 -maxdepth 1`)
for dir in ${directories[@]}
do
    ln -s ${HOME}/${NPMRC} ${dir}/.npmrc 
done
```

## 小ネタ

### registryの参照が切り替わっているか確認する

プロジェクトごとに `.npmrc` が切り替わっていれば `registry` が設定されていることを確認できる

```shell
% npm config list
# ...
registry = "https://registryexample.test"
```

## 参考

- [UNIX & Linux コマンド・シェルスクリプト リファレンス](https://shellscript.sunone.me/array.html)
- [npm Docs/npmrc](https://docs.npmjs.com/cli/v8/configuring-npm/npmrc)
- [npm Docs/scope](https://docs.npmjs.com/cli/v8/using-npm/scope#associating-a-scope-with-a-registry)
