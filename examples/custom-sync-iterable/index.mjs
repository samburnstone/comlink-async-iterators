import {
  transferHandlers,
  wrap
} from "../../node_modules/comlink/dist/esm/comlink.mjs";
import { iteratorTransferHandler } from "../../../src/iterableTransferHandlers.mjs";

transferHandlers.set("iterator", iteratorTransferHandler);

const worker = wrap(new Worker("./worker/index.mjs", { type: "module" }));

(async () => {
  const iterable = await worker.makeStrider();

  // Direct access of iterable - no work. Is this because there's a sync lookup behind the scenes?
  for await (const value of iterable) {
    if (value > 20) {
      return;
    }

    console.log(value);
  }
})();
