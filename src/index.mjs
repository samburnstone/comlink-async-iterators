import { wrap } from "../node_modules/comlink/dist/esm/comlink.mjs";
import "./generatorTransferHandler.mjs";

const worker = new Worker("./src/worker/index.mjs", { type: "module" });

const counter = wrap(worker);

(() => {
  let isCounting = false;

  const buttonTitle = () => (isCounting ? "Stop" : "Start");

  const button = document.createElement("button");
  button.innerText = buttonTitle();
  button.addEventListener("click", async () => {
    if (!isCounting) {
      const iter = await counter.start();
      for await (const value of iter) {
        console.log(value);
      }
    } else {
      counter.stop();
    }

    isCounting = !isCounting;
    button.innerText = buttonTitle();
  });
  document.body.appendChild(button);
})();

// Counter paragraph
(() => {
  const counter = document.createElement("p");
  document.body.appendChild(counter);
})();

const displayCounterValue = value => {
  const counterEl = document.querySelector("p");
  if (counterEl) {
    counterEl.innerText = String(value);
  }
};
