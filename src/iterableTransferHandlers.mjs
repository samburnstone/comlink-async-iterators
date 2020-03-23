const listen = async (iterator, port) => {
  port.onmessage = async ({ data: { type, value } }) => {
    switch (type) {
      case "NEXT":
        port.postMessage(await iterator.next(value));
        break;
      case "RETURN":
        if (iterator.return) {
          port.postMessage(await iterator.return(value));
        }
        break;
      case "THROW":
        if (iterator.throw) {
          port.postMessage(await iterator.throw(value));
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

    const iterator = {
      next: value => {
        port.postMessage({ type: "NEXT", value });
        return generator.next();
      },
      return: value => {
        port.postMessage({ type: "RETURN", value });
        return generator.return();
      },
      throw: value => {
        port.postMessage({ type: "ERROR", value });
        return generator.throw();
      }
    };

    iterator[Symbol.asyncIterator] = () => iterator;

    return iterator;
  }
});

const asyncIteratorTransferHandler = makeTransferHandler(Symbol.asyncIterator);
const iteratorTransferHandler = makeTransferHandler(Symbol.iterator);

export { asyncIteratorTransferHandler, iteratorTransferHandler };
