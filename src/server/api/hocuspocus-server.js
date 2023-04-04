/* eslint @typescript-eslint/no-var-requires: "off" */
const { Hocuspocus } = require("@hocuspocus/server");

const server = new Hocuspocus({
  port: 1234,
  name : "blueprint-beta.vercel.app"
});

server.listen();
