import * as Comlink from "../node_modules/comlink/dist/esm/comlink.mjs";

Comlink.transferHandlers.set("GENERATOR", {
  canHandle: obj => obj instanceof AsyncGenerator,
  serialize: ev => {
    console.log("I'm a generator!");
    return "Sam";
  },
  deserialize: obj => obj
});
