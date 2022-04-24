useFaketimeでjestが正常に終了しない

こういうテストを書いていた

```js

sinon.useFakeTimers(1649667912834);

user.create({
  name: 'john'
})

assert.deepStrictEqual({
  name: 'john',
  createdAt: 1649667912834,
  updatedAt: 1649667912834,
})
```

```shell
% npx jest
Jest did not exit one second after the test run has completed.

This usually means that there are asynchronous operations that weren't stopped in your tests. Consider running Jest with `--detectOpenHandles` to troubleshoot this issue.
```

調査

```shell
  console.warn
    FakeTimers: clearTimeout was invoked to clear a native timer instead of one created by this library.
    To automatically clean-up native timers, use `shouldClearNativeTimers`.

      at node_modules/sinon/node_modules/@sinonjs/fake-timers/src/fake-timers-src.js:785:33
      at clearTimer (node_modules/sinon/node_modules/@sinonjs/fake-timers/src/fake-timers-src.js:819:13)
      at Object.clearTimeout (node_modules/sinon/node_modules/@sinonjs/fake-timers/src/fake-timers-src.js:1157:20)
      at clearTimeout (node_modules/sinon/node_modules/@sinonjs/fake-timers/src/fake-timers-src.js:949:38)
      at reschedule (node_modules/mongodb/src/utils.ts:1014:7)
      at Object.wake (node_modules/mongodb/src/utils.ts:995:7)
      at Timeout._onTimeout (node_modules/mongodb/src/sdam/monitor.ts:357:34)
```


## chrome 4001
s06540@CA-20007798[~/work/github.com/cam-inc/fensi/repos/viron] (develop) % lsof -i:4001
COMMAND     PID   USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
node      21232 s06540   88u  IPv4 0xfbc7830491bd85b9      0t0  TCP localhost:newoak->localhost:49388 (ESTABLISHED)
node      21232 s06540  108u  IPv4 0xfbc7830473f0b5b9      0t0  TCP localhost:newoak (LISTEN)
Google    21713 s06540   25u  IPv4 0xfbc7830491c8d5b9      0t0  TCP localhost:49388->localhost:newoak (ESTABLISHED)

s06540@CA-20007798[~/work/github.com/cam-inc/fensi/repos/viron] (develop) % pstree 21713
--- 21713 s06540 /Applications/Google Chrome.app/Contents/Frameworks/Google Chrome Framework.framework/Versions/100.0.4896.88/Helpers/Google Chrome Helper.app/Contents/MacOS/Google Chrome Helper --type=utility --utility-sub-type=network.mojom.NetworkServ
