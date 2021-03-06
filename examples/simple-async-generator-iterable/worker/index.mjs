import {
  expose,
  transferHandlers
} from "../../../node_modules/comlink/dist/esm/comlink.mjs";
import { asyncIterableTransferHandler } from "../../../src/iterableTransferHandlers.js";

transferHandlers.set("asyncIterable", asyncIterableTransferHandler);

let shouldCount = false;

const sleep = () =>
  new Promise(res => {
    setTimeout(res, 1000);
  });

async function* start() {
  shouldCount = true;
  let counter = 0;
  while (shouldCount) {
    yield counter++;
    await sleep();
  }
}

// TODO: do we need to inform other way where the generator exits.
const stop = () => {
  shouldCount = false;
};

const exports = {
  start,
  stop
};

expose(exports);
