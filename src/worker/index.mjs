import { expose } from "../../node_modules/comlink/dist/esm/comlink.mjs";
import "../generatorTransferHandler.mjs";

let shouldCount = false;

const sleep = () =>
  new Promise(res => {
    setTimeout(res, 1000);
  });

async function* start() {
  let counter = 0;
  while (true) {
    yield counter++;
    await sleep();
  }
}

const stop = () => {
  shouldCount = false;
};

const exports = {
  start,
  stop
};

expose(exports);
