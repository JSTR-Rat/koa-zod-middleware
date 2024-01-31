# koa-zod-middleware
Koa middleware leveraging Zod for seamless validation of requests and responses.

## Usage with [@koa/router](https://www.npmjs.com/package/koa-router)

```js
import Router from '@koa/router';
import { parse } from 'koa-zod-middleware';
import { z } from 'zod';

const router = new Router();

const schema = {
  query: z.object({
    count: z.coerce.number(),
  }),
  body: z.object({
    fruit: z.string(),
  }),
  response: z.object({
    cart: z.string(),
  }),
};

router.post('/purchase', parse(schema), async (ctx) => {
  const { count } = ctx.request.query;
  const { fruit } = ctx.request.body;

  ctx.status = 200;
  ctx.body = {
    cart: `Purchase ${count} ${fruit}`,
  };
});
```
