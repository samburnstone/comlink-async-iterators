# Cross-window async iterators using Comlink

Uses Comlink's `transferHandler` pluggable functionality to add support for async and sync iterables to be called from a different browser execution context.

This repository accompanies [this blog post](https://blog.scottlogic.com/2020/04/22/Async-Iterators-Across-Execution-Contexts.html) which I hope you find informative. Note that you may want to take a look at [this Comlink issue](https://github.com/GoogleChromeLabs/comlink/issues/435) where there's a discussion about how to get generators working using the library.

## Running the examples

A number of different iterable use-cases were trialled to check the transfer handler worked in these cases. You can view these examples by doing the following:

- `yarn install`
- `yarn start` - This will start a server running on `localhost:5000`
- Navigate to `localhost:5000/examples`

Note that the examples are written using ES6 modules in Web Workers - this requires Chrome 80 ([Firefox and Safari don't yet support this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Browser_compatibility)).

## Shortcomings

- Currently, only the iterator / async iterator is callable "over the wire". This means any other properties available on the iterable cannot be accessed.
- If an object is both sync and async iterable, only one will be transferred. Which one is chosen will depend on the order the transfer handlers are added (first one added will have priority).
- I've tested it with a decent range of use-cases, however there are likely many more that I haven't considered. Feel free to raise an issue / PR if you have any questions.
