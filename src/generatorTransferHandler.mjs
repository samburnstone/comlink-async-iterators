import * as Comlink from "../node_modules/comlink/dist/esm/comlink.mjs";

const listen = async (iterator, port) => {
  port.onmessage = async ({ data }) => {
    if (data === "NEXT") {
      port.postMessage(await iterator.next());
    }
    // TODO: return and throw arguments should be passed down
    if (data === "RETURN") {
      if (iterator.return) {
        port.postMessage(await iterator.return());
      }
    }
    if (data === "THROW") {
      if (iterator.throw) {
        port.postMessage(await iterator.throw());
      }
    }
  };
};

Comlink.transferHandlers.set("asyncIterator", {
  canHandle: obj => obj && obj[Symbol.asyncIterator],
  serialize: iterable => {
    // https://2ality.com/2017/01/messagechannel.html
    // https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API
    // https://www.html5rocks.com/en/tutorials/workers/basics/
    const { port1, port2 } = new MessageChannel();
    listen(iterable[Symbol.asyncIterator](), port1);
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

      try {
        while (true) {
          // TODO: is "done" the best way to observe this?
          const { value, done } = await read();
          if (done) {
            break;
          }
          yield value;
        }
      } finally {
        // TODO: workout if this necessary... might be needed to force clean-up of message channels
        port.close();
      }
    }

    const generator = generatorFn();

    return {
      [Symbol.asyncIterator]: () => ({
        next: () => {
          port.postMessage("NEXT");
          return generator.next();
        },
        return: value => {
          port.postMessage("RETURN");
          return generator.return(value);
        },
        throw: e => {
          port.postMessage("THROW");
          return generator.throw(e);
        }
      })
    };
  }
});

Comlink.transferHandlers.set("iterator", {
  canHandle: obj => obj && obj[Symbol.iterator],
  serialize: iterable => {
    // https://2ality.com/2017/01/messagechannel.html
    // https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API
    // https://www.html5rocks.com/en/tutorials/workers/basics/
    const { port1, port2 } = new MessageChannel();
    listen(iterable[Symbol.iterator](), port1);
    return [port2, [port2]];
  },
  deserialize: port => {
    async function* generatorFn() {
      const read = () =>
        new Promise(resolve => {
          port.onmessage = ({ data }) => {
            console.log(data);
            resolve(data);
          };
        });

      try {
        while (true) {
          // TODO: is "done" the best way to observe this?
          const { value, done } = await read();
          if (done) {
            break;
          }
          yield value;
        }
      } finally {
        // TODO: workout if this necessary... might be needed to force clean-up of message channels
        port.close();
      }
    }

    const generator = generatorFn();

    return {
      // TODO: this needs to be improved (e.g. adding calls to the other functions)
      next: () => {
        port.postMessage("NEXT");
        return generator.next();
      },
      [Symbol.iterator]: () => ({
        next: () => {
          port.postMessage("NEXT");
          return generator.next();
        },
        return: value => {
          port.postMessage("RETURN");
          return generator.return(value);
        },
        throw: e => {
          port.postMessage("THROW");
          return generator.throw(e);
        }
      })
    };
  }
});
