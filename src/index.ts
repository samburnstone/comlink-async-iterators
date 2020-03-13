import { Messages } from "./worker/index";

const worker = new Worker("./worker", { type: "module" });

let isCounting = false;

const buttonTitle = () => (isCounting ? "Stop" : "Start");

const button = document.createElement("button");
button.innerText = buttonTitle();
button.onclick = () => {
  worker.postMessage(
    isCounting ? Messages.STOP_COUNTER : Messages.START_COUNTER
  );
  isCounting = !isCounting;
  button.innerText = buttonTitle();
};
document.body.appendChild(button);
