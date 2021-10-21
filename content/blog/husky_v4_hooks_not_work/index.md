---
title: "以前から利用していたhusky v4のhooksが実行されない"
date: "2021-10-07T23:48:00+09:00"
status: published
---

業務で利用している `husky` のバージョンは `4.3.0` 。5系はライセンスの問題でアップデートできなかったが、現在は7系でその問題も解消されたので**7系**にアップデートするを推奨する。あくまで一時的な対応として残しておく。

## 環境

- husky 4.3.0

## 遭遇した問題

`pre-commit` , `pre-push` などリポジトリに設定したhooksが実行されない。

## 結論

gitの変数 `core.hooksPath` を削除する。

```sh
# これで core.hooksPathも削除される
npx husky uninstall
```

または、gitの設定を変更する。

```sh
git config --unset core.hooksPath
```

## 調査したときのログ

ざっくりとした理解だが、huskyは[githook](https://git-scm.com/docs/githooks)を利用してコミット前、プッシュ前などのアクションで対応したファイルが実行される。
デフォルトでは `.git/hooks` ディレクトリにある `pre-commit` , `pre-push` などのアクション名に対応したファイルが実行される。

`.git/hooks` 配下には今回リポジトリで設定していた `pre-commit` が存在しているので確認すると `.git/husky.sh` を実行していた。

```sh
% bat .git/hooks/pre-commit
───────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
       │ File: .git/hooks/pre-commit
───────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   1   │ #!/bin/sh
   2   │ # husky
   3   │
   4   │ # Created by Husky v4.3.0 (https://github.com/typicode/husky#readme)
   5   │ #   At: 2021/10/7 11:26:24
   6   │ #   From: /Users/s06540/work/github.com/cam-inc/fortune-env/repos/logic/node_modules/husky (https://github.com/typicode/husky#readme)
   7   │
   8   │ . "$(dirname "$0")/husky.sh"
───────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```

.huskyも存在している。

```sh
% ls .git/hooks
applypatch-msg  husky.local.sh  post-applypatch  post-commit  post-rewrite  pre-applypatch  pre-commit        pre-push    prepare-commit-msg  sendemail-validate
commit-msg      husky.sh        post-checkout    post-merge   post-update   pre-auto-gc     pre-merge-commit  pre-rebase  push-to-checkout
```

huskyの設定は問題なさそうなのでhuskyの生成したファイル自体が実行されていなさそう。
githooksのドキュメントを確認すると `core.hooksPath` を設定することでhooksのディレクトリを変更できる。

>By default the hooks directory is $GIT_DIR/hooks, but that can be changed via the core.hooksPath configuration variable

`.git/config` を確認すると `hooksPath` に `.husky` が設定されていた。

```sh
% bat .git/config
───────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
       │ File: .git/config
───────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   1   │ [core]
   2   │     repositoryformatversion = 0
   3   │     filemode = true
   4   │     bare = false
   5   │     logallrefupdates = true
   6   │     ignorecase = true
   7   │     precomposeunicode = true
   8   │     hooksPath = .husky
───────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```

`core.hooksPath` の設定をなくし（直接ファイルから削除してもいい）、commitすると以前と同じようにhooksが実行された。

```sh
% git config --unset core.hooksPath
% git commit
husky > pre-commit (node v14.17.6)
✔ Preparing...
⚠ Running tasks...
```

### 同じ状況を再現するには

```sh
npx husky install
```

npxでhusky installを実行した場合4系の設定が反映されない。 `core.hooksPath` を設定するのはgithooks v2を利用するようになったv5以降。v4を利用しているためデフォルトの `.git/hooks` 配下のファイルを実行して欲しいが、`core.hooksPath` にhuskyの生成する独自ディレクトリが指定される。設定自体はv4のままなので参照先に設定ファイルは存在せず、hooksが実行されていないような挙動となっていた。
