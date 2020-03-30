import {
  wrap,
  transferHandlers
} from "../../node_modules/comlink/dist/esm/comlink.mjs";
import { asyncIterableTransferHandler } from "../../../src/iterableTransferHandlers.js";

transferHandlers.set("asyncIterable", asyncIterableTransferHandler);

const subscriptionService = wrap(
  new Worker("./worker/index.mjs", { type: "module" })
);

const startSubscription = async stockSymbol => {
  const priceEl = document.createElement("p");
  priceEl.innerText = `${stockSymbol}: -`;
  document.body.appendChild(priceEl);

  const stopButtonEl = document.createElement("button");
  stopButtonEl.innerText = "Stop!";
  document.body.appendChild(stopButtonEl);

  const iterator = await subscriptionService.startSubscription(stockSymbol);

  stopButtonEl.addEventListener("click", () => {
    iterator.return();
    stopButtonEl.disabled = true;
  });

  for await (const price of iterator) {
    priceEl.innerText = `${stockSymbol}: ${price.toFixed(2)}`;
  }
};

startSubscription("TSLA");
startSubscription("APPL");
startSubscription("IBM");
