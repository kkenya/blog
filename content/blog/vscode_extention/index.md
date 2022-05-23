---
title: vscodeの拡張機能を開発する
date: "2022-04-04T20:58:00+09:00"
status: dfaft
---

Visual Studio Code(以下vscode)の拡張機能開発はMicrosoftが提供するジェネレーターを利用して `TypeScript` で記述する

## プロジェクトの作成

拡張機能は[yoeman](https://github.com/yeoman/yo)を利用する
[GET STARTED](https://code.visualstudio.com/api/get-started/your-first-extension)に沿って雛形を生成

```shell
npm install --global yo generator-code
```

インストールしたgeneratorを利用して対話的に初期化を行う
vscode内で実行可能なコマンドや、エディタのカラーテーマ、言語のsyntax highlightなど雛形の種類を選択する

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

## 開発

`npm run watch` でソースコードの変更を監視して逐次トランスパイルを実行する

`F5` でデバッグを実行すると、Extention Development Hostという名前で新しいvscodeのwindowが開く
トランスパイルしたソースコードを、Extention Development Hostに反映させるのは `Cmd + R`(または　`Cmd  + Shift + P` でコマンドパレットを開いて `Developer: Reload Window` )を実行する
>>>>>>> adedc3c (wip)

デバッグを実行( `F5` )すると、Extention Development Hostという名前で新しいvscodeのウインドウが開く
ソースコードの変更を、Extention Development Hostに反映させるのは `Cmd + R` または　`Cmd  + Shift + P` でコマンドパレットを開いて `Developer: Reload Window` を実行しリロードする

### ログの出力

デバッグには基本的にステップ実行を利用して開発するが、`console.log` などでのプリントでバッグを行う場合DEBUG CONSOLE二出力される

例えば、拡張機能を有効化時に呼び出される `activate` 関数にログを追加する

```typescript
export function activate(context: vscode.ExtensionContext) {
  console.log('activated!');
  // ...
}
```

Extention Development Hostのウインドウをリロードすると、拡張機能開発側のウインドウでログを確認できる

![vscode output debug log](./output_log.png)

## 公開

拡張機能を公開するには [vsce](https://github.com/microsoft/vscode-vsce)(Visual Studio Code Extention Manager)を利用する。

`vsce` のインストール

```shell
npm install -g vsce
```

vscodeのマーケットプレイスへの公開は Azure DevOptsで作成したPersonal Access Tokenを作成しておく必要がある

詳細は[ドキュメント](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#get-a-personal-access-token)を参照

`package.json` に記述したpublisherでvsceにログインし、作成したPersonal Access Tokenを登録する

```shell
% vsce login kkenya
Publisher 'kkenya' is already known
Do you want to overwrite its PAT? [y/N] y
https://marketplace.visualstudio.com/manage/publishers/
Personal Access Token for publisher 'kkenya': ****************************************************

The Personal Access Token verification succeeded for the publisher 'kkenya'.
```

vsceでパッケージ化すると `拡張機能名-バージョン.vsix` でVSIXファイルが生成される
公開前にVSIXファイルから拡張機能をインストールし確認することも可能

```shell
vsce package
```

vscodeのマーケットプレイスに拡張機能を公開する

```shell
vsce publish
```

## 詰まった点

### サンプル実装

ユーザー設定やシンタックスハイライトなどのミニマムな実装は[サンプル集](https://github.com/microsoft/vscode-extension-samples)を参考にするといい

### extentionはextensionのタイポ

よく見かける

### Personal Access Tokenの有効期限が切れていた

Azure DevOptsで再度作成し、 `vsce login` を実行し再登録

```shell
 INFO  Publishing 'kkenya.mermaid-sequence-number v1.2.0'...
 ERROR  {"$id":"1","customProperties":{"Descriptor":null,"IdentityDisplayName":null,"Token":null,"RequestedPermissions":0,"NamespaceId":"00000000-0000-0000-0000-000000000000"},"innerException":null,"message":"Access Denied: The Personal Access Token used has expired.","typeName":"Microsoft.VisualStudio.Services.Security.AccessCheckException, Microsoft.VisualStudio.Services.WebApi","typeKey":"AccessCheckException","errorCode":0,"eventId":3000}

You're using an expired Personal Access Token, please get a new PAT.
More info: https://aka.ms/vscodepat
```

### エラーでデバッグのウインドウが起動しない

F5でデバッグ時にエラー
`Extension is not compatible with Code 1.65.2. Extension requires: ^1.66.0.`
起動し直したら直った
複数インスタンス起動していたからバージョンが同期できていなかっ?

### マーケットプレイスでREADMEの画像が表示できない

マーケットプレイスの画像はリポジトリを参照するので拡張機能をpublishしたが、リポジトリを更新していなかったため、取得元の画像が存在せず表示できなかった

### vsce packageでエラーになる

画像をgitignoreの対象にしていて、パッケージ作成時に画像をバンドルできずエラーになった

### 困った

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

## 参考

- [GET STARTED](https://code.visualstudio.com/api/get-started/your-first-extension)
- [microsoft/vscode-extension-samples](https://github.com/microsoft/vscode-extension-samples)
