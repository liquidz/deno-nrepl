import * as nrepl from "./mod.ts";

// Run `deno task example-nrepl-server` before running this example.
const conn = await nrepl.connect({ port: 12345 });

// Write a request and read a response
const resp = await conn.write(
  {
    op: "eval",
    code: `(do (println "hello") (+ 1 2))`,
  },
  {
    context: { foo: "any value" },
  },
);
console.log(`result => ${resp.getOne("value")} (context: ${resp.context.foo})`);

// Fetch standard outputs/errors from stream
Promise.race([
  (async () => {
    for await (const o of conn.output) {
      console.log(`${o.type} => ${o.text} (context: ${o.context.foo})`);
    }
  })(),
  conn.closed,
]);

await conn.close();
