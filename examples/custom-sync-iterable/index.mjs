import { wrap } from "../../node_modules/comlink/dist/esm/comlink.mjs";
import "../../../src/generatorTransferHandler.mjs";

const worker = wrap(new Worker("./worker/index.mjs", { type: "module" }));

(async () => {
  let counter = 0;
  const strider = await worker.makeStrider();

  // Note: even a sync-iterator becomes async
  for await (const value of strider) {
    if (counter > 10) {
      break;
    }
    console.log(value);
    counter++;
  }
})();
