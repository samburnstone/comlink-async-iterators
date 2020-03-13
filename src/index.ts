const worker = new Worker("./worker.ts", { type: "module" });

worker.onmessage = event => {
  console.log(event.data);
};
