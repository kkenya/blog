---
title: mermaidコードリーディング
date: "2022-05-27T13:27:33+09:00"
status: draft
---

cp -r template mermaid_code_reading

## installするパターン

index.html作成

パッケージ初期化
npm init -y

npm i mermaid

[ドキュメント](https://mermaid-js.github.io/mermaid/#/n00b-gettingStarted?id=working-examples)に沿ってnode_modulesにあるmermaidを読み込み

## デバッグ手順

mermaidをclone
パッケージをインストール後、npm-scriptsを確認

webpackのdevサーバーを起動

```shell
npm run dev
```

webpackの設定ファイルからポートを確認する

`webpack.config.e2e.babel.js`

```js
  devServer: {
    compress: true,
    port: 9000,
    static: [
      { directory: resolveRoot('cypress', 'platform') },
      { directory: resolveRoot('dist') },
      { directory: resolveRoot('demos') },
    ],
  },
```

vscodeでchromeのデバッグ設定を行う
ブラウザでのデバッグは[ドキュメント](https://code.visualstudio.com/docs/nodejs/browser-debugging)を参照

`launch.json` を作成

`request` は `launch` を指定し、デバッグを開始するとGoogle Chromeが新しいウィンドで開かれる
`attach` は既に実行しているアプリケーションにattachするが、アプリケーション実行時にデバッグ用のポートを明示的に指定してブラウザを起動している必要がある

```json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "pwa-chrome",
            "request": "launch",
            "name": "Launch to Chrome",
            // "port": 9000
            "url": "http://localhost:9000"
        }
    ]
}
```

デバッガを起動すると、 `localhost:9000`  でGoogle Chromeの新しいウィンドウを開く
`demos/index.html` が表示される
スクリプト読み込み時に呼び出される init 関数にブレイクポイントを設定してリロードし、処理が停止することを確認

### 補足

途中のシーケンス図がsyntax errorになっており、後続の図が表示できていなかった
一旦削除して対応

```mermaid
  <div class="mermaid">
    sequenceDiagram
    accDescription Hello friends
    participant Alice
    participant Bob
    participant John as John<br />Second Line
    rect rgb(200, 220, 100)
    rect rgb(200, 255, 200)
    Alice ->> Bob: Hello Bob, how are you?
    Bob-->>John: How about you John?
    end
    Bob--x Alice: I am good thanks!
    Bob-x John: I am good thanks!
    Note right of John: John thinks a long<br />long time, so long<br />that the text does<br />not fit on a row.
    Bob-->Alice: Checking with John...
    Note over John:wrap: John looks like he's still thinking, so Bob prods him a bit.
    Bob-x John: Hey John - we're still waiting to know<br />how you're doing
    Note over John:nowrap: John's trying hard not to break his train of thought.
    Bob-x John:wrap: John! Are you still debating about how you're doing? How long does it take??
    Note over John: After a few more moments, John<br />finally snaps out of it.
    end
    alt either this
    Alice->>John: Yes
    else or this
    Alice->>John: No
    else or this will happen
    Alice->John: Maybe
    end
    par this happens in parallel
    Alice -->> Bob: Parallel message 1
    and
    Alice -->> John: Parallel message 2
    end
  </div>
```

## コードリーディング

[diagramの追加手順](https://github.com/mermaid-js/mermaid/blob/develop/docs/newDiagram.md)から逆算していくと処理が追いやすい

レンダー, 要素ごとの変換, jisonでのパース

parserとは?
diagramごとにparserが定義される
parserは `parse` メソッドと `yy` オブジェクトをプロパティにもつ

`sequence/sequenceRender.js` でオブジェクトを代入
`sequence/sequenceDb.js` ではmermaidのテキストを変換し、actor, message, noteなどの情報を管理するsetter, getterを提供し、結果をインメモリで保持する

```js
import sequenceDb from './sequenceDb';
// ...
parser.yy = sequenceDb;
```

jisonをimportしている

```js
import { parser } from './parser/sequenceDiagram';
```

## jison

