---
title: typescriptプロジェクトの立ち上げ
date: "2021-01-01T00:00:00+09:00"
status: draft
---

node16でtypescriptのプロジェクト作成手順を忘れるのでメモ

## リポジトリ初期化

```shell
git init .
echo node_modules > .gitignore
```

npmの初期化とtypescript, ts-nodeのインストール

```shell
npm init -y
npm i -D typescript ts-node @types/node
npx tsc --init
```

## tsconfig

[TypeScript/wiki/Node-Target-Mapping](https://github.com/microsoft/TypeScript/wiki/Node-Target-Mapping)から今回利用するnode16に対応する値に`compilerOptions` を変更する。
`target` はTypeScriptをトランスパイルした結果出力されるJavaScriptのバージョンを定義する。 `lib` を指定することでbuilt-inされるAPIの型定義が変更する。TypeScriptの型を十分に活用するために `noImplicit` 系統を設定。

トランスパイル結果の出力先を `dist` に設定

- [target](https://www.typescriptlang.org/tsconfig#target)
- [lib](https://www.typescriptlang.org/tsconfig#lib)
- [outDir](https://www.typescriptlang.org/tsconfig)

```git
diff --git a/tsconfig.json b/tsconfig.json
index 5679481..0c1f40c 100644
--- a/tsconfig.json
+++ b/tsconfig.json
@@ -11,8 +11,8 @@
     // "disableReferencedProjectLoad": true,             /* Reduce the number of projects loaded automatically by TypeScript. */

     /* Language and Environment */
-    "target": "es2016",                                  /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */
-    // "lib": [],                                        /* Specify a set of bundled library declaration files that describe the target runtime environment. */
+    "target": "es2021",                                  /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */
+    "lib": ["es2021"],                                        /* Specify a set of bundled library declaration files that describe the target runtime environment. */
     // "jsx": "preserve",                                /* Specify what JSX code is generated. */
     // "experimentalDecorators": true,                   /* Enable experimental support for TC39 stage 2 draft decorators. */
     // "emitDecoratorMetadata": true,                    /* Emit design-type metadata for decorated declarations in source files. */
@@ -47,7 +47,7 @@
     // "emitDeclarationOnly": true,                      /* Only output d.ts files and not JavaScript files. */
     // "sourceMap": true,                                /* Create source map files for emitted JavaScript files. */
     // "outFile": "./",                                  /* Specify a file that bundles all outputs into one JavaScript file. If `declaration` is true, also designates a file that bundles all .d.ts output. */
-    // "outDir": "./",                                   /* Specify an output folder for all emitted files. */
+    "outDir": "./dist",                                   /* Specify an output folder for all emitted files. */
     // "removeComments": true,                           /* Disable emitting comments. */
     // "noEmit": true,                                   /* Disable emitting files from a compilation. */
     // "importHelpers": true,                            /* Allow importing helper functions from tslib once per project, instead of including them per-file. */
@@ -75,22 +75,22 @@

     /* Type Checking */
     "strict": true,                                      /* Enable all strict type-checking options. */
-    // "noImplicitAny": true,                            /* Enable error reporting for expressions and declarations with an implied `any` type.. */
-    // "strictNullChecks": true,                         /* When type checking, take into account `null` and `undefined`. */
-    // "strictFunctionTypes": true,                      /* When assigning functions, check to ensure parameters and the return values are subtype-compatible. */
-    // "strictBindCallApply": true,                      /* Check that the arguments for `bind`, `call`, and `apply` methods match the original function. */
-    // "strictPropertyInitialization": true,             /* Check for class properties that are declared but not set in the constructor. */
-    // "noImplicitThis": true,                           /* Enable error reporting when `this` is given the type `any`. */
-    // "useUnknownInCatchVariables": true,               /* Type catch clause variables as 'unknown' instead of 'any'. */
-    // "alwaysStrict": true,                             /* Ensure 'use strict' is always emitted. */
-    // "noUnusedLocals": true,                           /* Enable error reporting when a local variables aren't read. */
-    // "noUnusedParameters": true,                       /* Raise an error when a function parameter isn't read */
-    // "exactOptionalPropertyTypes": true,               /* Interpret optional property types as written, rather than adding 'undefined'. */
-    // "noImplicitReturns": true,                        /* Enable error reporting for codepaths that do not explicitly return in a function. */
-    // "noFallthroughCasesInSwitch": true,               /* Enable error reporting for fallthrough cases in switch statements. */
-    // "noUncheckedIndexedAccess": true,                 /* Include 'undefined' in index signature results */
-    // "noImplicitOverride": true,                       /* Ensure overriding members in derived classes are marked with an override modifier. */
-    // "noPropertyAccessFromIndexSignature": true,       /* Enforces using indexed accessors for keys declared using an indexed type */
+    "noImplicitAny": true,                            /* Enable error reporting for expressions and declarations with an implied `any` type.. */
+    "strictNullChecks": true,                         /* When type checking, take into account `null` and `undefined`. */
+    "strictFunctionTypes": true,                      /* When assigning functions, check to ensure parameters and the return values are subtype-compatible. */
+    "strictBindCallApply": true,                      /* Check that the arguments for `bind`, `call`, and `apply` methods match the original function. */
+    "strictPropertyInitialization": true,             /* Check for class properties that are declared but not set in the constructor. */
+    "noImplicitThis": true,                           /* Enable error reporting when `this` is given the type `any`. */
+    "useUnknownInCatchVariables": true,               /* Type catch clause variables as 'unknown' instead of 'any'. */
+    "alwaysStrict": true,                             /* Ensure 'use strict' is always emitted. */
+    "noUnusedLocals": true,                           /* Enable error reporting when a local variables aren't read. */
+    "noUnusedParameters": true,                       /* Raise an error when a function parameter isn't read */
+    "exactOptionalPropertyTypes": true,               /* Interpret optional property types as written, rather than adding 'undefined'. */
+    "noImplicitReturns": true,                        /* Enable error reporting for codepaths that do not explicitly return in a function. */
+    "noFallthroughCasesInSwitch": true,               /* Enable error reporting for fallthrough cases in switch statements. */
+    "noUncheckedIndexedAccess": true,                 /* Include 'undefined' in index signature results */
+    "noImplicitOverride": true,                       /* Ensure overriding members in derived classes are marked with an override modifier. */
+    "noPropertyAccessFromIndexSignature": true,       /* Enforces using indexed accessors for keys declared using an indexed type */
     // "allowUnusedLabels": true,                        /* Disable error reporting for unused labels. */
     // "allowUnreachableCode": true,                     /* Disable error reporting for unreachable code. */
```

.gitignoreにdist追加

```shell
echo dist >> .gitignore
```

## 作業ディレクトリの作成

```sh
mkdir src
```

## フレームワーク

APIには `express` 、変更をサーバーに即時反映するために `ts-node` を利用

```shell
npm i express
npm i -D typescript ts-node @types/node @types/express
```

`app.ts` を追加

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

`package.json` にローカル開発用のnpm scriptを追加

```git
   "scripts": {
+    "local": "ts-node src/app.ts",
```

サーバーを起動し、確認

```shell
npm run local
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

ts-node-devでホットリロード
ts-nodeではない
[ts-node](https://www.npmjs.com/package/ts-node)
