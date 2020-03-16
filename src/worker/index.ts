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

const start = async () => {
  shouldCount = true;
  for await (const value of counter()) {
    if (!shouldCount) {
      break;
    }
    postMessage(value);
  }
};

const stop = () => {
  shouldCount = false;
};

const exports = {
  start,
  stop
};

export type Counter = typeof exports;

export default exports;
