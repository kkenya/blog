---
title: textlintを導入した
date: "2018-11-23T23:32:43+09:00"
status: draft
---

## textlint

### textlintのインストール

[textlint](https://github.com/textlint/textlint)

### ルールの追加

```sh
npm i -D textlint-rule-preset-ja-technical-writing textlint-rule-preset-jtf-style textlint-rule-spellcheck-tech-word
```

- [技術用語](https://github.com/azu/textlint-rule-spellcheck-tech-word)
- [TF日本語標準スタイルガイド（翻訳用）](https://github.com/textlint-ja/textlint-rule-preset-JTF-style)
- [技術文書向けプリセット](https://github.com/textlint-ja/textlint-rule-preset-ja-technical-writing)

[textlint-rule-spellcheck-tech-word](https://github.com/azu/textlint-rule-spellcheck-tech-word)が非推奨となり、[@proofdict/textlint-rule-proofdict](https://github.com/proofdict/proofdict/tree/master/packages/%40proofdict/textlint-rule-proofdict)の利用が推奨されていた。

## git hooks

pre-push でfix
エラーは無視する

## vscode拡張機能

workspaceかグローバルにtextlintをインストールしていれば、設定ファイルを読み込み、リアルタイムでtextlintを実行できる。

[vscode-textlint](https://marketplace.visualstudio.com/items?itemName=taichi.vscode-textlint)

拡張機能のfixが利用できない。

## pre-push

fixを実行
失敗してもpushしたい

## GitHub Actionsで強制する
## 参考

- [技術文章の文章校正をtextlintとGitHub Actionsで快適にする](https://ponzmild.hatenablog.com/entry/2020/08/23/135152)
