---
title: Team Geekを読んだ
date: "2023-04-16T05:58:31+00:00"
status: draft
---

チームで誰かと働く上でのパターン・アンチパターンについて書かれている。
## 自分について

2023年4月時点で5年目になるバックエンドエンジニア。バックエンド・フロントエンド含め、だいたい3~6人ほどのエンジニアチームで開発を行ってきた。ざっくりしたサービスの仕様に基づいて実装方針を設計し、コーディングからリリースまでを主似たづ触ってきた。。詳しい内容は後ほどまとめる。

## 所感

これまでのチーム開発の経験をあてはめて読むことで、今まで言語化できなかったが何となくうまくいかなかったことについて振り返ることができた。会社の規模や文化によって書かれている内容が当てはまらないこともあるが、自分の身の振り方について見直してみようと思う。

目次を見て印象的だったこと、記憶に残っていたこと

## 1.5 三本柱

チームで働くときの3つのポイントについて、謙虚(Humility)・尊敬(Respect)・信頼(Trust)の3つの頭文字をとりHRT(ハート)を定義している。そして、この3つのポイントの対象は同じ開発チームのエンジニアだけでなくチームから協力者、組織、ユーザーまでを含めている。

todo: HRTの図引用

業務に関係ない時間での雑談や、相手を不快にさせない批判のやり方により何かを成し遂げるための人間関係が重要であることが書かれている。

### 感想

まずHRTについては言葉にすれば当たり前だが覚えやすいアルファベット3文字にすることで普段の業務で心がけることができた。
煩わしいと思うSlackでのやり取りも一度HRTに当てはめて自分の発言、行動は謙虚だったか相手への尊敬を持った対応をしていたのかなど振り返ることができる。

人間関係についてはいままで、自分の性格的に業務外でチームメンバーと雑談をすることはあまりないし、進めるべきタスクがある中で雑談をすること自体への後ろめたさがあることからタスクを進める上で必要な最低限のコミュニケーションしか取っていなかった。つまり書籍の言い回しを用いると、人間関係の力を過小評価していた。
これは今までバイトなどで社会と関わってこなかった、自分の社会経験の低さがが露呈していると振り返ることができたし、マネージャーやシニアのエンジニアがどういった方法で人間関係を構築している

3.4.1 パフォーマンスの低い人を無視する
  自分の経験から動くべきだった

自分の立場から書く
## 印象に残った内容

章ごとに自分の所感を留める。

## 1章 天才プログラマの神話

### 1.3 隠したらダメになる

早い段階から成果を共有し、高速なフィードバックループを回すことでバス係数を高めることについて書かれている。バス係数(Bus factor)とは知識や能力のある人物が突然いなくなる(バスに轢かれる)ことでプロジェクトが停滞または破綻するのに必要な人数。値が大きいほど特定の人物を失った際のリスクが小さい。

- [Bus factor](https://en.wikipedia.org/wiki/Bus_factor#:~:text=The%20bus%20factor%20is%20a%20measurement%20of%20the,problem%2C%20truck%20factor%2C%20or%20bus%2Ftruck%20number.%20%5Bcitation%20needed%5D)

これはとても身に覚えがあるし、今でも意識しないとできないときがある。

例えば
- 機能設計で自分の中で完全に詳細を詰められたと思った後よりシステムに知見の深いエンジニアからのレビューで根本的な失敗に気づくこと
- 実装が意図した挙動をせず当初のスケジュールから完了に数日が経過する

このような労力は無駄で他人を頼ることができれば、スケジュールが遅れていることを報告するうしろめたさや簡単に間違いを指摘されることへの恐れもなくなった。