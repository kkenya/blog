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

[TypeScript/wiki/Node-Target-Mapping](https://github.com/microsoft/TypeScript/wiki/Node-Target-Mapping)からnodeバージョンに対応する値に`compilerOptions` を変更する。
今回はnode16に設定を利用。
`target` はTypeScriptをトランスパイルした結果出力されるJavaScriptのバージョンを定義する。 `lib` を指定することでbuilt-inで利用できるAPIの型定義を指定する。
オプショナルな設定として、TypeScriptの型の恩恵を十分に活用するために `noImplicit` 系統を設定。

トランスパイル結果の出力先は `dist` に設定した。

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

## ホットリロード

変更を監視し、即時反映するために `ts-node-dev` をインストールする。

```shell
npm i -save-dev ts-node-dev
```

ソースコードを `src` に配置し、エントリーポイントを　`src/app.js` に指定する。

```shell
mkdir src
```

`src/app.js`

```js
console.log('Hello World')
```

`package.json` にローカル開発用のnpm scriptを追加

```git
   "scripts": {
+    "dev": "ts-node src/app.ts",
```

サーバーを起動し、確認

```shell
npm run dev
```

## feature

- [husky](https://github.com/typicode/husky)
  - git commit, push時での指定コマンドの実行
- [lint-sgated](https://github.com/okonet/lint-staged)
  - gitのstageに追加した変更(git addした変更)のみをlint対象にする
- テスト
