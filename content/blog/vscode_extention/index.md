---
title: vscodeの拡張機能開発について
date: "2022-04-04T20:58:00+09:00"
status: draft
---

コードジェネレーターをインストール

```mermaid
npm install -g yo generator-code
yo code
```

雛形の作成
`New Language Support` を選択し、対話的にプロジェクトを初期化

```shell
% yo code

     _-----_     ╭──────────────────────────╮
    |       |    │   Welcome to the Visual  │
    |--(o)--|    │   Studio Code Extension  │
   `---------´   │        generator!        │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `

? What type of extension do you want to create? New Language Support
Enter the URL (http, https) or the file path of the tmLanguage grammar or press ENTER to start with a new grammar.
? URL or file to import, or none for new:
? What's the name of your extension? Abc lang
? What's the identifier of your extension? abc-lang
? What's the description of your extension? Syntax highlighting for abc lang
Enter the id of the language. The id is an identifier and is single, lower-case name such as 'php', 'javascript'
? Language id: abc
Enter the name of the language. The name will be shown in the VS Code editor mode selector.
? Language name: Abc
Enter the file extensions of the language. Use commas to separate multiple entries (e.g. .ruby, .rb)
? File extensions: .abc
Enter the root scope name of the grammar (e.g. source.ruby)
? Scope names: source.abc
? Initialize a git repository? Yes

Writing in ~/work/github.com/kkenya/abc-lang...
   create abc-lang/syntaxes/abc.tmLanguage.json
   create abc-lang/.vscode/launch.json
   create abc-lang/package.json
   create abc-lang/README.md
   create abc-lang/CHANGELOG.md
   create abc-lang/vsc-extension-quickstart.md
   create abc-lang/language-configuration.json
   create abc-lang/.vscodeignore
   create abc-lang/.gitignore
   create abc-lang/.gitattributes

Changes to package.json were detected.
Skipping package manager install.


Your extension abc-lang has been created!

To start editing with Visual Studio Code, use the following commands:

     code abc-lang

Open vsc-extension-quickstart.md inside the new extension for further instructions
on how to modify, test and publish your extension.

For more information, also visit http://code.visualstudio.com and follow us @code.


? Do you want to open the new folder with Visual Studio Code? Open with `code`
```

## デバッグ

`npm run watch` でソースコードの変更を監視して逐次トランスパイルを実行する

`F5` でデバッグを実行すると、Extention Development Hostという名前で新しいvscodeのwindowが開く
トランスパイルしたソースコードを、Extention Development Hostに反映させるのは `Cmd + R`(または　`Cmd  + Shift + P` でコマンドパレットを開いて `Developer: Reload Window` )を実行する

### [Scope inspector](https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide#scope-inspector)

`Developer: Inspect Editor Tokens and Scopes`

リファレンスで推奨しているショートカットを登録。表示・非表示をショートカットで切り替えられるようになる

```json
{
  "key": "cmd+alt+shift+i",
  "command": "editor.action.inspectTMScopes"
}
```

## 文法

