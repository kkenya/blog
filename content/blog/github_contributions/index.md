---
title: GraphQL
date: "2021-09-22T23:04:33+09:00"
description: "Githubの草を取得した"
status: draft
---

## GraphQL

### field

オブジェクトの要素。graphql へのデータ取得はクエリにオブジェクトとそのフィールドを指定することで対応するデータを取得できる。
GraphQL のチュートリアルを参考にするとヒーローオブジェクトがあるとすると

つまり全てのフィールドを明示する

ダブルクォーとは利用できない

```js
query {
  user(login: "kkenya") {
    login
  }
}
```

```js
const user = {
  name: "tanaka",
  age: 20,
}
```

query は

```js
{
  user {
    name
  }
}
```

結果は

```js
{
  "data": {
    "user": {
      "name": "tanaka"
    }
  }
}
```

単一の要素と配列を同一のものとして扱う。

```js
const user = {
  name: "tanaka",
  friends: [
	  {
		  name: 'satou'
	  }
  ]
  age: 20,
}

# query
{
	user {
		name
		friends {
			name
		}
	}
}

# res
{
  "data": {
    "user": {
      "name": "tanaka"
      "frineds": [
	      {
		      "name": "satou"
	      }
      ]
    }
  }
}
```

## arguments

field を指定して検索する。

```js
{
  human(id: "1000") {
    name
    height
  }
}

{
  "data": {
    "human": {
      "name": "Luke Skywalker",
      "height": 1.72
    }
  }
}
```

## aliases

field の取得結果を命名できる。同じ field を取得するが、argument が異なる場合などに用いる

```js
{
  empireHero: hero(episode: EMPIRE) {
    name
  }
  jediHero: hero(episode: JEDI) {
    name
  }
}

# res
{
  "data": {
    "empireHero": {
      "name": "Luke Skywalker"
    },
    "jediHero": {
      "name": "R2-D2"
    }
  }
}
```

## github v4

graphQL スキーマは「queries」と「mutations」両方の root type をもつ。query はサーバーからデータを取得する GraphQL operations を定義する

### user を取得するクエリ

```js
query UserLogin {
  user(login: "kkenya") {
    login
  }
}
```

