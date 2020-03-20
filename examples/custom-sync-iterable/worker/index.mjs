import {
  expose,
  proxy
} from "../../../node_modules/comlink/dist/esm/comlink.mjs";
import "../../../src/generatorTransferHandler.mjs";

const makeStrider = () => {
  let index = 0;
  const stride = 2;

  return {
    [Symbol.iterator]: () => ({
      next: () => {
        index += stride;
        return {
          value: index,
          done: false
        };
      }
    })
  };
};

const exports = {
  makeStrider
};

expose(exports);
