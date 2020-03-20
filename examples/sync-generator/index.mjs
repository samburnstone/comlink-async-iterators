import { wrap } from "../../node_modules/comlink/dist/esm/comlink.mjs";
import "../../../src/generatorTransferHandler.mjs";

const worker = wrap(new Worker("./worker/index.mjs", { type: "module" }));

(async () => {
  const strider = await worker.strider();

  const button = document.createElement("button");
  button.innerText = "Next";

  const counterEl = document.createElement("p");
  document.body.appendChild(counterEl);

  button.addEventListener("click", async () => {
    const { value } = await strider.next();
    counterEl.innerText = value;
  });
  document.body.appendChild(button);
})();
