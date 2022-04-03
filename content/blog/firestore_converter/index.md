---
title: firebaseのconverterで型安全にfiresoreを利用する
date: "2021-01-01T00:00:00+09:00"
status: draft
---

## converterの型定義

```js
export declare interface FirestoreDataConverter<T> {
    /**
     * Called by the Firestore SDK to convert a custom model object of type `T`
     * into a plain JavaScript object (suitable for writing directly to the
     * Firestore database). To use `set()` with `merge` and `mergeFields`,
     * `toFirestore()` must be defined with `PartialWithFieldValue<T>`.
     *
     * The `WithFieldValue<T>` type extends `T` to also allow FieldValues such as
     * {@link (deleteField:1)} to be used as property values.
     */
    toFirestore(modelObject: WithFieldValue<T>): DocumentData;
    /**
     * Called by the Firestore SDK to convert a custom model object of type `T`
     * into a plain JavaScript object (suitable for writing directly to the
     * Firestore database). Used with {@link (setDoc:1)}, {@link (WriteBatch.set:1)}
     * and {@link (Transaction.set:1)} with `merge:true` or `mergeFields`.
     *
     * The `PartialWithFieldValue<T>` type extends `Partial<T>` to allow
     * FieldValues such as {@link (arrayUnion:1)} to be used as property values.
     * It also supports nested `Partial` by allowing nested fields to be
     * omitted.
     */
    toFirestore(modelObject: PartialWithFieldValue<T>, options: SetOptions): DocumentData;
    /**
     * Called by the Firestore SDK to convert Firestore data into an object of
     * type T. You can access your data by calling: `snapshot.data(options)`.
     *
     * @param snapshot - A `QueryDocumentSnapshot` containing your data and metadata.
     * @param options - The `SnapshotOptions` from the initial call to `data()`.
     */
    fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>, options?: SnapshotOptions): T;
}
```

ジェネリクスでT型を指定、fromFirestoreでT型を返すということはfirestoreから取得した状態を正とする
toFirestoreの返り値はDocumentDataなのでなんでもいい
toFirestoreはオーバーロードされていて、Tに指定した型の各プロパティがprimitiveかFieldValueになるWithFieldValueか
第二引数にoptions: SetOptionsをとる場合、そのすべての要素がオプショナルになったPartialWithFieldValue

SetOptionとは

つまり、firestoreからの取得が最終的な結果で、保存時の各プロパティも型を合わせる必要がある
各プロパティはprimitive | FieldValueなので serverTimestampを受け渡すことは可能


複数のconverterを用意するパターンか、共通で一つ定義し呼び出し側で制御するパターン

fromFirestoreの第一引数はsnapshot: QueryDocumentSnapshot<DocumentData>なのでアノテーションでドキュメントの方を指定する

### overloadがめんどくさい

そのままでは利用できない
第1匹数の方に互換性がないため、arg1: PartialWithFieldValue<T>, options?: setOptionでoverloadではなく任意引数で対応する

https://qiita.com/eyuta/items/cfe5880e396a2246f8c0#%E6%9C%AB%E5%B0%BE%E3%81%AE%E5%BC%95%E6%95%B0%E3%81%AE%E3%81%BF%E3%81%8C%E7%95%B0%E3%81%AA%E3%82%8B%E3%82%AA%E3%83%BC%E3%83%90%E3%83%BC%E3%83%AD%E3%83%BC%E3%83%89%E3%82%92%E5%AE%9A%E7%BE%A9%E3%81%97%E3%81%9F%E3%81%84%E5%A0%B4%E5%90%88%E3%81%AF%E4%BB%BB%E6%84%8F%E5%BC%95%E6%95%B0%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%99%E3%82%8B

## idの生成

https://firebase.google.cn/docs/firestore/manage-data/add-data?hl=ja#add_a_document

>.add(...) と .doc().set(...) は完全に同等なので、どちらでも使いやすい方を使うことができます。

クエリの実行回数も一緒？

converterでsnapshot.id -> recipeIdにする場合、すべてのコレクションがランダムなidを利用する前提
やっぱcreateの時に呼び出し側から指定すべき？

## jestでランダムな文字列比較

objectを比較なら tostrictequal

文字列
        recipeId: expect.stringMatching(/^[a-zA-Z0-9]+$/),
数字
        createdAt: expect.any(Number),


fakeTimeは？

## ベストプラクティス


https://cloud.google.com/firestore/docs/best-practices

controllarのテスト
バリデーションのmiddleware
