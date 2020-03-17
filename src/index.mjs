import { wrap } from "../node_modules/comlink/dist/esm/comlink.mjs";
import "./generatorTransferHandler.mjs";

const worker = new Worker("./src/worker/index.mjs", { type: "module" });

const counter = wrap(worker);

const startCounter = async () => {
  const iterable = await counter.start();

  for await (const { value, breakFn } of iterable) {
    const el = document.querySelector("p");
    el.innerText = value;

    if (value === 10) {
      breakFn();
    }
  }
};

(() => {
  let isCounting = false;

  const buttonTitle = () => (isCounting ? "Stop" : "Start");

  const button = document.createElement("button");
  button.innerText = buttonTitle();
  button.addEventListener("click", async () => {
    if (!isCounting) {
      startCounter();
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
