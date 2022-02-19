# BPF Upgradeable Solana JavaScript API

This is the Solana JavaScript API for [BPF Upgradeable Loader](https://docs.solana.com/ru/developing/runtime-facilities/programs#bpf-loader) program.

## Installation

### Yarn

```
$ yarn add @project-serum/web3.js-bpf-upgradeable
```

### npm

```
$ npm install --save @project-serum/web3.js-bpf-upgradeable
```

## Usage

### Javascript

```js
const solanaWeb3Bpf = require('@project-serum/web3.js-bpf-upgradeable');
console.log(solanaWeb3Bpf);
```

### ES6

```js
import * as solanaWeb3Bpf from '@project-serum/web3.js-bpf-upgradeable';
console.log(solanaWeb3Bpf);
```

### Browser bundle

```js
// `solanaWeb3Bpf` is provided in the global namespace by the `solanaWeb3Bpf.min.js` script bundle.
console.log(solanaWeb3Bpf);
```

## Example

See [code in test](./test/index.test.ts).
