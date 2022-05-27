---
title: node・npmのバージョンを固定する
date: "2022-05-28T01:21:19+09:00"
status: published
---

`package.json` の[`engines`](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#engines)でバージョンを指定する

```json
{
  "name": "test-module",
  "engines": {
    "node": "=>16",
    "npm": "=>8"
  },
}
```

`package.json` の[`engine-strict`](https://docs.npmjs.com/cli/v8/using-npm/config#engine-strict)フラグを有効にして強制する

```json
{
  "name": "test-module",
  "engines": {
    "node": "=>16",
    "npm": "=>8"
  },
  "engineStrict" : true,
}
```

指定したバージョンでないものを利用して `npm install` を実行するとと、エラーになる
`package-lock.json` は更新されるので注意が必要

```shell
npm WARN EBADENGINE Unsupported engine {
npm WARN EBADENGINE   package: 'fensi-api-marouge@1.0.0',
npm WARN EBADENGINE   required: { node: '<16', npm: '<8' },
npm WARN EBADENGINE   current: { node: 'v16.14.2', npm: '8.5.5' }
```

## 参考
