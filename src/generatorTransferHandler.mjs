import * as Comlink from "../node_modules/comlink/dist/esm/comlink.mjs";

const listen = async (iterable, port) => {
  for await (const val of iterable) {
    port.postMessage(val);
  }
};

Comlink.transferHandlers.set("asyncIterator", {
  canHandle: obj => obj && obj[Symbol.asyncIterator],
  serialize: iterable => {
    const { port1, port2 } = new MessageChannel();
    listen(iterable, port1);
    return [port2, [port2]];
  },
  deserialize: port =>
    (async function*() {
      const read = () =>
        new Promise(resolve => {
          port.onmessage = ({ data }) => {
            resolve(data);
          };
        });

      while (true) {
        yield await read();
      }
    })()
});
