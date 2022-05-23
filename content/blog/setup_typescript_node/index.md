---
title: typescriptプロジェクトの立ち上げ
date: "2021-03-08T01:42:44+09:00"
status: published
---

node16でtypescriptのプロジェクト作成手順を忘れるのでメモ

## リポジトリ初期化

```shell
git init .
echo node_modules > .gitignore
```

npmの初期化と `typescript` のインストール。

```shell
npm init -y
npm i --save-dev typescript @types/node

npx tsc --init
```

## tsconfig

`compilerOptions` を[TypeScript/wiki/Node-Target-Mapping](https://github.com/microsoft/TypeScript/wiki/Node-Target-Mapping)の利用するバージョンに対応する値に変更する。
今回はnode16に設定を利用。

|項目|説明
|:--|:--|
|[target](https://www.typescriptlang.org/tsconfig#target)|TypeScriptをトランスパイルした結果出力されるJavaScriptのバージョンを定義|
|[lib](https://www.typescriptlang.org/tsconfig#lib)|built-inで利用できるAPIの型定義を指定|
|[outDir](https://www.typescriptlang.org/tsconfig)|トランスパイル結果の出力先|

TypeScriptの型の恩恵を十分に活用するために `noImplicit` 系統を有効化

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

## ホットリロード

変更を監視し、即時反映するために `ts-node-dev` をインストールする。

```shell
npm i -save-dev ts-node-dev
```

ソースコードを `src` に配置し、エントリーポイントを　`src/app.js` に指定する。

```shell
mkdir src
```

`src/app.ts`

```js
console.log('Hello World')
```

`package.json` にローカル開発用のnpm scriptを追加する
`console.log` のような実行後プロセスが終了するスクリプトの場合は `--respawn` オプションを有効にする

```shell
npm set-script dev "ts-node-dev --respawn src/app.ts"
```

実行後、ファイルを変更して確認する

```shell
npm run dev
```

## prettier

`prettier` を利用し、コードのスタイリングを統一する

```shell
npm install --save-dev --save-exact prettier
```

設定ファイルは複数の[拡張子をサポートしている](https://prettier.io/docs/en/configuration.html)。記述が簡潔になるためyamlを利用

```shell
echo 'singleQuote: true' > .prettierrc.yaml
```

カレントディレクトリ配下を整形する

```shell
npx prettier --write .
```

### Git Hooks

`husky` , `lint-staged` によりコミット前の変更箇所のみに `prettier` を実行する

|package|description|
|:--|:--|
|[husky](https://github.com/typicode/husky)|commit前(pre-commit)などgitコマンドにフックして任意のコマンドを実行できる|
|[lint-sgated](https://github.com/okonet/lint-staged)|gitのstagingエリアに追加したファイルのみをlinterの対象とすることができる(ファイル全体にlinterを実行しないため早い、無関係の変更を含まない)|

[ドキュメント](https://prettier.io/docs/en/install.html#git-hooks)に沿ってcommit時に `lint-staged` から変更ファイルのみに `prettier` の整形を適用させる

```shell
npm install --save-dev husky lint-staged
npx husky install
npm set-script prepare "husky install"
npx husky add .husky/pre-commit "npx lint-staged"
```

package.jsonか設定ファイルにlint-stagedの設定を追加する。
今回は変更ファイルに対して prettierを実行するように `.lintstagedrc.yaml` を作成。
`--ignore-unknown` を指定することで `.husky/pre-commit` などprettierの対応していないフォーマットを無視する

```yaml
'**/*': 'prettier --write --ignore-unknown'
```

## feature

- eslint
  - pre-commit
- test
