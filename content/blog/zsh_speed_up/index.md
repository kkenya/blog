---
title: zshの起動速度を改善した(nvm, compinit)
date: "2023-01-04T18:30:11+09:00"
status: published
---

## 概要

zshの起動に1.5秒ほどかかっており、tmuxのpane立ち上げなどの待ち時間を短縮した。`zsh/zrof` による計測を行いボトルネックになっていた `nvm` , `npm-completion` , `compinit` の読み込みを修正した。

## 環境

- zsh 5.9 (arm-apple-darwin21.3.0)

## ボトルネックの計測

`zsh/zprof` モジュールが読み込まれた時点からシェルの関数呼び出しをプロファイリングし、 `zprof` を呼び出すとプロファイルした結果が一覧で標準出力される。

したがって、zshのコンフィグ最初にモジュールを読み込み最後に `zprof` を呼び出す。

`.zshenv` でモジュールを読み込む。

```shell
# A module allowing profiling for shell functions.
zmodload zsh/zprof
if [ $? = 0 ]; then
 zprof
fi
```

`.zshrc` の行末で `zprof` を実行する。

```shell
type zprof > /dev/null 2>&1
if [ $? = 0 ]; then
  zprof
fi
```

zshを起動し、計測する。

```shell
$ time zsh -i -c exit
num  calls                time                       self            name
-----------------------------------------------------------------------------------
 1)    2         602.07   301.04   76.55%    324.99   162.49   41.32%  nvm
 2)    1         227.17   227.17   28.88%    194.41   194.41   24.72%  nvm_ensure_version_installed
 3)    1         736.58   736.58   93.65%    134.51   134.51   17.10%  nvm_auto
 4)    1          32.76    32.76    4.16%     32.76    32.76    4.16%  nvm_is_version_installed
 5)    1          49.65    49.65    6.31%     31.56    31.56    4.01%  nvm_die_on_prefix
 6)    4          26.30     6.57    3.34%     26.30     6.57    3.34%  compaudit
 7)    2          49.86    24.93    6.34%     23.56    11.78    3.00%  compinit
 8)    2          16.53     8.27    2.10%     16.53     8.27    2.10%  nvm_grep
 9)    4          18.08     4.52    2.30%      1.55     0.39    0.20%  nvm_npmrc_bad_news_bears
10)    1           0.27     0.27    0.03%      0.27     0.27    0.03%  nvm_has
11)    1           0.04     0.04    0.01%      0.04     0.04    0.01%  compdef
12)    1           0.08     0.08    0.01%      0.04     0.04    0.00%  complete
13)    1         736.60   736.60   93.65%      0.02     0.02    0.00%  nvm_process_parameters
14)    1           0.01     0.01    0.00%      0.01     0.01    0.00%  bashcompinit
15)    1           0.00     0.00    0.00%      0.00     0.00    0.00%  nvm_is_zsh
...
real    0m1.443s
user    0m0.353s
sys     0m0.446s
```

起動時間にはばらつきがあるため、ボトルネックの調査ではなく全体の計測は複数回実行する。

```shell
for i in $(seq 1 10); do time zsh -i -c exit; done
```

結果から `nvm` 、 `compaudit` , `compinit` が速度の大半を占めていることがわかる。

### nvm

 `.zshrc` にある `nvm` の初期化を一旦コメントアウトするとシェルの立ち上げが早くなった。
