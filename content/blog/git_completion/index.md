---
title: macOSで設定しているgitの設定について
date: "2018-12-04T06:42:00.000Z"
status: published
---

macの移行に伴い、最新のgitインストールから補完設定までを行ったメモ。

## 環境

- zsh 5.9 (arm-apple-darwin21.3.0)
- macOS Monterey 12.6

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

## gitの補完・プロンプト表示を有効にする

GitHubのリポジトリにあるスクリプトを利用してgitの補完やプロンプトでのブランチ表示を有効にする。

- [git/contrib/completion/](https://github.com/git/git/tree/a68dfadae5e95c7f255cf38c9efdcbc2e36d1931/contrib/completion)

各ファイルでGitHubからURLを取得し、行頭にあるコメントに従い有効にする。

### .git-prompt.sh

環境変数 `PS1` に `__git_ps1` を呼び出すことで、プロンプトにgitリポジトリのステータスを表示可能になる。

スクリプトをダウンロードする。

```shell
% wget -O ~/.git-prompt.sh https://raw.githubusercontent.com/git/git/a68dfadae5e95c7f255cf38c9efdcbc2e36d1931/contrib/completion/git-prompt.sh
```

`~/.zshrc` に読み込み設定する。

```shell
source ~/.git-prompt.sh
```

### .git-completion.bash

サブコマンドやブランチ名などを補完できる。
zshの場合はさらにこのスクリプトを扱うためのラッパーである `git-completion.zsh` を利用する。
スクリプトをダウンロードする。

```shell
% wget -O ~/.git-completion.bash https://raw.githubusercontent.com/git/git/a68dfadae5e95c7f255cf38c9efdcbc2e36d1931/contrib/completion/git-completion.bash
```

bashの場合はこのスクリプトを読み込むが、zshではラッパーを介して利用するためダウンロードのみで良い。

### git-completion.zsh

zshでgitの補完を利用するためのラッパースクリプト。

スクリプトのダウンロード。

```shell
% wget -O ~/.zsh/_git https://raw.githubusercontent.com/git/git/a68dfadae5e95c7f255cf38c9efdcbc2e36d1931/contrib/completion/git-completion.zsh
```

`~/.zshrc` に読み込み設定を追加。

```shell
zstyle ':completion:*:*:git:*' script ~/.git-completion.bash
fpath=(${HOME}/.zsh ${fpath})
autoload -Uz compinit && compinit
```

### 確認

.zshrcを読み込むかzshを起動しコマンドやブランチが補完されるか確認する。

```shell
. ~/.zshrc
# または
zsh
```

サブコマンドを途中まで入力する。続けてtabを入力し補完を確認。

```shell
% git pu
pull  -- fetch from and merge with another repository or a local branch
push  -- update remote refs along with associated objects
```

ブランチを途中まで入力する。続けてtabを入力し補完を確認。

```shell
% git pull o
# tabを押す
% git pull origin
```

## トラブルシュート

### .git-completion.bashで `this script is obsolete, please see git-completion.zsh`

zshで `.git-completion.bash` を読み込んでいる場合に警告される。

- [`if [[ -n ${ZSH_VERSION-} && -z ${GIT_SOURCING_ZSH_COMPLETION-} ]]; then`](https://github.com/git/git/blob/7c2ef319c52c4997256f5807564523dfd4acdfc7/contrib/completion/git-completion.bash#L3561)

#### なぜ変数の参照に `-` が含まれるか

> bash は $BASH_VERSION、zsh は $ZSH_VERSION というシェル変数にバージョン文字列が入るため、これで種類の判定ができます。 ちなみに $VAR でなく ${VAR-} としているのは、 set -u (未定義パラメーターの展開をエラーとする) されている場合にも対応するためです。 bash はメジャー、マイナー、マイクロバージョン番号が $BASH_VERINFO に配列で設定されています。zsh は $ZSH_VERSION から切り分ける必要があります。 また、動作モードは bash は $BASH の値、zsh は emulate 組込みコマンドの出力で判定できます。

- [シェルの種類とバージョンの検出 - 拡張 POSIX シェルスクリプト Advent Calendar 2013](https://fumiyas.github.io/2013/12/04/name-ver-mode.sh-advent-calendar.html)

## `git-completion.zsh` の設定をしたがブランチが補完されない

zshの補完設定に反映されていなかった。
