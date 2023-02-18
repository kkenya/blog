---
title: macOSのgitアップデートとプロンプト表示について
# created: "2018-12-04T06:42:00.000Z"
date: "2022-12-25T03:18:07.000Z"
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

各ファイルのコメントに導入方法が記述されているが、zshの場合はそれぞれの関係を把握するためにある程度スクリプトの内容を理解する必要があったので残しておく。

### zshでの導入方法

補完を有効にするだけなら `git-completion.bash` 、 `git-completion.zsh` 2つのファイルを利用する。 `git-prompt.sh` はプロンプトへのブランチ表示など独立した機能を提供する。

zshで利用するためには `git-completion.bash` と `git-completion.zsh` ２つのファイルを同じディレクトリに配置する。`git-completion.zsh` はファイル名を変更しても良いが、 `git-completion.bash` は `git-completion.zsh` 内で参照されるためファイル名が一致している必要がある。

自分の環境では `~/.zsh/functions` にダウンロードした。

### git-completion.bash

サブコマンドやブランチ名などを補完するためのシェルスクリプト。

`~/.zsh/functions/git-completion.bash` にファイルをダウンロードする。(bashの場合はこのスクリプトを読み込むが、zshではラッパーを介して利用するためダウンロードのみで良い)

```shell
% wget -O ~/.zsh/functions/git-completion.bash https://raw.githubusercontent.com/git/git/a68dfadae5e95c7f255cf38c9efdcbc2e36d1931/contrib/completion/git-completion.bash
```

### git-completion.zsh

zshでgitの補完を有効にする処理が書かれた `git-completion.bash` のラッパースクリプト。zshの補完システムで利用されるモジュール。

`~/.zsh/functions/_git` にファイルのダウンロードする。

```shell
% wget -O ~/.zsh/functions/_git https://raw.githubusercontent.com/git/git/a68dfadae5e95c7f255cf38c9efdcbc2e36d1931/contrib/completion/git-completion.zsh
```

`~/.zshrc` で `$fpath` にダウンロードしたスクリプトを追加する。

```shell
fpath=(${HOME}/.zsh/functions ${fpath})
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

### git-prompt.sh

環境変数 `PS1` に `__git_ps1` を呼び出すことで、プロンプトにgitリポジトリのステータスを表示可能になる。

スクリプトをダウンロードする。

```shell
% wget -O ~/.git-prompt.sh https://raw.githubusercontent.com/git/git/a68dfadae5e95c7f255cf38c9efdcbc2e36d1931/contrib/completion/git-prompt.sh
```

`~/.zshrc` に読み込み設定する。

```shell
source ~/.git-prompt.sh
```

## トラブルシュート

### ~/.zshrc読み込み時に `this script is obsolete, please see git-completion.zsh` が出力される

zshで `git-completion.bash` を読み込んでいる場合に警告される。

- [`if [[ -n ${ZSH_VERSION-} && -z ${GIT_SOURCING_ZSH_COMPLETION-} ]]; then`](https://github.com/git/git/blob/7c2ef319c52c4997256f5807564523dfd4acdfc7/contrib/completion/git-completion.bash#L3561)

#### なぜ変数の参照に `-` が含まれるか

> bash は $BASH_VERSION、zsh は $ZSH_VERSION というシェル変数にバージョン文字列が入るため、これで種類の判定ができます。 ちなみに $VAR でなく ${VAR-} としているのは、 set -u (未定義パラメーターの展開をエラーとする) されている場合にも対応するためです。 bash はメジャー、マイナー、マイクロバージョン番号が $BASH_VERINFO に配列で設定されています。zsh は $ZSH_VERSION から切り分ける必要があります。 また、動作モードは bash は $BASH の値、zsh は emulate 組込みコマンドの出力で判定できます。

- [シェルの種類とバージョンの検出 - 拡張 POSIX シェルスクリプト Advent Calendar 2013](https://fumiyas.github.io/2013/12/04/name-ver-mode.sh-advent-calendar.html)

## `git-completion.zsh` での `bash-completion.bash` について

`git-completion.zsh` における `bash-completion.bash` を走査する優先順位

- 1. `:completion:*:*:git:*` のコンテキスにおける `script` の値
- 2. `git-completion.zsh` が置かれているディレクトの `git-completion.bash`
- 3. `$HOME/.local/share/bash-completion/completions/git`
- 4. `$bash_completion/git`
- 5. `/etc/bash_completion.d/git`

今回は 2. で読み込まれる様にスクリプトを配置した。2.から6.に一致しないパスに `git-completion.bash` を配置した場合は、`script` スタイルにパスを設定すればいい。

`git-completion.bash` を `~/.git-completion.bash` にダウンロードした場合は下の記述を `.zshrc` に追加する。

```shell
zstyle ':completion:*:*:git:*' script ~/.git-completion.bash
fpath=(${HOME}/.zsh/functions ${fpath})
```

zshの補完システムは `$FPATH` に指定されたディレクトリに含まれるアンダースコア( `_` )で始まる関数を自動的に読み込む。

## 参考

- [git/contrib/completion/](https://github.com/git/git/tree/a68dfadae5e95c7f255cf38c9efdcbc2e36d1931/contrib/completion)
- [zsh.sourceforge.io | 20 Completion System](https://zsh.sourceforge.io/Doc/Release/Completion-System.html)
- [シェルの種類とバージョンの検出 - 拡張 POSIX シェルスクリプト Advent Calendar 2013](https://fumiyas.github.io/2013/12/04/name-ver-mode.sh-advent-calendar.html)
