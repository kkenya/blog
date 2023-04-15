---
title: 
date: "2022-01-01T00:00:00+09:00"
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

PowerShell で実行

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
