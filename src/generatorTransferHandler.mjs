import * as Comlink from "../node_modules/comlink/dist/esm/comlink.mjs";

const listen = async (iterable, port) => {
  let shouldIterate = true;

  port.onmessage = ({ data }) => {
    if (data === "CLOSE") {
      shouldIterate = false;
    }
  };

  for await (const val of iterable) {
    if (!shouldIterate) {
      break;
    }
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

      let shouldBreak = false;

      while (!shouldBreak) {
        const value = await read();
        const breakFn = () => {
          shouldBreak = true;
          port.postMessage("CLOSE");
        };
        yield { value, breakFn };
      }

      console.log("DONE");
    })()
});
