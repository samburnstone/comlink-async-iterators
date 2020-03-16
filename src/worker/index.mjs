import { expose } from "../../node_modules/comlink/dist/esm/comlink.mjs";
import "../generatorTransferHandler.mjs";

let shouldCount = false;

const sleep = () =>
  new Promise(res => {
    setTimeout(res, 1000);
  });

async function* startGenerator() {
  let counter = 0;
  while (true && shouldCount) {
    yield counter++;
    await sleep();
  }
}

const start = () => {
  return startGenerator()[Symbol.asyncIterator]();
};

const stop = () => {
  shouldCount = false;
};

const exports = {
  start,
  stop
};

expose(exports);
