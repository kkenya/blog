---
title: node・npmのバージョンを固定する
date: "2022-05-28T01:21:19+09:00"
status: published
---

## 結論

`package.json` , `.npmrc` 両方で設定する必要がある

### package.json

```json
  "name": "test-package",
  "engines": {
    "node": "=>16",
    "npm": "=>8"
  },
```

### .npmrc

```txt
engine-strict=true
```

## 詳細

### engines

`package.json` で利用する `node` , `npm` のバージョンを指定する

```json
  "engines": {
    "node": "=>16",
    "npm": "=>8"
  },
```

`engines` のフィールドには　`node` か `npm` が指定可能で、下記のように上限・下限をメジャー・マイナー・パッチバージョンを指定できる

```json
{
  "engines": {
    "node": ">=0.10.3 <15"
  }
}
```

`.npmrc` で `engines` はあくまで指定したバージョンに一致しない状態でインストールした場合に警告を表示するのみで、バージョンを強制する場合は後述の `engine-strict` の併用が必要

### engine-strict

フラグを有効にして `node` , `npm` のバージョンを強制する
インストール時に `--force` フラグを有効にすると無視できる

`.npmrc`

```text
engine-strict=true
```

指定したバージョンでないものを利用して `npm install` を実行した場合エラーになる

```shell
npm WARN EBADENGINE Unsupported engine {
npm WARN EBADENGINE   package: 'test-package@1.0.0',
npm WARN EBADENGINE   required: { node: '>=16', npm: '>=8' },
npm WARN EBADENGINE   current: { node: 'v14.17.6', npm: '6.14.15' }
npm WARN EBADENGINE }
```

## 参考

- [package.json#engines](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#engines)
- [package.json#engine-strict](https://docs.npmjs.com/cli/v8/using-npm/config#engine-strict)
