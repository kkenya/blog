---
title: シェルスクリプトで複数行のテキストを配列として扱う
date: "2022-05-07T23:47:23+09:00"
status: published
---

## 概要

シェルスクリプトで下記のような複数行のテキストから一行ごとを要素とした配列を作成したい場合について

```txt
Brenda
Garland
Della
Calista
Lyla
Jade
Guillermo
Jada
Claud
Trystan
```

## 環境

```shell
% zsh --version
zsh 5.8 (x86_64-apple-darwin19.3.0)
```

## 1. ファイルを読み込む場合

`name.txt` に複数行のテキストを追加し、別ファイルでシェルスクリプトを記述する

```shell
while read name
do
  echo $name
done < name.txt
```

while文での処理をまとめる

- `read` は引数を指定しない場合、標準入力から `IFS` に定義された文字を区切り文字として一行読み込む
- `name.txt` を標準入力にリダイレクトする
- readは標準入力から読み込んだ改行までの一行を変数 `name` に代入し、ステータスコード0を返す
- whileはreadが成功したため `do while` 内の処理を実行する

この方法はファイルを分割する必要があり、管理が別れるのでシェルスクリプト上に定義したい

## 複数行のテキストを配列に変換する

ヒアドキュメントからの標準入力を配列に変換して `for` でループする

```shell
readonly NAMES=($(cat << EOS
Brenda
Garland
Della
Calista
Lyla
Jade
Guillermo
Jada
Claud
Trystan
EOS
))

for name in ${NAMES[@]}
do
  echo $name
done
```

- Here Documentsから読み込んだ内容は標準入力として `cat` コマンドに渡される
- `cat` で受け取った標準入力を標準出力に出力
- hereドキュメントは標準入力なのでcatの引数に指定
- `$()` で `cat` を実行し配列に格納
