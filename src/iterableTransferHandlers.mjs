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

const makeTransferHandler = symbolLookup => ({
  canHandle: obj => {
    return obj && obj[symbolLookup];
  },
  serialize: iterable => {
    const { port1, port2 } = new MessageChannel();
    listen(iterable[symbolLookup](), port1);
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

    // Always return an asyncIterator from the main threads point of view
    // TODO: need to forward on params via post message
    return {
      [Symbol.asyncIterator]: () => ({
        next: value => {
          port.postMessage("NEXT");
          return generator.next();
        },
        return: value => {
          port.postMessage("RETURN");
          return generator.return();
        },
        throw: e => {
          port.postMessage("THROW");
          return generator.throw();
        }
      })
    };
  }
});

const asyncIteratorTransferHandler = makeTransferHandler(Symbol.asyncIterator);
const iteratorTransferHandler = makeTransferHandler(Symbol.iterator);

export { asyncIteratorTransferHandler, iteratorTransferHandler };
