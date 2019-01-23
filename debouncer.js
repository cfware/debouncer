export class Debouncer {
	constructor(cb, delay = 100, maxDelays = 2) {
		if (typeof cb !== 'function') {
			throw new TypeError('Function is required');
		}

		Object.assign(this, {
			_cb: cb,
			delay,
			maxDelays,
			_lastRun: 0,
			_firstRequest: 0,
			_lastRequest: 0
		});
	}

	_now() {
		this._lastRun = Date.now();
		this._cb();
		this.clear();
	}

	_later() {
		const now = Date.now();
		const delta = now - this._lastRequest;
		const totalDelta = now - this._firstRequest;
		const maxDelay = this.delay * this.maxDelays;
		const maxTimeout = Math.min(maxDelay - totalDelta, this.delay - delta);

		if (this._lastRun && maxTimeout > 0) {
			this._timeout = setTimeout(() => this._later(), maxTimeout);
		} else {
			this._now();
		}
	}

	run() {
		const now = Date.now();

		this._lastRequest = now;
		if (!this._firstRequest) {
			this._firstRequest = now;
		}

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
		this._firstRequest = 0;
		this._lastRequest = 0;
		this._timeout = clearTimeout(this._timeout);
	}
}
