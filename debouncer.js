export class Debouncer {
	constructor(cb, delay = 100, maxDelays = Number.MAX_SAFE_INTEGER) {
		if (typeof cb !== 'function') {
			throw new TypeError('Function is required');
		}

		Object.assign(this, {
			_cb: cb,
			delay,
			maxDelays,
			_delaysCount: 0,
			_lastRun: 0,
			_lastRequest: 0
		});
	}

	_now() {
		this._delaysCount = 0;
		this._lastRun = Date.now();
		this._cb();
		this.clear();
	}

	_later() {
		const delta = Date.now() - this._lastRequest;

		if (this._lastRun && delta < this.delay && this._delaysCount < this.maxDelays) {
			this._delaysCount++;
			this._timeout = setTimeout(() => this._later(), this.delay - delta);
		} else {
			this._now();
		}
	}

	run() {
		this._lastRequest = Date.now();

		if (!this._timeout) {
			this._timeout = setTimeout(() => this._later(), this.delay);
		}
	}

	flush() {
		if (this._timeout) {
			this._now();
		}
	}

	clear() {
		this._timeout = clearTimeout(this._timeout);
	}
}
