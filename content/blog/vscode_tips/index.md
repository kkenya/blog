---
title: "mac tips"
date: "2022-03-13T00:39:23+09:00"
status: draft
---

## mac自体の設定・操作

### ファイル保存時

 `/` を入力するとディレクトリを移動できる
`~` (ホーム)を入力し、 `Tab` で保管しながら目的のディレクトリに移動する
相対的にディレクトリを移動するなら `Cmd + ↑` で親ディレクトリに移動する

### キーボード > ショートカット

デスクトップを表示はvscodeなどで誤爆しやすいため設定を外しておく

`Cmd + Shift + Lで登録しておく`

#### LaunchpadとDock

spotlightでアプリケーションを起動したいが、アプリケーション名を忘れたときにLaunchpadを起動、矢印化で移動してEnterで起動する
Launchpadを表示している状態でもう一度ショートカットを実行すれば閉じる

|Shift + Cmd + L|Launchpadを表示|

#### Mission Control

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

余分な検索結果を取得しないよう `アプリケーション` と `計算機` のみ有効

#### プライバシー

Spotlight実行時の候補を減らすためにホワイトリストで管理する
アプリケーションフォルダにあるものを一旦全てドラッグ&ドロップで追加し、Spotlightで開くものだけを削除する

### 日本語入力

日本語で矢印を入力できる

|command|describe|
|:--|:--|
|zh|←|
|zj|↓|
|zk|↑|
|zl|→|

### その他操作など

仮想デスクトップを利用しないため、操作しているアプリケーションの最大化はウィンドウを制御するアプリケーションを利用する。 仮想デスクトップ( `Cmd + Shift + F` )はデスクトップの位置をしたい的に意識して画面を切り替える( `Cmd + ←→` )必要があるので利用しない
アプリケーションの移動は基本的にSpotlightで行う
2つのアプリケーションを相互に行き来するような場合は `Cmd + Tab` でトグルする。3つ以上のアプリケーションを操作する場合に `Cmd + Tab` は操作順を意識する必要があるので利用しない

## vscode

基本的にvimのプラグインを有効にしてhjklで移動

### sidebar

|command|describe|
|:--|:--|
|Cmd + Shift + E|EXPLORER|
|Cmd + Shift + D|デバッグ画面|
|Cmd + Shift + X|拡張機能|
|Cmd + j|TERMINALの表示・非表示を切り替え|

### terminal

|Ctrl + `|TERMINALの表示・非表示を切り替え|
|Shift + Cmd + U|OUTPUTの表示・非表示を切り替え|

## Markdown

|command|describe|
|:--|:--|
|Ctrl + w + v|previewを開く|

## 拡張機能