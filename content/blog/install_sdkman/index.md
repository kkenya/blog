---
title: SDKMAN!でのJavaバージョン管理する
date: "2023-10-07T13:01:27+09:00"
status: published
---

macOSでJavaをバージョン管理する

## 環境

- macOS Monterey
- zsh 5.9 (arm-apple-darwin21.3.0)

## Javaバージョン管理マネージャー

次の2つが有名
SDKMAN!のスター数が多かったため利用した

[sdkman-cli](https://github.com/sdkman/sdkman-cli)|5.6K
[jenv](https://github.com/jenv/jenv)|5.2K

## インストール

[インストール手順](https://sdkman.io/install)に従ってスクリプトを実行

```shell
curl -s "https://get.sdkman.io" | bash
```

実行後、 `$HOME/.zshrc` を検出して末行にスクリプトを追加された

```shell
#THIS MUST BE AT THE END OF THE FILE FOR SDKMAN TO WORK!!!
export SDKMAN_DIR="$HOME/.sdkman"
[[ -s "$HOME/.sdkman/bin/sdkman-init.sh" ]] && source "$HOME/.sdkman/bin/sdkman-init.sh"
```

sdkmanを利用するためターミナルを開き直すか `source "$HOME/.sdkman/bin/sdkman-init.sh"` を実行後、バージョンが出力されることを確認

```shell
$ sdk version
SDKMAN!
script: 5.18.2
native: 0.4.2
```

利用可能なバージョンの確認

```shell
# インストール候補の一覧
sdk list
# 候補ごとのバージョン一覧
sdk list java
```

インストール後、追加したバージョンをデフォルトに設定するか確認されるので適宜選択

```shell
# デフォルトバージョンのインストール
sdk install java
# venderごとのバージョン指定
sdk install java 8.0.382-amzn
```

javaのバージョン確認

```shell
% java -version
openjdk version "1.8.0_382"
OpenJDK Runtime Environment Corretto-8.382.05.1 (build 1.8.0_382-b05)
OpenJDK 64-Bit Server VM Corretto-8.382.05.1 (build 25.382-b05, mixed mode)
```

## 利用してみて

スクリプトで `.zshrc` などの書き込みまで一括でインストールできる点が良い
ただ普段Javaを利用しない身からするとVenderの選択で戸惑った
nvmのようにメジャーバージョンやTLSの指定でインストールできるとなおよかった
