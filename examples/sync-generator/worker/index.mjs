import {
  expose,
  proxy
} from "../../../node_modules/comlink/dist/esm/comlink.mjs";
import "../../../src/generatorTransferHandler.mjs";

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
