const MESSAGE_TYPES = {
  NEXT: "NEXT",
  RETURN: "RETURN",
  THROW: "THROW"
};

const listen = async (iterator, port) => {
  port.onmessage = async ({ data: { type, value } }) => {
    switch (type) {
      case MESSAGE_TYPES.NEXT:
        port.postMessage(await iterator.next(value));
        break;
      case MESSAGE_TYPES.RETURN:
        if (!iterator.return) {
          throw new Error('"return" does not exist on iterator');
        }
        port.postMessage(await iterator.return(value));
        break;
      case MESSAGE_TYPES.THROW:
        if (!iterator.throw) {
          throw new Error('"throw" does not exist on iterator');
        }
        port.postMessage(await iterator.throw(value));
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
    const nextIteratorResult = () =>
      new Promise(resolve => {
        port.onmessage = ({ data }) => {
          resolve(data);
        };
      });

    async function* generatorFn() {
      while (true) {
        // TODO: is "done" the best way to observe this?
        const { value, done } = await nextIteratorResult();
        if (done) {
          break;
        }
        yield value;
      }
    }

    const generator = generatorFn();

    // Cover the case where a user   wants to be able to manually call the iterator methods
    const iterator = {
      next: value => {
        port.postMessage({ type: MESSAGE_TYPES.NEXT, value });
        return generator.next();
      },
      return: value => {
        port.postMessage({ type: MESSAGE_TYPES.RETURN, value });
        generator.return(value);
        return nextIteratorResult();
      },
      throw: async value => {
        port.postMessage({ type: MESSAGE_TYPES.THROW, value });
        const result = await nextIteratorResult();
        if (result.done) {
          return generator.throw(value);
        }
        // Error caught by iterator, return result
        return result;
      }
    };

    // Make it iterable so it can be used in for-await-of statement
    iterator[Symbol.asyncIterator] = () => iterator;

    return iterator;
  }
});

const asyncIteratorTransferHandler = makeTransferHandler(Symbol.asyncIterator);
const iteratorTransferHandler = makeTransferHandler(Symbol.iterator);

export { asyncIteratorTransferHandler, iteratorTransferHandler };
