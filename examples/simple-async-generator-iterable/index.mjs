import {
  wrap,
  transferHandlers
} from "../../node_modules/comlink/dist/esm/comlink.mjs";
import { asyncIteratorTransferHandler } from "../../../src/iterableTransferHandlers.mjs";

transferHandlers.set("asyncIterator", asyncIteratorTransferHandler);

const worker = new Worker("./worker/index.mjs", { type: "module" });

let isCounting = false;
const counter = wrap(worker);

const startCounter = async () => {
  const iterable = await counter.start();

  for await (const value of iterable) {
    const el = document.querySelector("p");
    el.innerText = value;

    if (value === 10) {
      break;
    }
  }
  isCounting = false;
  updateButtonTitle();
};

const button = document.createElement("button");

const updateButtonTitle = () =>
  (button.innerText = isCounting ? "Stop" : "Start");

updateButtonTitle();
button.addEventListener("click", async () => {
  if (!isCounting) {
    startCounter();
  } else {
    await counter.stop();
    isCounting = false;
    updateButtonTitle();
  }

  isCounting = !isCounting;
  updateButtonTitle();
});
document.body.appendChild(button);

// Counter paragraph
const counterEl = document.createElement("p");
document.body.appendChild(counterEl);
