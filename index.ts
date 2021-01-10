import { Application, Router } from 'https://deno.land/x/oak/mod.ts';

const getFormattedDate = () => {
  const date = new Date();
  return (
    date.getFullYear() +
    '-' +
    (date.getMonth() < 10 ? '0' : '') +
    (date.getMonth() + 1) +
    '-' +
    date.getDate()
  );
};

const router = new Router();
router
  .get('/', (context) => {
    context.response.body = 'Hello world!';
  })
  .get('/shrt/:id', (context) => {
    const urls = JSON.parse(Deno.readTextFileSync('./urls.json'));
    if (context.params && context.params.id && context.params.id in urls) {
      const link = urls[context.params.id];
      if (link.expiryDate > getFormattedDate()) {
        context.response.redirect(link.dest);
      } else {
        context.response.body = 'Link expired';
      }
    } else {
      context.response.body = '404';
    }
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
