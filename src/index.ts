import { Messages } from "./worker/index";

const worker = new Worker("./worker", { type: "module" });

(() => {
  let isCounting = false;

  const buttonTitle = () => (isCounting ? "Stop" : "Start");

  const button = document.createElement("button");
  button.innerText = buttonTitle();
  button.addEventListener("click", () => {
    worker.postMessage(
      isCounting ? Messages.STOP_COUNTER : Messages.START_COUNTER
    );
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
  console.log(e);
  const p = document.querySelector("p");
  if (p) {
    p.innerText = e.data;
  }
});
