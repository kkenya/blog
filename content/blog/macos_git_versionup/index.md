---
title: macOSにプリインストールされているgitからhomebrewでインストールしたgitに移行する
date: "2018-12-04T15:42:00+09:00"
status: published
---

gitのインストール先を確認

```shell
$ which git
/usr/bin/git
```

brewでインストールすると、同時にコマンド入力補完のためのスクリプトもインストールされる

```shell
$ brew install git
==> Upgrading 1 outdated package, with result:
git 2.18.0 -> 2.19.0_1

...

==> git
Bash completion has been installed to:
  /usr/local/etc/bash_completion.d

zsh completions and functions have been installed to:
  /usr/local/share/zsh/site-functions

Emacs Lisp files have been installed to:
  /usr/local/share/emacs/site-lisp/git
```

gitのバージョンを確認し、インストールしたバージョンが反映されていれば成功

```shell
$ git --version
git version 2.19.0
$ which git
/usr/local/bin/git
```

## bashでgitの補完を有効にする

先ほどインストールされた補完スクリプトのディレクトリを確認

```shell
$ ls /usr/local/etc/bash_completion.d
brew   git-completion.bash git-prompt.sh  nodebrew  npm
```

`git-completion.bash` と `git-prompt.sh` をシェルで読み込むように指定する

```shell
vim ~/.bash_profile
```

```shell
source /usr/local/etc/bash_completion.d/git-completion.bash
source /usr/local/etc/bash_completion.d/git-prompt.sh
```

シェルの設定ファイルを再度読み込み

```shell
source ~/.bash_profile
```
