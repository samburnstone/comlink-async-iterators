import {
  expose,
  transferHandlers
} from "../../../node_modules/comlink/dist/esm/comlink.mjs";
import { iteratorTransferHandler } from "../../../src/iterableTransferHandlers.js";

transferHandlers.set("iterator", iteratorTransferHandler);

function* createFamousPeopleGenerator() {
  const famousPeople = ["The Pope", "Victoria Beckham", "Michael Owen"];
  for (const person of famousPeople) {
    const verdict = yield person;
    console.log(`Verdict on ${person}: ${verdict}`);
  }
}

const exports = {
  createFamousPeopleGenerator
};

expose(exports);
