import {
  wrap,
  transferHandlers
} from "../../node_modules/comlink/dist/esm/comlink.mjs";
import { iteratorTransferHandler } from "../../../src/iterableTransferHandlers.js";

transferHandlers.set("iterator", iteratorTransferHandler);

const worker = wrap(new Worker("./worker/index.mjs", { type: "module" }));

(async () => {
  const famousPeopleGenerator = await worker.createFamousPeopleGenerator();

  // First time calling next arg will be ignored (returns Pope as value)
  console.log(await famousPeopleGenerator.next());
  // While our arg is referring to the pope, the value being returned is Victoria Beckham
  console.log(await famousPeopleGenerator.next("Don't know him that well"));
  console.log(await famousPeopleGenerator.next("Not a fan..."));
  console.log(await famousPeopleGenerator.next("Almost forgot about him!"));
})();
