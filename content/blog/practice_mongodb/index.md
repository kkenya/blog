---
title: MongoDBで遊ぶ
date: "2023-04-16T14:04:48+00:00"
status: draft
---

## 環境

- WSL
  - 1.2.0.0
- Ubuntu
  - 22.04.1
- MongoDB
  - 6.0.5
- Mongosh
  - 1.8.0

## WSL(Ubuntu)でMongoDB Community Editionのインストール

GPGキーの追加

```shell
curl -fsSL https://pgp.mongodb.com/server-6.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg \
   --dearmor
```

リポジトリの追加

```shell
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
```

パッケージの更新

```shell
sudo apt-get update
```

MongoDBのインストール

```shell
sudo apt-get install -y mongodb-org
```

systemdでmongodを開始する

```shell
sudo systemctl start mongod
```

デーモンの状態を確認

```shell
sudo systemctl status mongod
```

## 参考

- [Install MongoDB Community Edition on Ubuntu](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/#install-mongodb-community-edition)
