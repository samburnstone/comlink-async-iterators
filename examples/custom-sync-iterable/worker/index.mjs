import {
  expose,
  transferHandlers
} from "../../../node_modules/comlink/dist/esm/comlink.mjs";
import { iteratorTransferHandler } from "../../../src/iterableTransferHandlers.js";

transferHandlers.set("iterator", iteratorTransferHandler);

const makeStrider = () => {
  const stride = 2;

  return {
    sum: (a, b) => {
      return a + b;
    },
    [Symbol.iterator]: () => {
      let index = 0;
      return {
        next: () => {
          index += stride;
          return {
            value: index,
            done: false
          };
        }
      };
    }
  };
};

const exports = {
  makeStrider
};

expose(exports);
