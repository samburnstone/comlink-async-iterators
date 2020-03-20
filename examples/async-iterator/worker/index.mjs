import {
  expose,
  proxy
} from "../../../node_modules/comlink/dist/esm/comlink.mjs";
import "../../../src/generatorTransferHandler.mjs";

const sleep = () =>
  new Promise(res => {
    setTimeout(res, 1000);
  });

function makeCounter() {
  let counter = 0;
  return proxy({
    next: async () => {
      await sleep();
      counter++;
      return {
        value: counter,
        done: false
      };
    }
  });
}

const exports = {
  makeCounter: makeCounter
};

expose(exports);
