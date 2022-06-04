---
title: CodeBuildのAmazon Linuxでnode16を利用する
date: "2022-06-04T23:30:00+09:00"
status: published
---

## 結論

Amazon LinuxのNodejs12を利用し、ビルドごとにNodejsの16系をインストールする

```yaml
phases:
  install:
    runtime-versions:
      nodejs: 12
    commands:
      - n 16
```

## 経緯

2022/6/9時点でUbuntuとAmazon Linux 2で利用可能なランタイムにnodejs16は含まれないため、 `runtime-versions` で直接指定することはできない

|runtime|nodejs|
|:--|:--|
|Amazon Linux 2|12|
|Ubuntu standard:5.0|14|

ランタイムとしてサポートされていないので、ビルドの実行前にプリインストールされたNodejsのバージョン管理ツールを利用し16系をインストールする

Amazon Linuxでは[n](https://github.com/tj/n)を利用しているので `n 利用したいバージョン` でインストールする([Dockerfile](https://github.com/aws/aws-codebuild-docker-images/blob/282c6634e8c83c2a9841719b09aabfced3461981/al2/x86_64/standard/3.0/Dockerfile#L133)で `n` をインストールしている箇所)

## 参考

- [Available runtimes](https://docs.aws.amazon.com/codebuild/latest/userguide/available-runtimes.html)
- [Docker images provided by CodeBuild](https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-available.html)
- [AWS CodeBuild error: Major version of alias '14.x' is not supported in runtime 'nodejs'](https://stackoverflow.com/questions/70205746/aws-codebuild-error-major-version-of-alias-14-x-is-not-supported-in-runtime)
- [【小ネタ】Codebuild のマネージド型イメージで使用する Node.js のバージョンを厳密に指定する](https://blog.serverworks.co.jp/specific-nodejs-version-in-codebuild)
