---
title: macOSで設定しているgitの設定について
date: "2018-12-04T06:42:00.000Z"
status: published
---

## homebrewで最新のGitを利用する

Macにプリインストールされているgitはバージョンが古いので、homebrewでインストールしたgitに移行する。
プリインストールされたgitのインストール先を確認。

```shell
$ which git
/usr/bin/git
$ git --version
git version 2.37.1 (Apple Git-137.1)
```

brewでgitをインストールする。

```shell
$ brew install git
==> git: stable 2.39.0 (bottled), HEAD
Distributed revision control system
https://git-scm.com
/opt/homebrew/Cellar/git/2.38.1 (1,592 files, 48.1MB) *
  Poured from bottle on 2022-11-18 at 14:29:15
From: https://github.com/Homebrew/homebrew-core/blob/HEAD/Formula/git.rb
License: GPL-2.0-only
==> Dependencies
Required: gettext ✔, pcre2 ✔
==> Options
--HEAD
        Install HEAD version
==> Caveats
The Tcl/Tk GUIs (e.g. gitk, git-gui) are now in the `git-gui` formula.
Subversion interoperability (git-svn) is now in the `git-svn` formula.

Bash completion has been installed to:
  /opt/homebrew/etc/bash_completion.d
==> Analytics
install: 340,526 (30 days), 1,086,049 (90 days), 3,535,289 (365 days)
install-on-request: 334,624 (30 days), 1,067,520 (90 days), 3,465,417 (365 days)
build-error: 16 (30 days)
```

最新のgitが更新されていることを確認する。

```shell
% git --version
git version 2.38.1
% which git
/opt/homebrew/bin/git
```

### homebrewでインストールしたgitが反映されない

brewのパッケージインストール先がシェルのパスに含まれていなかった。

brewのパッケージをインストールするディレクトリは `prefix` オプションで確認できる。
説明にあるようにmacOSでもintelとamd(M1)でインストール先が異なる。

```shell
% man brew
...省略
   --prefix [--unbrewed] [--installed] [formula ...]
       Display Homebrew´s install path. Default:

       •   macOS Intel: /usr/local

       •   macOS ARM: /opt/homebrew

       •   Linux: /home/linuxbrew/.linuxbrew
...省略
```

シェルのPATHを追加する。環境に依存しないよう `brew` コマンドの実行結果を指定する。

`~/.zshrc`

```shell
export PATH="$(brew --prefix)/bin:$PATH"
```

## gitの補完を有効にする

先ほどインストールされた補完スクリプトのディレクトリを確認。

```shell
$ ls /usr/local/etc/bash_completion.d
brew   git-completion.bash git-prompt.sh  nodebrew  npm
```

`git-completion.bash`と`git-prompt.sh`をシェルで読み込むように指定する。

```shell
# ~/.bash_profile
source /usr/local/etc/bash_completion.d/git-completion.bash
source /usr/local/etc/bash_completion.d/git-prompt.sh
```

シェルの設定ファイルを再度読み込む。

```shell
source ~/.bash_profile
```
