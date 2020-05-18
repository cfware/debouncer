# @cfware/debouncer [![NPM Version][npm-image]][npm-url]

Debouncer class

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

## debouncer = new Debouncer(callback, delay, maxDelays)

* `callback` is the callback which is to be rate controlled.  Required, must be a function.
* `delay` is the number of milliseconds to wait before running the callback.  Optional, default `100`.
* `maxDelays` maximum number of full delays before `callback` is run.  Optional, default `2`.

### debouncer.run(immediately = false)

This schedules a call to the callback.

If `immediately` is enabled the callback is run immediately.

### debouncer.flush()

This forces the callback to run immediately.

### debouncer.clear()

Cancel any scheduled runs of the callback.


[npm-image]: https://img.shields.io/npm/v/@cfware/debouncer.svg
[npm-url]: https://npmjs.org/package/@cfware/debouncer
