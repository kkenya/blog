---
title: "hadlintでDockerfileのベストプラクティスを適用する"
date: "2022-01-23T13:08:35+09:00"
status: published
---

macOSなら

```shell
brew install hadolint
```

コマンド実行時にDockerfileを指定
例えばDockerfileに以下のような記述があったときに

```Dockerfile
EXPOSE 80000
```

`hadolint Dockerfile` を実行するとport番号に指定する値が有効な範囲内でないことを警告してくれる

```shell
% hadolint Dockerfile
Dockerfile:19 DL3011 error: Valid UNIX ports range from 0 to 65535
```

Visual Studio Codeを利用しているなら[拡張機能](https://marketplace.visualstudio.com/items?itemName=exiasr.hadolint)をインストールすれば毎回コマンドを実行する必要がなくなる

## 参考

- [hadolint/hadolint](https://github.com/hadolint/hadolint)
- [vscode marketplace](https://marketplace.visualstudio.com/items?itemName=exiasr.hadolint)
