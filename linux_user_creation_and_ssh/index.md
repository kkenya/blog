---
title: linuxでユーザー作成とssh
date: "2018-05-16T16:58:00+09:00"
status: published
---

環境

- サーバー: CentOS7.5.1804
- クライアント: macOS10.13.6

## ユーザーの作成とパスワードの設定

`useradd`コマンドでユーザーを作成[^1]し、`passwd`コマンドでパスワードを設定する。

```shell
useradd test
passwd test
```

ユーザーが追加されていることを確認する。

```shell
cat /etc/passwd
```

## ユーザーに管理者権限を設定する

ユーザーの所属グループにwheelグループを追加することで、ユーザーが`sudo`コマンドで管理者権限を必要とするコマンドを実行可能にする。

- wheelグループとは

  [“応用力”をつけるためのLinux再入門（10](http://www.atmarkit.co.jp/ait/articles/1706/02/news014_2.html)

   >CentOS（バージョン7）では「wheelグループ」に全てのコマンドの実行が許可、つまりrootユーザー相当の権限が与えられています。

`visudo`コマンドで`/etc/sudoers`を編集し、ユーザーが`sudo`コマンドを実行可能にする。

```shell
visudo
```

コメントアウトを外し、wheelグループが全てのコマンドを実行可能する。

```/etc/sudoers
%wheel  ALL=(ALL)  ALL
```
<!--
特定のユーザーに管理者権限を与える場合
```visudo
test All All
``` -->

ユーザーの所属グループにwheelグループを追加する。

```shell
$ gpasswd -a test wheel
Adding user test to group wheel
```

ユーザーがwheelグループに所属していることを確認する。

```shell
$ groups test
test : test wheel
```

<!-- wheelグループに所属しているユーザーを確認する。 -->

<!-- ```shell
getent group wheel
wheel:x:10:test, test2,
``` -->

### suコマンドを使用したログインをwheelグループのユーザーのみ許可する

os全体の認証システムである「PAM(Pluggable Authentication Modules)」を利用し、wheelグループに所属するユーザーのみが`su`コマンドによるrootアカウントへの切り替えを許可する。

[Linuxの各アプリケーションが共通して利用する「PAM認証」について](https://oxynotes.com/?p=4393)

`su`コマンドのPAM設定ファイルである`/etc/pam.d/su`ファイル内のコメントアウトを外し、pam_wheel.so モジュールを有効化する。

```/etc/pam.d/su
# Uncomment the following line to require a user to be in the "wheel" group.
auth           required        pam_wheel.so use_uid
```

## SSHサーバーの設定

openssh-serverはプリインストールされているため、設定ファイルを変更する。

```shell
vim /etc/ssh/sshd_config
```

パスワード認証を許可し、セキュリティを高めるためにrootユーザーでのSSHログインを禁止する。

```/etc/ssh/sshd_config
PermitRootLogin no
PasswordAuthentication yes
```

接続するユーザーを制限する場合

```/etc/ssh/sshd_config
AllowUsers test # 複数指定する場合 AllowUsers ユーザー1 ユーザー2
```

SSHサーバーを再起動し、変更を適用する。

```shell
systemctl restart sshd.service
```

一度パスワード認証でログインを行い、ssh接続が成功することを確認する。

```shell
ssh test@aaa.bbb.ccc.ddd # ユーザー名@IPアドレス
```

接続が失敗する場合はstatusで確認できる。

```shell
systemctl status sshd.service
```

## クライアントでのSSH接続の設定

SSHについてのわかりやすい解説
>[SSHなるものをよくわからずに使っている人のための手引書](https://qiita.com/kenju/items/b09199c4b3e7203a2867)

### 公開鍵と秘密鍵を生成する

任意のパスフレーズを設定し、公開鍵と秘密鍵を生成する。

```shell
$ ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/home/kawatsu/.ssh/id_rsa): # デフォルトのファイル名を生成するためreturn
Enter passphrase (empty for no passphrase): # パスフレーズを指定しない場合はreturn
Enter same passphrase again: # 同上
```

### クライアントからサーバーへ公開鍵をコピーする

生成した公開鍵を`scp`コマンドで安全に接続先のユーザーディレクトリへコピーする。

```shell
scp ~/.ssh/id_rsa.pub test@aaa.bbb.ccc.ddd:~ # ユーザー名@IPアドレス:ディレクトリ
```

### サーバーで公開鍵を設置する

サーバーに作業ユーザーでログインし、公開鍵がクライアントからコピーされているか確認する。

```shell
ssh test@aaa.bbb.ccc.ddd # ユーザー名@IPアドレス
ls | grep id_rsa.pub
```

ディレクトリを作成し、公開鍵を設置する。

```shell
# ディレクトリを作成
$ mkdir ~/.ssh
# ディレクトリの権限をユーザーのみrwxに制限
$ chmod 700 ~/.ssh
# 公開鍵を設置する
$ cat ~/id_rsa.pub >> .ssh/authorized_keys
# ディレクトの権限をユーザーのみrw-に変更
$ chmod 600 ~/.ssh/authorized_keys
# ユーザーディレクトリのコピーした秘密鍵を削除する
$ rm id_rsa.pub
```

### configファイルを設定する

クライアントでのSSHの設定ファイルを追加することでSSH接続の簡単にする。

```shell
vim ~/.ssh/config
```

```~/.ssh/config
Host testServer # 任意の名前
  HostName aaa.bbb.ccc.ddd # IPアドレスまたはFQDN
  User test # ログインするユーザー
  Port 22 # ポート番号
  IdentityFile ~/.ssh/id_rsa # 生成した秘密鍵を指定する
```

設定したHostNameを指定してSSH接続を行う。

```shell
ssh testServer
```

[^1]: -mオプションのマニュアルには「デフォルトでは、ホームディレクトリを作らず、ファイルのコピーもしない。」とあるが`/etc/login.defs`ファイルにデフォルトでCREATE_HOMEがyesになっているため`/home/test`が作成される([参考](https://qiita.com/moroku0519/items/49cec7944104464e5d53))

## 参考

- [SSHなるものをよくわからずに使っている人のための手引書](https://qiita.com/kenju/items/b09199c4b3e7203a2867)
- [ssh公開鍵認証設定まとめ](https://qiita.com/ir-yk/items/af8550fea92b5c5f7fca)
- [CentOS 7.4 でサーバー構築（ユーザー作成～SSH開通編）](https://qiita.com/sigenyan/items/1e52b99fca0320951159)
- [“応用力”をつけるためのLinux再入門（10](http://www.atmarkit.co.jp/ait/articles/1706/02/news014_2.html)
- [Linux(CentOS7)でSSHを利用する。](https://qiita.com/sango/items/816136188387221f05b3)