[queries/user](https://docs.github.com/en/graphql/reference/queries#user)

> Lookup a user by login.

login field を User の schema から確認。

> The username used to login.

- [objects#user](https://docs.github.com/en/graphql/reference/objects#user)
- [objects#contributioncalendar](https://docs.github.com/en/graphql/reference/objects#contributioncalendar)
- [objects#contributioncalendarday](https://docs.github.com/en/graphql/reference/objects#contributioncalendarday)
- [objects#contributioncalendarweek](https://docs.github.com/en/graphql/reference/objects#contributioncalendarweek)

```js
query UserDailyContibutions($username: String!) {
  user(login: $username) {
    contributionsCollection {
      contributionCalendar {
        # colors
        # isHalloween
        # months
        # totalContributions
        # weeks
        weeks {
          contributionDays {
            color
            # contributionCount
            # contributionLevel
            date
            # weekday
          }
        }
      }
    }
  }
}
#

{
  "username": "kkenya"
}
```

取得結果

```js
{
  "data": {
    "user": {
      "contributionsCollection": {
        "contributionCalendar": {
          "weeks": [
            {
              "contributionDays": [
                {
                  "color": "#ebedf0",
                  "date": "2020-09-20"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-09-21"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-09-22"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-09-23"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-09-24"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-09-25"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-09-26"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#ebedf0",
                  "date": "2020-09-27"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-09-28"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-09-29"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-09-30"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-10-01"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-10-02"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-10-03"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#ebedf0",
                  "date": "2020-10-04"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-10-05"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-10-06"
                },
                {
                  "color": "#40c463",
                  "date": "2020-10-07"
                },
                {
                  "color": "#9be9a8",
                  "date": "2020-10-08"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-10-09"
                },
                {
                  "color": "#40c463",
                  "date": "2020-10-10"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#9be9a8",
                  "date": "2020-10-11"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-10-12"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-10-13"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-10-14"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-10-15"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-10-16"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-10-17"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#ebedf0",
                  "date": "2020-10-18"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-10-19"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-10-20"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-10-21"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-10-22"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-10-23"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-10-24"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#ebedf0",
                  "date": "2020-10-25"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-10-26"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-10-27"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-10-28"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-10-29"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-10-30"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-10-31"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#ebedf0",
                  "date": "2020-11-01"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-11-02"
                },
                {
                  "color": "#40c463",
                  "date": "2020-11-03"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-11-04"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-11-05"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-11-06"
                },
                {
                  "color": "#40c463",
                  "date": "2020-11-07"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#ebedf0",
                  "date": "2020-11-08"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-11-09"
                },
                {
                  "color": "#9be9a8",
                  "date": "2020-11-10"
                },
                {
                  "color": "#9be9a8",
                  "date": "2020-11-11"
                },
                {
                  "color": "#9be9a8",
                  "date": "2020-11-12"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-11-13"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-11-14"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#ebedf0",
                  "date": "2020-11-15"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-11-16"
                },
                {
                  "color": "#9be9a8",
                  "date": "2020-11-17"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-11-18"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-11-19"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-11-20"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-11-21"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#ebedf0",
                  "date": "2020-11-22"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-11-23"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-11-24"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-11-25"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-11-26"
                },
                {
                  "color": "#9be9a8",
                  "date": "2020-11-27"
                },
                {
                  "color": "#40c463",
                  "date": "2020-11-28"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#30a14e",
                  "date": "2020-11-29"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-11-30"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-12-01"
                },
                {
                  "color": "#40c463",
                  "date": "2020-12-02"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-12-03"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-12-04"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-12-05"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#ebedf0",
                  "date": "2020-12-06"
                },
                {
                  "color": "#9be9a8",
                  "date": "2020-12-07"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-12-08"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-12-09"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-12-10"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-12-11"
                },
                {
                  "color": "#9be9a8",
                  "date": "2020-12-12"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#ebedf0",
                  "date": "2020-12-13"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-12-14"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-12-15"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-12-16"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-12-17"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-12-18"
                },
                {
                  "color": "#9be9a8",
                  "date": "2020-12-19"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#9be9a8",
                  "date": "2020-12-20"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-12-21"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-12-22"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-12-23"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-12-24"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-12-25"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-12-26"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#ebedf0",
                  "date": "2020-12-27"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-12-28"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-12-29"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-12-30"
                },
                {
                  "color": "#ebedf0",
                  "date": "2020-12-31"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-01-01"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-01-02"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#9be9a8",
                  "date": "2021-01-03"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-01-04"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-01-05"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-01-06"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-01-07"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-01-08"
                },
                {
                  "color": "#30a14e",
                  "date": "2021-01-09"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#40c463",
                  "date": "2021-01-10"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-01-11"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-01-12"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-01-13"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-01-14"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-01-15"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-01-16"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#40c463",
                  "date": "2021-01-17"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-01-18"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-01-19"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-01-20"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-01-21"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-01-22"
                },
                {
                  "color": "#30a14e",
                  "date": "2021-01-23"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#30a14e",
                  "date": "2021-01-24"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-01-25"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-01-26"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-01-27"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-01-28"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-01-29"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-01-30"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#9be9a8",
                  "date": "2021-01-31"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-02-01"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-02-02"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-02-03"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-02-04"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-02-05"
                },
                {
                  "color": "#40c463",
                  "date": "2021-02-06"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#9be9a8",
                  "date": "2021-02-07"
                },
                {
                  "color": "#40c463",
                  "date": "2021-02-08"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-02-09"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-02-10"
                },
                {
                  "color": "#40c463",
                  "date": "2021-02-11"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-02-12"
                },
                {
                  "color": "#30a14e",
                  "date": "2021-02-13"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#9be9a8",
                  "date": "2021-02-14"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-02-15"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-02-16"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-02-17"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-02-18"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-02-19"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-02-20"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#ebedf0",
                  "date": "2021-02-21"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-02-22"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-02-23"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-02-24"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-02-25"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-02-26"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-02-27"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#9be9a8",
                  "date": "2021-02-28"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-03-01"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-03-02"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-03-03"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-03-04"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-03-05"
                },
                {
                  "color": "#40c463",
                  "date": "2021-03-06"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#40c463",
                  "date": "2021-03-07"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-03-08"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-03-09"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-03-10"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-03-11"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-03-12"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-03-13"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#9be9a8",
                  "date": "2021-03-14"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-03-15"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-03-16"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-03-17"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-03-18"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-03-19"
                },
                {
                  "color": "#30a14e",
                  "date": "2021-03-20"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#216e39",
                  "date": "2021-03-21"
                },
                {
                  "color": "#40c463",
                  "date": "2021-03-22"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-03-23"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-03-24"
                },
                {
                  "color": "#30a14e",
                  "date": "2021-03-25"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-03-26"
                },
                {
                  "color": "#40c463",
                  "date": "2021-03-27"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#9be9a8",
                  "date": "2021-03-28"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-03-29"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-03-30"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-03-31"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-04-01"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-04-02"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-04-03"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#ebedf0",
                  "date": "2021-04-04"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-04-05"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-04-06"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-04-07"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-04-08"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-04-09"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-04-10"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#ebedf0",
                  "date": "2021-04-11"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-04-12"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-04-13"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-04-14"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-04-15"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-04-16"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-04-17"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#ebedf0",
                  "date": "2021-04-18"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-04-19"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-04-20"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-04-21"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-04-22"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-04-23"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-04-24"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#ebedf0",
                  "date": "2021-04-25"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-04-26"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-04-27"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-04-28"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-04-29"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-04-30"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-05-01"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#9be9a8",
                  "date": "2021-05-02"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-05-03"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-05-04"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-05-05"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-05-06"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-05-07"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-05-08"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#ebedf0",
                  "date": "2021-05-09"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-05-10"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-05-11"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-05-12"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-05-13"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-05-14"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-05-15"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#ebedf0",
                  "date": "2021-05-16"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-05-17"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-05-18"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-05-19"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-05-20"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-05-21"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-05-22"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#ebedf0",
                  "date": "2021-05-23"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-05-24"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-05-25"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-05-26"
                },
                {
                  "color": "#40c463",
                  "date": "2021-05-27"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-05-28"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-05-29"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#40c463",
                  "date": "2021-05-30"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-05-31"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-06-01"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-06-02"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-06-03"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-06-04"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-06-05"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#9be9a8",
                  "date": "2021-06-06"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-06-07"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-06-08"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-06-09"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-06-10"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-06-11"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-06-12"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#9be9a8",
                  "date": "2021-06-13"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-06-14"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-06-15"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-06-16"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-06-17"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-06-18"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-06-19"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#ebedf0",
                  "date": "2021-06-20"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-06-21"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-06-22"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-06-23"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-06-24"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-06-25"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-06-26"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#ebedf0",
                  "date": "2021-06-27"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-06-28"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-06-29"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-06-30"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-07-01"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-07-02"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-07-03"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#ebedf0",
                  "date": "2021-07-04"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-07-05"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-07-06"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-07-07"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-07-08"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-07-09"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-07-10"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#ebedf0",
                  "date": "2021-07-11"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-07-12"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-07-13"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-07-14"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-07-15"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-07-16"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-07-17"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#ebedf0",
                  "date": "2021-07-18"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-07-19"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-07-20"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-07-21"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-07-22"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-07-23"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-07-24"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#ebedf0",
                  "date": "2021-07-25"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-07-26"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-07-27"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-07-28"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-07-29"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-07-30"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-07-31"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#ebedf0",
                  "date": "2021-08-01"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-08-02"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-08-03"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-08-04"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-08-05"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-08-06"
                },
                {
                  "color": "#40c463",
                  "date": "2021-08-07"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#40c463",
                  "date": "2021-08-08"
                },
                {
                  "color": "#40c463",
                  "date": "2021-08-09"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-08-10"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-08-11"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-08-12"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-08-13"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-08-14"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#9be9a8",
                  "date": "2021-08-15"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-08-16"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-08-17"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-08-18"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-08-19"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-08-20"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-08-21"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#ebedf0",
                  "date": "2021-08-22"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-08-23"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-08-24"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-08-25"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-08-26"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-08-27"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-08-28"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#ebedf0",
                  "date": "2021-08-29"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-08-30"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-08-31"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-09-01"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-09-02"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-09-03"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-09-04"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#9be9a8",
                  "date": "2021-09-05"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-09-06"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-09-07"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-09-08"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-09-09"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-09-10"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-09-11"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#40c463",
                  "date": "2021-09-12"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-09-13"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-09-14"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-09-15"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-09-16"
                },
                {
                  "color": "#9be9a8",
                  "date": "2021-09-17"
                },
                {
                  "color": "#40c463",
                  "date": "2021-09-18"
                }
              ]
            },
            {
              "contributionDays": [
                {
                  "color": "#9be9a8",
                  "date": "2021-09-19"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-09-20"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-09-21"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-09-22"
                },
                {
                  "color": "#ebedf0",
                  "date": "2021-09-23"
                }
              ]
            }
          ]
        }
      }
    }
  }
}
```

### nodeで呼び出し

[GraphQL Client](https://graphql.org/graphql-js/graphql-clients/)

npm i node-fetch

## github v4

user query

https://docs.github.com/en/graphql/reference/queries#user

user Object

https://docs.github.com/en/graphql/reference/objects#user