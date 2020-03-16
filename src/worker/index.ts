import { expose } from "comlink";

let shouldCount = false;

const sleep = () =>
  new Promise(res => {
    setTimeout(res, 1000);
  });

async function* startGenerator() {
  let counter = 0;
  while (true && shouldCount) {
    yield counter++;
    await sleep();
  }
}

const start = async (callback: (value: number) => void) => {
  shouldCount = true;
  for await (const value of startGenerator()) {
    callback(value);
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

expose(exports);
