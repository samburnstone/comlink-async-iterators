const sleep = () => new Promise((res) => {
  setTimeout(res, 1000);
});

export default () => ({
  [Symbol.asyncIterator]: async function* () {
    let counter = 0;
    while (true) {
      yield counter++;
      await sleep();
    }
  }
});
