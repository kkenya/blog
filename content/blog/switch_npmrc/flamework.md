## フレームワークのインストール

APIには `express` を利用する。

```shell
npm i express
npm i -save-dev @types/express
```

エントリーポイントに `app.ts` を追加

```ts
import express, { Request, Response } from "express";
const app = express();
const port = 3000;

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
```

サーバーを起動し、確認

```shell
npm run dev
```

curlでレスポンスを確認

```shell
% curl localhost:3000
Hello World!
```

## Docker化

<!-- todo: 
multi stage build
docker compose v2 -->

health check

```dockerfile
```

npm ci
package-lockから依存モジュールをインストールする
NODE_NEVによってdevDependenciesをインストールする係る
[npm-ci](https://docs.npmjs.com/cli/v8/commands/npm-ci)

include=devでdevDependenciesを含める

build: `target` でmutistagebuildのstageを指定する
volume: ソースコードをマウントする
comand: Dockerfileの `command` を上書きする
depends_on: mongodbの立ち上げ後apiのコンテナを起動する。databaseへのfixtures投入などを待機する場合は[スクリプト](https://docs.docker.com/compose/startup-order/)を用意して対応する

```docker-compose
```

- [docker compose file reference](https://docs.docker.com/compose/compose-file/compose-file-v3/)

npm scriptを追加

```js
    "build": "tsc",
```

## testの追加

テストライブラリにjest, mockにsinonを利用

### jest

jestと型定義のインストールとconfigファイルの生成

```sh
npm install --save-dev jest @types/jest ts-jest
npx ts-jest config:init
```

```sh
mkdir __tests__
```

### sinon

sinonと型定義のインストール

```sh
npm install --save-dev sinon @types/sinon
```
