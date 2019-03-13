# @cfware/debouncer

[![Travis CI][travis-image]][travis-url]
[![Greenkeeper badge][gk-image]](https://greenkeeper.io/)
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![MIT][license-image]](LICENSE)

Debouncer class

### Install @cfware/debouncer

This module is distributed in ES module format, no CJS is provided.  The intended
target is modern web browsers though this should work from node.js provided ES
module support is enabled.

```sh
npm i --save @cfware/debouncer
```

## Usage

```js
import Debouncer from '@cfware/debouncer';

const debouncer = new Debouncer(() => {
	console.log('debounced callback');
});

// Only run the callback once.
debouncer.run();
setTimeout(() => debouncer.run(), 50);
```

## debouncer = new Debouncer(cb, delay, maxDelays)

* `cb` is the callback which is to be rate controlled.  Required, must be a function.
* `delay` is the number of milliseconds to wait before running the callback.  Optional, default `100`.
* `maxDelays` maximum number of full delays before `cb` is run.  Optional, default `2`.

### debouncer.run(immediately = false)

This schedules a call to the callback.

If `immediately` is enabled the callback is run immediately.

### debouncer.flush()

This forces the callback to run immediately.

### debouncer.clear()

Cancel any scheduled runs of the callback.

## Running tests

Tests are provided by xo and ava.

```sh
npm install
npm test
```

[npm-image]: https://img.shields.io/npm/v/@cfware/debouncer.svg
[npm-url]: https://npmjs.org/package/@cfware/debouncer
[travis-image]: https://travis-ci.org/cfware/debouncer.svg?branch=master
[travis-url]: https://travis-ci.org/cfware/debouncer
[gk-image]: https://badges.greenkeeper.io/cfware/debouncer.svg
[downloads-image]: https://img.shields.io/npm/dm/@cfware/debouncer.svg
[downloads-url]: https://npmjs.org/package/@cfware/debouncer
[license-image]: https://img.shields.io/npm/l/@cfware/debouncer.svg
