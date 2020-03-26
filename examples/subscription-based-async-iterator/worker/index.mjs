import {
  expose,
  transferHandlers
} from "../../../node_modules/comlink/dist/esm/comlink.mjs";
import { asyncIteratorTransferHandler } from "../../../src/iterableTransferHandlers.mjs";

transferHandlers.set("asyncIterator", asyncIteratorTransferHandler);

let shouldCount = false;

const sleep = () =>
  new Promise(res => {
    setTimeout(res, 1000);
  });

async function* startSubscription(stockSymbol) {
  let currentPrice = Math.random() * 50;
  while (true) {
    currentPrice += Math.random();
    yield currentPrice;
    await sleep();
  }
}

const exports = {
  startSubscription
};

expose(exports);
