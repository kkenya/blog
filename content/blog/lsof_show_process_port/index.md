---
title: "lsofコマンドでポート番号からプロセスを調べる"
date: "2021-10-15T01:00:00+09:00"
status: published
---

supervisorを利用している際、終了に失敗したプロセスがポートを利用したままになり  `adress already in use` の対処をよく行うのでメモ。ポート番号からプロセスを利用するには `lsof` コマンドを利用する。
`man` コマンドで調べること以上の情報がないが、ポート番号を調べるコマンドが `lsof` だと知らないとマニュアルを見られないというジレンマ。

## 環境

- macOS Catalina version 10.15.7

## よく使うオプション

### ポート番号を指定

`-i:ポート番号` でポートを指定してプロセスを一覧。

```sh
% lsof -i:8080
COMMAND   PID   USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
nginx   88310 user    6u  IPv4 0x454bfe04c236e37d      0t0  TCP *:http-alt (LISTEN)
nginx   88315 user    6u  IPv4 0x454bfe04c236e37d      0t0  TCP *:http-alt (LISTEN)
```

### 複数指定

```sh
lsof -t -i:8080 -i:3000
```

### PIDのみを標準出力

`-t` でheaderなしかつプロセスIDのみを表示する。killにパイプして指定のポート番号を利用しているプロセスを終了する際によく利用する。

```sh
lsof -t -i:8080 | xargs kill
```

