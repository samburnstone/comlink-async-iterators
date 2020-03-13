import worker from './worker'

(async () => {
  for await (const value of worker()) {
    console.log(value);
  }
})()
