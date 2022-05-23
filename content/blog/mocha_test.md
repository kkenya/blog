# typescript mocha

```shell
npm i --save-dev ts-mocha @types/mocha
````

```shell
npm set-script test "ts-mocha --project tsconfig.json test/**/*.spec.ts"
npm set-script test:watch "ts-mocha --project tsconfig.json test/**/*.spec.ts  -w --watch-files '**/*.ts'"
```

```shell
mkdir test
```

`test/poland.spec.ts`

```typescript
import assert from 'assert';
import { calcPoland, decodePoland } from '../src/poland';

describe('poland', function () {
  describe('calcPoland', function () {
    it('calculate', function () {
      const polandExp = '13+2-4*5/';
      const result = calcPoland(polandExp);
      assert.deepStrictEqual(result, 1);
    });
  });

  describe('decodePoland', function () {
    it('calculate', function () {
      const polandExp = '13+2-4*5/';
      const result = decodePoland(polandExp);
      assert.deepStrictEqual(result, '');
    });

    it('calculate', function () {
      const polandExp = '11+61-*';
      const result = decodePoland(polandExp);
      assert.deepStrictEqual(result, '');
    });
  });
});
```

```shell
npm test
```
