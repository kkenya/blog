---
title: macOSでbashの補完を有効にする
date: "2018-12-03T10:06:00+09:00"
status: published
---

sshやlsなどの標準コマンドの保管を有効にする
macOSではbash-completionがインストール済みであることを確認する

```shell
brew search bash_completion
```

`info`でリポジトリを確認しインストールする。この時点で導入方法が書かれてあるので、`~/.bash_profile`にスクリプトを追加する。

```shell
$ brew info bash-completion
bash-completion: stable 1.3 (bottled)
Programmable completion for Bash 3.2
https://salsa.debian.org/debian/bash-completion
Conflicts with:
  bash-completion@2 (because Differing version of same formula)
Not installed
From: https://github.com/Homebrew/homebrew-core/blob/master/Formula/bash-completion.rb
==> Caveats
Add the following line to your ~/.bash_profile:
  [[ -r "/usr/local/etc/profile.d/bash_completion.sh" ]] && . "/usr/local/etc/profile.d/bash_completion.sh"
==> Analytics
install: 17,015 (30 days), 46,946 (90 days), 192,714 (365 days)
install_on_request: 15,668 (30 days), 43,207 (90 days), 173,906 (365 days)
build_error: 0 (30 days)

$ brew install bash-completion
Updating Homebrew...
==> Downloading https://homebrew.bintray.com/bottles/bash-completion-1.3_3.high_sierra.bottle.tar.gz
######################################################################## 100.0%
==> Pouring bash-completion-1.3_3.high_sierra.bottle.tar.gz
==> Caveats
Add the following line to your ~/.bash_profile:
  [[ -r "/usr/local/etc/profile.d/bash_completion.sh" ]] && . "/usr/local/etc/profile.d/bash_completion.sh"

Bash completion has been installed to:
  /usr/local/etc/bash_completion.d
==> Summary
🍺  /usr/local/Cellar/bash-completion/1.3_3: 189 files, 608.2KB
==> `brew cleanup` has not been run in 30 days, running now...
```

#### 追加するスクリプト

シェル起動時に `.bash_profile` でbash_completionを実行するように追記

```shell
[ -f /usr/local/etc/bash_completion ] && . /usr/local/etc/bash_completion
```

## bash補完

`.inputrc`を作成することでコマンドラインの入出力を設定できる。

[Readline Init File Syntax](https://www.gnu.org/software/bash/manual/bashref.html#Readline-Init-File-Syntax)

```shell
# 補完時に大文字小文字を区別しない
set completion-ignore-case on
# ファイル種類を色分けする
set colored-stats on
```
