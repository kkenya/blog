---
title: ""
date: "2021-01-01T00:00:00+09:00"
status: draft
---

converterの型定義

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
