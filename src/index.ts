import { proxy, wrap } from "comlink";
import { Counter } from "./worker/index";

const worker = new Worker("./worker", { type: "module" });

const counter = wrap<Counter>(worker);

(() => {
  let isCounting = false;

  const buttonTitle = () => (isCounting ? "Stop" : "Start");

  const button = document.createElement("button");
  button.innerText = buttonTitle();
  button.addEventListener("click", () => {
    if (!isCounting) {
      counter.start(proxy(displayCounterValue));
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

const displayCounterValue = (value: number) => {
  const counterEl = document.querySelector("p");
  if (counterEl) {
    counterEl.innerText = String(value);
  }
};
