---
title: WSL環境構築
date: "2023-04-15T12:00:00+09:00"
status: draft
---

winget の利用

## winget とは

Microsoft の提供するパッケージマネージャー

https://learn.microsoft.com/ja-jp/windows/package-manager/

## vscode

winget search vscode
winget install vscode

GitHub アカウントで設定同期

## wsl

PowerShellで実行する。

```shell
wsl --install
```

インストール後、案内に従いコンピューターを再起動する

ubuntu を選択し、実行するとユーザー名とパスワードを設定する

- [WSL 開発環境を設定する](https://learn.microsoft.com/ja-jp/windows/wsl/setup/environment)

バージョン確認

```shell
PS C:\Users\3980n> wsl --list --verbose
  NAME      STATE           VERSION
* Ubuntu    Stopped         0
```

## エディタの変更

gitのコミット時などに標準で選択されるエディタを `nano` から `vim	` に変更する

```shell
# 環境変数VISUAL,EDIOTRが設定されていなければ利用される
kkenya@wht:~/github.com/kkenya/blog$ ll /usr/bin/editor
lrwxrwxrwx 1 root root 24 Jan  4 06:40 /usr/bin/editor -> /etc/alternatives/editor*
# 標準で利用するコマンドのシンボリックリンクが置かれている
kkenya@wht:~/github.com/kkenya/blog$ ll /etc/alternatives/editor
lrwxrwxrwx 1 root root 9 Jan  4 06:41 /etc/alternatives/editor -> /bin/nano*
# 対話的に標準のエディタを設定
kkenya@wht:~/github.com/kkenya/blog$ sudo update-alternatives --config editor
[sudo] password for kkenya:
There are 4 choices for the alternative editor (providing /usr/bin/editor).

  Selection    Path                Priority   Status
------------------------------------------------------------
* 0            /bin/nano            40        auto mode
  1            /bin/ed             -100       manual mode
  2            /bin/nano            40        manual mode
  3            /usr/bin/vim.basic   30        manual mode
  4            /usr/bin/vim.tiny    15        manual mode

Press <enter> to keep the current choice[*], or type selection number: 3
update-alternatives: using /usr/bin/vim.basic to provide /usr/bin/editor (editor) in manual mode
kkenya@wht:~/github.com/kkenya/blog$ ll /etc/alternatives/editor
lrwxrwxrwx 1 root root 18 Apr 16 14:49 /etc/alternatives/editor -> /usr/bin/vim.basic*
```

## gitブランチ表示

## nvm

[nvm](https://github.com/nvm-sh/nvm)のREADMEに従ってインストール
スクリプトを実行して `~/.bashrc` にスニペットが書き込まれていることを確認する。

```shell
# 最新のLTSをインストール
nvm install --lts
# バージョン確認
node -v
```
