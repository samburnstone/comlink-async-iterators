import {
  expose,
  transferHandlers
} from "../../../node_modules/comlink/dist/esm/comlink.mjs";
import { iterableTransferHandler } from "../../../src/iterableTransferHandlers.js";

transferHandlers.set("iterable", iterableTransferHandler);

function* strider() {
  const stride = 2;
  let index = 0;
  while (true) {
    index += stride;
    yield index;
  }
}

const exports = {
  strider
};

expose(exports);
