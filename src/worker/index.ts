const sleep = () =>
  new Promise(res => {
    setTimeout(res, 1000);
  });

(async () => {
  let counter = 0;
  while (true) {
    await sleep();

    // Trick to allow us to use the Worker.postMessage rather than Window.postMessage (signature's differ, so TS will complain)
    const ctx: Worker = self as any;
    ctx.postMessage(counter++);
  }
})();
