import { wrap } from "comlink";
import { Counter } from "./worker/index";

const worker = new Worker("./worker", { type: "module" });

const counter = wrap<Counter>(worker);

(() => {
  let isCounting = false;

  const buttonTitle = () => (isCounting ? "Stop" : "Start");

  const button = document.createElement("button");
  button.innerText = buttonTitle();
  button.addEventListener("click", () => {
    if (isCounting) {
      counter.start();
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

// Handle worker message
worker.addEventListener("message", e => {
  const p = document.querySelector("p");
  if (p) {
    p.innerText = e.data;
  }
});