[Zsh の起動時間を短縮する](https://chocoby.com/blog/2021/05/05/speed-up-zsh-startup-time)を参考にnvmの初期化を遅延させる。

`.zshrc` で行っている `nvm` の処理は初期化とディレクトリ移動時に `.nvmrc` を参照してバージョンを切り替える[スクリプト](https://github.com/nvm-sh/nvm#zsh)の2つ。

初期化処理を関数にまとめる。

```shell
load-nvm() {
  # nvmが利用できなければ初期化する
  if ! type nvm &>/dev/null; then
    export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
  fi
}
```

ディレクトリ移動時に実行されるコマンドで `load-nvm` を呼び出す。また、スクリプトでは関数をzshのフック登録後に実行しているが起動時にボトルネックになるので呼び出さない。

```git
diff --git a/.zsh/path.zsh b/.zsh/path.zsh
index 8425cd8..0fc5798 100644
--- a/.zsh/path.zsh
+++ b/.zsh/path.zsh
@@ -28,6 +28,8 @@ load-nvm() {
+  load-nvm
   local nvmrc_path="$(nvm_find_nvmrc)"
 
   if [ -n "$nvmrc_path" ]; then
@@ -44,4 +46,5 @@ load-nvmrc() {
   fi
 }
 add-zsh-hook chpwd load-nvmrc
-load-nvmrc
```

tmuxのpaneやwindowを立ち上げるなどして、シェルを初期化したディレクトリでは `nvm` を利用できないがディレクトリを移動するか `load-nvm` を呼び出せば良い。

`nvm` 関連の処理で1秒近くかかっていたので大きく短縮できた。

```shell
% time zsh -i -c exit   
num  calls                time                       self            name
-----------------------------------------------------------------------------------
 1)    2          13.81     6.91   59.99%     13.81     6.91   59.99%  compaudit
 2)    1          22.89    22.89   99.41%      9.08     9.08   39.42%  compinit
 3)    1           0.14     0.14    0.59%      0.14     0.14    0.59%  add-zsh-hook

-----------------------------------------------------------------------------------

 2)    1          22.89    22.89   99.41%      9.08     9.08   39.42%  compinit
       1/2        13.81    13.81   59.99%      0.15     0.15             compaudit [1]

-----------------------------------------------------------------------------------

       1/2        13.81    13.81   59.99%      0.15     0.15             compinit [2]
       1/2        13.66    13.66   59.33%     13.66    13.66             compaudit [1]
 1)    2          13.81     6.91   59.99%     13.81     6.91   59.99%  compaudit
       1/2        13.66    13.66   59.33%     13.66    13.66             compaudit [1]

-----------------------------------------------------------------------------------

 3)    1           0.14     0.14    0.59%      0.14     0.14    0.59%  add-zsh-hook
zsh -i -c exit  0.18s user 0.05s system 91% cpu 0.256 total
```

### npm

[pyenvの初期化を遅延呼び出しする](https://scrapbox.io/r-hanafusa/zsh%2Fprezto_%E9%AB%98%E9%80%9F%E5%8C%96%E3%83%A1%E3%83%A2)を参考に、`npm` コマンド実行時に一度だけ補完スクリプトを読み込むように修正した。

```shell
npm() {
  unset -f npm
  load-npm-completion
  npm $@
}
```

`npm` の補完を利用するためにはコマンドを一度実行する必要があるが、zsh初期化時に補完スクリプトを呼び出さないことで0.1秒ほど高速化した。

対応前

```shell
% for i in $(seq 1 10); do time zsh -i -c exit > /dev/null ; done
zsh -i -c exit > /dev/null  0.18s user 0.05s system 87% cpu 0.265 total
zsh -i -c exit > /dev/null  0.17s user 0.05s system 95% cpu 0.225 total
zsh -i -c exit > /dev/null  0.16s user 0.05s system 84% cpu 0.249 total
zsh -i -c exit > /dev/null  0.16s user 0.04s system 81% cpu 0.256 total
zsh -i -c exit > /dev/null  0.16s user 0.05s system 83% cpu 0.250 total
zsh -i -c exit > /dev/null  0.17s user 0.05s system 81% cpu 0.261 total
zsh -i -c exit > /dev/null  0.16s user 0.04s system 78% cpu 0.265 total
zsh -i -c exit > /dev/null  0.16s user 0.04s system 84% cpu 0.248 total
zsh -i -c exit > /dev/null  0.16s user 0.05s system 81% cpu 0.257 total
zsh -i -c exit > /dev/null  0.17s user 0.05s system 80% cpu 0.261 total
```

対応後

```shell
% for i in $(seq 1 10); do time zsh -i -c exit > /dev/null ; done
zsh -i -c exit > /dev/null  0.03s user 0.02s system 43% cpu 0.126 total
zsh -i -c exit > /dev/null  0.03s user 0.02s system 43% cpu 0.108 total
zsh -i -c exit > /dev/null  0.02s user 0.02s system 41% cpu 0.102 total
zsh -i -c exit > /dev/null  0.02s user 0.02s system 44% cpu 0.089 total
zsh -i -c exit > /dev/null  0.02s user 0.02s system 43% cpu 0.093 total
zsh -i -c exit > /dev/null  0.02s user 0.02s system 46% cpu 0.088 total
zsh -i -c exit > /dev/null  0.02s user 0.02s system 46% cpu 0.089 total
zsh -i -c exit > /dev/null  0.02s user 0.02s system 45% cpu 0.089 total
zsh -i -c exit > /dev/null  0.02s user 0.02s system 44% cpu 0.092 total
zsh -i -c exit > /dev/null  0.02s user 0.02s system 43% cpu 0.095 total
```

### compaudit

補完システムに必要なディレクトリで危険なファイルが含まれないか所有権の確認などのセキュリティチェックを行う。シェルから実行可能だが、 `compinit` 実行時に呼び出される。 `compinit` に `-C` オプションが指定され、ダンプファイルが存在していればセキュリティチェックはスキップされる。

>For security reasons compinit also checks if the completion system would use files not owned by root or by the current user, or files in directories that are world- or group-writable or that are not owned by root or by the current user. If such files or directories are found, compinit will ask if the completion system should really be used. To avoid these tests and make all files found be used without asking, use the option -u, and to make compinit silently ignore all insecure files and directories use the option -i. This security check is skipped entirely when the -C option is given, provided the dumpfile exists.

### compdump

compinitは読み込んだ設定のダンプを　`.compdump` に出力し、次回以降の `compinit` の実行を高速化する。

### compinit

`compinit` を呼び出すことで補完システムをセットアップする。 `compinit` 実行時に呼び出される `compaudit` の処理時間が次のボトルネックとなったため対応した。対応としては `compinit` 実行時に出力されるダンプファイル `.zcompdump` の作成から一定時間経過していなければ `compaudit` をスキップする。

対応は[ctechols/compinit.zsh](https://gist.github.com/ctechols/ca1035271ad134841284)を参考にした。

```shell
local now=$(date +"%s")
local updated=$(date -r ~/.zcompdump +"%s")
local threshold=$((60 * 60 * 24))
if [ $((${now} - ${updated})) -gt ${threshold} ]; then
  compinit
else
  # if there are new functions can be omitted by giving the option -C.
  compinit -C
fi
```

```shell
% time zsh -i -c exit
num  calls                time                       self            name
-----------------------------------------------------------------------------------
 1)    1          11.65    11.65   98.12%     11.65    11.65   98.12%  compinit
 2)    1           0.22     0.22    1.88%      0.22     0.22    1.88%  add-zsh-hook

-----------------------------------------------------------------------------------

 1)    1          11.65    11.65   98.12%     11.65    11.65   98.12%  compinit

-----------------------------------------------------------------------------------

 2)    1           0.22     0.22    1.88%      0.22     0.22    1.88%  add-zsh-hook
zsh -i -c exit  0.03s user 0.03s system 45% cpu 0.142 total
```

## 効果がなかった対応

### ファイル分割を止める

pathやエイリアスの設定ごとの分割していたファイルを `.zshrc` のみに統一したが、効果はなかった。

ファイル分割している場合

```shell
% for i in $(seq 1 10); do time zsh -i -c exit > /dev/null ; done
zsh -i -c exit > /dev/null  0.17s user 0.04s system 89% cpu 0.245 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 87% cpu 0.240 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 86% cpu 0.246 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 88% cpu 0.241 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 95% cpu 0.221 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 86% cpu 0.246 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 88% cpu 0.244 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 89% cpu 0.243 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 92% cpu 0.232 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 88% cpu 0.238 total
```

`.zshrc` に統一した場合

```shell
% for i in $(seq 1 10); do time zsh -i -c exit > /dev/null ; done
zsh -i -c exit > /dev/null  0.18s user 0.05s system 86% cpu 0.255 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 77% cpu 0.271 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 88% cpu 0.240 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 89% cpu 0.236 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 90% cpu 0.229 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 90% cpu 0.232 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 83% cpu 0.252 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 86% cpu 0.247 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 83% cpu 0.253 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 87% cpu 0.242 total
```

### brew --prefixを呼び出さない

[Naoto Ishizawa/zshの起動を高速化した](https://note.youyo.io/post/speed-up-zsh-startup/)を参考に `brew --prefix` を呼び出さず直接パスを記述した。ある程度効果はあったが `brew --prefix` の呼び出しがそもそも少なく、パスの直書きがあまり好ましくなかったので今回は採用しなかった。

`brew --prefix` あり

```shell
% for i in $(seq 1 10); do time zsh -i -c exit > /dev/null ; done
zsh -i -c exit > /dev/null  0.18s user 0.05s system 96% cpu 0.235 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 97% cpu 0.208 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 97% cpu 0.208 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 96% cpu 0.210 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 97% cpu 0.209 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 95% cpu 0.216 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 97% cpu 0.211 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 97% cpu 0.208 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 97% cpu 0.209 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 96% cpu 0.210 total
```

`brew --prefix` なし

```shell
% for i in $(seq 1 10); do time zsh -i -c exit > /dev/null ; done
zsh -i -c exit > /dev/null  0.17s user 0.04s system 97% cpu 0.217 total
zsh -i -c exit > /dev/null  0.16s user 0.04s system 96% cpu 0.209 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 96% cpu 0.210 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 94% cpu 0.217 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 96% cpu 0.212 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 97% cpu 0.209 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 95% cpu 0.214 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 98% cpu 0.210 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 98% cpu 0.208 total
zsh -i -c exit > /dev/null  0.17s user 0.04s system 100% cpu 0.204 total
```

## zshメモ

### 組み込みモジュール

zshでは組み込みのモジュールを選択して読み込むことで、いくつかの機能を利用できる。(zshは `$module_path` に配置されるバイナリをファイル名で検索する。)

```shell
% echo $module_path
/usr/lib/zsh/5.8.1
```

### zshコマンドの引数

`man zsh` にある以上の情報はない。

|引数|説明|
|:--|:--|
|-c|第一引数に渡されたコマンドを実行する。 `-c exit` で正常終了することにより `time` コマンドで計測できる
|-i|強制的にシェルをインタラクティブにする。 `-c exit` と併用することでシェルがファイルを読み込んだ後に正常終了させる|

## 参考

- zsh
  - [17 Shell Builtin Commands](https://zsh.sourceforge.io/Doc/Release/Shell-Builtin-Commands.html#Shell-Builtin-Commands)
  - [22.35 The zsh/zprof Module](https://zsh.sourceforge.io/Doc/Release/Zsh-Modules.html#The-zsh_002fzprof-Module)
  - [5.1 Startup/Shutdown Files](https://zsh.sourceforge.io/Doc/Release/Files.html#Startup_002fShutdown-Files)
  - [17 Shell Builtin Commands](https://zsh.sourceforge.io/Doc/Release/Shell-Builtin-Commands.html)
  - [16.2 Description of Options](https://zsh.sourceforge.io/Doc/Release/Options.html#Description-of-Options)
  - [zsh/Completion/compaudit](https://github.com/zsh-users/zsh/blob/master/Completion/compaudit)
- [Profiling zsh startup time](https://stevenvanbael.com/profiling-zsh-startup)
- [Zsh の起動時間を短縮する](https://chocoby.com/blog/2021/05/05/speed-up-zsh-startup-time)
- [Naoto Ishizawa/zshの起動を高速化した](https://note.youyo.io/post/speed-up-zsh-startup/)
- [ctechols/compinit.zsh](https://gist.github.com/ctechols/ca1035271ad134841284)