markdownなら拡張起動を機能
対応する[indentifier](https://code.visualstudio.com/docs/languages/identifiers)

## jsonの代わりにyamlで記述する

yamlで簡潔に設定ファイル記述する。vscodeではjsonの文法のみを読み込むため、拡張機能を提供する際にyamlからjsonに変換する必要がある

scaffoldした時点ではjsonファイルなので[js-yaml](https://github.com/nodeca/js-yaml)を利用してyamlに変換

```shell
px js-yaml syntaxes/mermaid.tmLanguage.json > syntaxes/mermaid.tmLanguage.yaml
```

今後はyamlで記述し、拡張機能をデバッグ・publishする際にjsonに変換する

```shell
npm i -D js-yaml
```

## パッケージの公開

なぜvsceが必要なのか書く

webpackでビルドされ、
パッケージ名とパッケージバージョンから拡張機能がビルドされる

package.name mermaid-sequence-number
versoin: 1.0.0
result: mermaid-sequence-number-1.0.0.vsix

```shell
% npm run package

> mermaid-sequence-number@1.2.0 package
> webpack --mode production --devtool hidden-source-map

    [webpack-cli] Compiler starting...
    [webpack-cli] Compiler is using config: '/Users/s06540/work/github.com/kkenya/mermaid-editor-sequence-number/webpack.config.js'
    [webpack-cli] Compiler finished
asset extension.js 84.7 KiB [emitted] [minimized] (name: main) 1 related asset
orphan modules 230 KiB [orphan] 53 modules
runtime modules 670 bytes 3 modules
built modules 237 KiB [built]
  ./src/extension.ts 7.47 KiB [built] [code generated]
  ./node_modules/mdast-util-from-markdown/index.js + 52 modules 230 KiB [built] [code generated]
  external "vscode" 42 bytes [built] [code generated]
webpack 5.72.0 compiled successfully in 2654 ms
```

パッケージ化には `vsce` を利用する。
プロジェクトの作成
パーソナルアクセストークンの発行

```shell
% vsce login kkenya
Publisher 'kkenya' is already known
Do you want to overwrite its PAT? [y/N] y
https://marketplace.visualstudio.com/manage/publishers/
Personal Access Token for publisher 'kkenya': ****************************************************

The Personal Access Token verification succeeded for the publisher 'kkenya'.
 INFO
The latest version of vsce is 2.8.0 and you have 2.7.0.
Update it now: npm install -g vsce
```

```shell
npm install -g vsce
```

vsceによるパッケージの生成。packageコマンドとの違いは？

```shell
npm run prepublish
```

publishの実行

```shell
npm run publish
```

### personal access tokenの有効期限が切れていた

```shell
 INFO  Publishing 'kkenya.mermaid-sequence-number v1.2.0'...
 ERROR  {"$id":"1","customProperties":{"Descriptor":null,"IdentityDisplayName":null,"Token":null,"RequestedPermissions":0,"NamespaceId":"00000000-0000-0000-0000-000000000000"},"innerException":null,"message":"Access Denied: The Personal Access Token used has expired.","typeName":"Microsoft.VisualStudio.Services.Security.AccessCheckException, Microsoft.VisualStudio.Services.WebApi","typeKey":"AccessCheckException","errorCode":0,"eventId":3000}

You're using an expired Personal Access Token, please get a new PAT.
More info: https://aka.ms/vscodepat
```

## メモ

colorize participant, actor
apply sequencial number to editor
rgb selector

tokenize　字句解析　馴染みのない単語なので説明できるように

unified: ASTsでコンテンツを変換するプロジェクト
remark: unifiedにmarkdownのサポートを追加する
mdast: remarkが利用するmarkdown AST
micomark: remarkが利用するmarkdown parser

[remark-parse](https://github.com/remarkjs/remark/tree/main/packages/remark-parse): micromarkを利用してmarkdownをトークンに解析し、解析したトークンをmdast構文のツリーに変換するremarkはコンテンツ変換の内部を抽象化する
markdownをHTMLに変換するだけならmicromarkの利用を推奨している
ASTを直接いじるならmdast-util-from-markdown

[mdast-util-from-markdown](https://github.com/syntax-tree/mdast-util-from-markdown): markdownをASTに変換するmdastのユーティリティ。markdownをtokenに変換するmicromarkを利用している

Activation Event

### contributions

拡張機能が影響を及ぼす範囲を記述する?
コマンド、言語、イベント...

### onLaunguage

指定した言語のファイルが開かれる毎に `active` 関数へイベントが送信される

window と workspace
active editors と　visible editors

### Event

onDidChangeActiveTextEditor
active editorが変わった時
paneを移動すると発火、テキスト自体の変更ではない

inspectorでastをprettyに
npm i -D unist-util-inspect
https://github.com/syntax-tree/unist-util-inspect

## こまった

F5でデバッグ時にエラー
`Extension is not compatible with Code 1.65.2. Extension requires: ^1.66.0.`
起動し直したら直った
複数インスタンス起動していたからバージョンが同期できていなかった？

変更が反映されない
typescriptで開発しているので、javascriptに都度トランスパイルする必要がある
`npm run compile` または `npm run watch` で変更を監視しましょう

アイコンについて
背景について

画像をgitignoreの対象にしていて、パッケージ作成時に画像をバンドルできずエラーになった

正規表現で遅くなった

処理を実行するイベントについて
テキストを開いた時に反映されない

windowとworkspaceについて

Eventの引数について
https://code.visualstudio.com/api/references/vscode-api#EvaluatableExpressionProvider

Event
イベントを購読するリスナーを登録する
lisner リスナーはイベントが発火した際に呼ばれる
thisArgs イベントリスナーを呼び出した際に利用される
disposables disposableが追加されるdisposableの配列
返り値 disposable

dispose 意味　廃棄

Disposable
イベントリスナーやタイマーのようなリソースを解放できるtypeを提供する

## configuration

https://code.visualstudio.com/api/references/contribution-points#contributes.configuration

user単位、workplace単位

JSONSchemaで定義

各k朝機能のログはdebug console
syntax errorはoutputに

画像が取得できない
リポジトリから取得するので先にpushしておく必要がある

mermaidAPI.render
  mermaidAPI.detectType
  [render].draw

  diagrams.sequence.sequenceRender.draw
