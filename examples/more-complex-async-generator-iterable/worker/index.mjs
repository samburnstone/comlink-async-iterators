import {
  expose,
  transferHandlers
} from "../../../node_modules/comlink/dist/esm/comlink.mjs";
import { asyncIteratorTransferHandler } from "../../../src/iterableTransferHandlers.js";

transferHandlers.set("asyncIterator", asyncIteratorTransferHandler);

async function* fetchCommits(repo) {
  let url = `https://api.github.com/repos/${repo}/commits`;

  while (url) {
    const response = await fetch(url);

    const body = await response.json();

    let nextPage = response.headers.get("Link").match(/<(.*?)>; rel="next"/);
    nextPage = nextPage && nextPage[1];

    url = nextPage;

    for (let commit of body) {
      yield commit;
    }
  }
}

const exports = {
  fetchCommits
};

expose(exports);
