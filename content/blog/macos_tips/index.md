---
title: mac操作効率化のためにしていること
date: "2022-03-13T00:39:23+09:00"
status: published
---

mac操作の設定をまとめてみた。

## macの設定・操作

### キーボード > ショートカット

#### LaunchpadとDock

`Cmd + Shift + Lで登録しておく`

spotlightでアプリケーションを起動したいが、アプリケーション名を忘れたときにLaunchpadを起動、`←↑↓→` で移動、`Cmd + ←→` でページ移動を行い `Enter` で起動する
Launchpadを表示している状態でもう一度ショートカットを実行すれば閉じる

|Shift + Cmd + L|Launchpadを表示|

#### Mission Control

デスクトップを表示はvscodeなどで誤爆しやすいため設定を外しておく

|command|describe|
|:--|:--|
|`^⌘←`|通知センターを表示|

#### キーボード

vscodeなど一つのアプリケーションで複数のウィンドウを開いている際に活用

|command|describe|
|:--|:--|
|`Option + Tab`|次のウィンドウを操作対象にする|

### 入力ソース

日本語のみ有効にして `Ctrl + Space` で英数と日本語をトグルできるように

### Spotlight

#### 検索結果

アプリケーションの切り替えと簡単な計算にしか利用しないので `アプリケーション` と `計算機` を除いて無効にする。

#### プライバシー

Spotlight実行時の候補を減らすためにホワイトリストで管理する
アプリケーションフォルダにあるものを一旦全てドラッグ&ドロップで追加し、Spotlightで開くものだけを削除する

### ファイル保存時

 `/` を入力するとディレクトリを移動できる
`~` (ホーム)を入力し、 `Tab` で保管しながら目的のディレクトリに移動する
相対的にディレクトリを移動するなら `Cmd + ↑` で親ディレクトリに移動する

### 日本語入力
  
日本語で矢印を入力できる

|command|describe|
|:--|:--|
|zh|←|
|zj|↓|
|zk|↑|
|zl|→|

### その他操作など

アプリケーションの移動は基本的にSpotlightで行う
仮想デスクトップを利用しないため、操作しているアプリケーションの最大化はウィンドウを制御するアプリケーションを利用する。 仮想デスクトップ( `Cmd + Shift + F` )はアプリケーションの操作順番を相対的に意識して画面を切り替える必要があるので利用しない
ウィンドウのサイズ変更にはmagnetを利用
`Ctrl + Option + Enter` で最大化 `Ctrl + Option + ←↓↑→` で上下左右2分割できる

2つのアプリケーションを相互に行き来するような場合は `Cmd + Tab` でトグルする
3つ以上のアプリケーションを操作する場合に `Cmd + Tab` は操作順を意識する必要があるので利用しない

## Google Chrome

[ショートカット一覧](https://support.google.com/chrome/answer/157179?hl=en&co=GENIE.Platform%3DDesktop#zippy=%2Ctab-window-shortcuts%2Cgoogle-chrome-feature-shortcuts%2Caddress-bar-shortcuts%2Cwebpage-shortcuts%2Cmouse-shortcuts)にないのでメモ

|command|describe|
|:--|:--|
|command + option + ↓ or command + option + ↑|アドレスバーへのフォーカス、フォーカスの解除をトグルできる|
