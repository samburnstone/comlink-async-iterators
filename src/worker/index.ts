export enum Messages {
  START_COUNTER = "START_COUNTER",
  STOP_COUNTER = "STOP_COUNTER"
}

const sleep = () =>
  new Promise(res => {
    setTimeout(res, 1000);
  });

async function* counter() {
  let counter = 0;
  while (true) {
    yield counter++;
    await sleep();
  }
}

let shouldCount = false;

const postMessage = (message: any) => {
  const worker: Worker = self as any;
  worker.postMessage(message);
};

addEventListener("message", async e => {
  if (e.data === Messages.START_COUNTER) {
    shouldCount = true;
    for await (const value of counter()) {
      if (!shouldCount) {
        console.log("Counter cancelled");
        break;
      }
      postMessage(value);
    }
  }

  if (e.data === Messages.STOP_COUNTER) {
    shouldCount = false;
  }
});
