---
title: GitHubへのsshを設定する
date: "2022-12-03T01:07:42+09:00"
status: published
---

GitHubへのSSH接続のためキーペアの生成から登録を行う。
基本的にはGitHubの[ドキュメント](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)に従う。

## 環境

- macOS Monterey 12.6
- zsh 5.9 (arm-apple-darwin21.3.0)

## 秘密鍵、公開鍵のキーペアを生成

生成は暗号強度の高い `ed25519` を利用する。ファイル名とパスフレーズの入力を対話的に求められる。ファイル名、パスフレーズを次の値で設定。接続ごとにパスフレーズの入力が不要になる対応は後述する。

|項目|値|補足|
|:--|:--|:--|
|file path|~/.ssh/id_ed25519_github|他のキーペアと区別をしやすいように指定|
|passphrase|予測されにくいもの|PC乗っ取りなどで秘密鍵が取得された時に別のセキュリティ層を設けるため設定|

```shell
ssh-keygen -t ed25519 -C "foo@example.test"
```

## 公開鍵の登録

生成された公開鍵をGitHubに登録する。

```shell
# macOS
pbcopy < ~/.ssh/id_ed25519_github.pub
# wsl
clip.exe < ~/.ssh/id_ed25519.github.pub
```

GitHubの[Settings](https://github.com/settings/profile)で「SSH and GPG keys」を選択し公開鍵を貼り付けて保存。

sshコマンドに `-i` オプションで秘密鍵を指定して正しく公開鍵を設定できているか確認する。 このとき生成時に設定したパスフレーズを入力する。

```shell
% ssh -T git@github.com -i ~/.ssh/id_ed25519_github
Enter passphrase for key '~/.ssh/id_ed25519_github':
Hi kkenya! You've successfully authenticated, but GitHub does not provide shell access.
```

## パスフレーズの保存

sshエージェントにパスフレーズを保存し、SSH接続事の入力を不要にする。

ssh-agentを起動する。

```shell
eval "$(ssh-agent -s)"
```

sshごとにパスフレーズの入力が必要ないようkeychainに保存する。

```shell
ssh-add --apple-use-keychain ~/.ssh/id_ed25519_github
$ eval "$(ssh-agent -s)"
Agent pid 262448
# パスフレーズの入力を求められる
$ ssh-add ~/.ssh/id_ed25519.github
Enter passphrase for /home/kkenya/.ssh/id_ed25519.github:
Identity added: /home/username/.ssh/id_ed25519.github (user@example.test)
```

パスフレーズを正しく入力できていればテストに成功する。

```shell
$ ssh -T git@github.com
Hi kkenya! You've successfully authenticated, but GitHub does not provide shell access.
```

## 参考

- [GitHub | Connect with SSH](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
