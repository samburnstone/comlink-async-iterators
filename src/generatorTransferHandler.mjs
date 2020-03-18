import * as Comlink from "../node_modules/comlink/dist/esm/comlink.mjs";

const listen = async (iterable, port) => {
  let shouldIterate = true;

  port.onmessage = ({ data }) => {
    if (data === "RETURN") {
      shouldIterate = false;
    }
  };

  for await (const val of iterable) {
    if (!shouldIterate) {
      console.log("listener generator break called");
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
  deserialize: port => {
    async function* generatorFn() {
      const read = () =>
        new Promise(resolve => {
          port.onmessage = ({ data }) => {
            resolve(data);
          };
        });

      while (true) {
        yield await read();
        console.log("reading!");
      }
    }

    const generator = generatorFn();

    return {
      [Symbol.asyncIterator]: () => ({
        next: generator.next.bind(generator),
        return: value => {
          console.log("Breaking");
          port.postMessage("RETURN");
          return generator.return(value);
        },
        throw: e => {
          console.log("Error thrown");
          return generator.throw(e);
        }
      })
    };
  }
});
