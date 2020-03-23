import {
  wrap,
  transferHandlers
} from "../../node_modules/comlink/dist/esm/comlink.mjs";
import { asyncIteratorTransferHandler } from "../../../src/iterableTransferHandlers.mjs";

transferHandlers.set("asyncIterator", asyncIteratorTransferHandler);

const commitFetcher = wrap(
  new Worker("./worker/index.mjs", { type: "module" })
);

const startFetching = async () => {
  let count = 0;

  for await (const commit of await commitFetcher.fetchCommits("apple/swift")) {
    const commitAuthor = !!commit.author
      ? commit.author.login
      : "Author not available";

    const authorElement = document.createElement("p");
    authorElement.innerText = commitAuthor;
    document.body.appendChild(authorElement);

    if (++count === 100) {
      // 100 commits is quite enough
      break;
    }
  }
};

const button = document.createElement("button");
button.innerText = "Start";

button.addEventListener("click", async () => {
  startFetching();
  button.style.display = "none";
});
document.body.appendChild(button);
